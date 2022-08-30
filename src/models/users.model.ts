import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/users.interface';

const userSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  flags: {
    type: Number,
    required: true,
  },
});

const userModel = model<User & Document>('User', userSchema);

export default userModel;
