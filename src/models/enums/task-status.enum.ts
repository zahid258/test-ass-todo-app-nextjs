export type TaskStatus = 
  | 'PENDING'       // Task created but not yet started
  | 'ASSIGNED'      // Task has been assigned to a user
  | 'IN_PROGRESS'   // Work has begun on the task
  | 'BLOCKED'       // Cannot proceed due to dependencies or issues
  | 'COMPLETED'     // Successfully finished
  | 'ARCHIVED'; 
  export const taskStatuses = [
    "PENDING",
    "ASSIGNED",
    "IN_PROGRESS",
    "BLOCKED",
    "COMPLETED",
    "ARCHIVED",
  ] as const;
