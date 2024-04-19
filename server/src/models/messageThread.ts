import mongoose from "mongoose";

const messageThreadSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    buyerIds: [{ 
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }],
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true }
);

const MessageThread = mongoose.model("MessageThread", messageThreadSchema);
export default MessageThread;
