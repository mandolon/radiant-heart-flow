
import { useCallback, useState } from "react";
import { updateTaskSupabase } from '@/data/taskSupabase';
import { Task } from '@/types/task';

type UseTaskDetailDescriptionSaveResult = {
  desc: string;
  setDesc: (s: string) => void;
  descLoading: boolean;
  handleSaveDescription: (newDesc: string) => Promise<void>;
};

export function useTaskDetailDescriptionSave(task: Task, setTask: (t: Task) => void, isSupabaseTask: boolean): UseTaskDetailDescriptionSaveResult {
  const [desc, setDesc] = useState(task.description ?? "");
  const [descLoading, setDescLoading] = useState(false);

  const handleSaveDescription = useCallback(async (newDesc: string) => {
    if (newDesc === task.description) return;
    setDescLoading(true);
    setDesc(newDesc);
    try {
      if (isSupabaseTask) {
        await updateTaskSupabase(task.taskId, { description: newDesc });
        setTask(t => ({ ...t, description: newDesc, updatedAt: new Date().toISOString() }));
      }
    } finally {
      setDescLoading(false);
    }
  }, [task.description, task.taskId, isSupabaseTask, setTask]);

  return {
    desc,
    setDesc,
    descLoading,
    handleSaveDescription,
  };
}
