import mongoose from 'mongoose';
const { Schema, models } = mongoose;

const chatSchema = new Schema({
  participants: { type: Array, required: true },
  chatId: [{ type: String, required: true }],
  createdAt: { type: Date, default: Date.now },
});

const Chat = models.Chat || mongoose.model('Chat', chatSchema);
export default Chat;
