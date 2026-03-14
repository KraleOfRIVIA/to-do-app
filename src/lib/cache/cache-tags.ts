export function getUserTasksTag(userId: string) {
  return `user:${userId}:tasks`;
}

export function getUserProfileTag(userId: string) {
  return `user:${userId}:profile`;
}
