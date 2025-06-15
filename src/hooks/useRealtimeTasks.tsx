
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types/task";
import { fetchAllTasks, dbRowToTask } from "@/data/taskSupabase";
import { useUser } from "@/contexts/UserContext";
import { filterTasksForUser, canUserViewTask } from "@/utils/taskVisibility";

export function useRealtimeTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const loadingRef = useRef(false);
  const { currentUser } = useUser();

  // Filters and sets tasks so users only see what they should
  const secureSetTasks = (allTasks: Task[]) => {
    setTasks(filterTasksForUser(allTasks, currentUser));
  };

  useEffect(() => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    fetchAllTasks()
      .then(secureSetTasks)
      .finally(() => {
        loadingRef.current = false;
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    // Enhanced: handle real-time payloads for instant UI updates
    const channel = supabase
      .channel("public-tasks-change")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        payload => {
          // Get the real-time row and event type
          const row = payload.new ?? payload.old;
          if (!row) return;

          console.log("Supabase realtime event received:", {
            eventType: payload.eventType,
            row,
            payload,
            currentUser,
          });

          setTasks(prev => {
            // Re-run filter on prev for safety
            const filteredPrev = filterTasksForUser(prev, currentUser);

            const task = dbRowToTask(row);

            // Only update UI if new/changed/removed task matches visibility for this user
            const visible = canUserViewTask(task, currentUser);
            if (!visible.allowed) {
              // If losing access and present, remove
              if (filteredPrev.some(t => t.id === task.id)) {
                return filteredPrev.filter(t => t.id !== task.id);
              }
              // Not present, do nothing
              return filteredPrev;
            }

            if (payload.eventType === "INSERT") {
              // Only add if not already present in state
              if (!filteredPrev.some(t => t.id === task.id)) {
                // Debug
                console.log("[Realtime] INSERT: Adding task to local state", task);
                return [task, ...filteredPrev];
              }
              return filteredPrev;
            }
            if (payload.eventType === "UPDATE") {
              // Debug
              console.log("[Realtime] UPDATE: Updating existing task", task);
              const present = filteredPrev.some(t => t.id === task.id);
              if (present) {
                return filteredPrev.map(t => (t.id === task.id ? task : t));
              }
              // Was not visible before, now is visible
              return [task, ...filteredPrev];
            }
            if (payload.eventType === "DELETE") {
              // Debug
              console.log("[Realtime] DELETE: Removing task from local state", task);
              // Remove deleted task from filtered list
              return filteredPrev.filter(t => t.id !== task.id);
            }
            return filteredPrev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return { tasks, setTasks: secureSetTasks, loading };
}

