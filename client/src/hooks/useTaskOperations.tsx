import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task } from '@/types/task';
import { fetchAllTasks, createTask, updateTask, deleteTask } from '@/data/api';
import { useWebSocket } from './useWebSocket';

export function useTaskOperations() {
  const [customTasks, setCustomTasks] = useState<Task[]>([]);
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const queryClient = useQueryClient();

  // WebSocket connection for real-time updates
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const wsUrl = `${protocol}//${window.location.host}/ws`;
  
  const handleWebSocketMessage = useCallback((message: { event: string; data: any }) => {
    console.log('WebSocket message received:', message);
    
    switch (message.event) {
      case 'task_created':
        setCustomTasks(prev => [...prev, message.data]);
        queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
        break;
      
      case 'task_updated':
        setCustomTasks(prev => 
          prev.map(task => 
            task.taskId === message.data.taskId ? message.data : task
          )
        );
        queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
        break;
      
      case 'task_deleted':
        setCustomTasks(prev => 
          prev.filter(task => task.taskId !== message.data.taskId)
        );
        queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
        break;
      
      default:
        console.log('Unknown WebSocket event:', message.event);
    }
  }, [queryClient]);

  const { isConnected } = useWebSocket(wsUrl, handleWebSocketMessage);

  // Fetch tasks query
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['/api/tasks'],
    queryFn: fetchAllTasks,
    refetchOnWindowFocus: false,
  });

  // Update local state when tasks change
  useEffect(() => {
    const activeTasks = tasks.filter(task => !task.archived);
    const archived = tasks.filter(task => task.archived);
    setCustomTasks(activeTasks);
    setArchivedTasks(archived);
  }, [tasks]);

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string; updates: Partial<Task> }) =>
      updateTask(taskId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    },
  });

  const createTaskHandler = useCallback((taskData: any) => {
    createTaskMutation.mutate(taskData);
  }, [createTaskMutation]);

  const updateTaskById = useCallback((taskId: number, updates: Partial<Task>) => {
    const task = customTasks.find(t => t.id === taskId);
    if (task) {
      updateTaskMutation.mutate({ taskId: task.taskId, updates });
    }
  }, [customTasks, updateTaskMutation]);

  const deleteTaskHandler = useCallback(async (taskId: number): Promise<void> => {
    const task = customTasks.find(t => t.id === taskId);
    if (task) {
      deleteTaskMutation.mutate(task.taskId);
    }
  }, [customTasks, deleteTaskMutation]);

  const restoreDeletedTask = useCallback((taskId: number) => {
    // Implementation for restoring deleted tasks
    console.log('Restore task:', taskId);
  }, []);

  const archiveTask = useCallback((taskId: number) => {
    updateTaskById(taskId, { archived: true });
  }, [updateTaskById]);

  const navigateToTask = useCallback((task: Task) => {
    console.log('Navigate to task:', task);
  }, []);

  const getTasksByStatus = useCallback((status: string) => {
    return customTasks.filter(task => task.status === status);
  }, [customTasks]);

  const getAllTasks = useCallback(() => {
    return customTasks;
  }, [customTasks]);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
    queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
  }, [queryClient]);

  return useMemo(() => ({
    customTasks,
    archivedTasks,
    refreshTrigger,
    isLoading,
    isConnected,
    createTask: createTaskHandler,
    updateTaskById,
    deleteTask: deleteTaskHandler,
    restoreDeletedTask,
    archiveTask,
    navigateToTask,
    getTasksByStatus,
    getAllTasks,
    triggerRefresh,
  }), [
    customTasks,
    archivedTasks,
    refreshTrigger,
    isLoading,
    isConnected,
    createTaskHandler,
    updateTaskById,
    deleteTaskHandler,
    restoreDeletedTask,
    archiveTask,
    navigateToTask,
    getTasksByStatus,
    getAllTasks,
    triggerRefresh,
  ]);
}