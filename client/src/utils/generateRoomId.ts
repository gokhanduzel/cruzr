export function generateRoomId(userId1: string | null, carId: string | null): string | null {
  if (!userId1 || !carId) {
    throw new Error('userId1, userId2 and carId are required');
  }

  const orderedIds = [userId1, carId].sort();
  return `chat-${orderedIds.join("-")}`; // Example with prefix
}