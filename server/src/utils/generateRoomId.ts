import { ObjectId } from 'mongoose';

export function generateRoomId(userId1: ObjectId | string, userId2: ObjectId | string): string {
  if (!userId1 || !userId2) {
    throw new Error('Both userId1 and userId2 are required');
  }

  const orderedIds = [userId1, userId2].sort();
  return `chat-${orderedIds.join("-")}`; // Example with prefix
}