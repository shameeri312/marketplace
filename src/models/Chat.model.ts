import { Schema, model, models } from 'mongoose';

const chatSchema = new Schema({
  name: { type: String, required: true },
  participants: [{ type: String, required: true }],
  createdAt: { type: Date, default: Date.now },
});

const Chat = models.Chat || model('Chat', chatSchema);
export default Chat;
