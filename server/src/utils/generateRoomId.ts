import { ObjectId } from 'mongoose';

export function generateRoomId(userId1: string | undefined, userId2: string | undefined, carId: ObjectId | string | null): string | null {
  if (!userId1 || !userId2 || !carId) {
    throw new Error('userId1, userId2 and carId are required');
  }

  const orderedIds = [userId1, userId2, carId].sort();
  return `chat-${orderedIds.join("-")}`; // Example with prefix
}