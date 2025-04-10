import { Schema, model, models } from 'mongoose';

const messageSchema = new Schema({
  sender: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  roomId: { type: String, required: true },
});

const Message = models.Message || model('Message', messageSchema);
export default Message;
