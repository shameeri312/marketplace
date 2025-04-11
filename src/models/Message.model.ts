import mongoose from 'mongoose';
const { Schema, models } = mongoose;

const messageSchema = new Schema({
  sender: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  roomId: { type: String, required: true },
});

const Message = models.Message || mongoose.model('Message', messageSchema);
export default Message;
