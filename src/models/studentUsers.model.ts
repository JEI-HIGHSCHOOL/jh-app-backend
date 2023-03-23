import { model, Schema, Document } from 'mongoose';
import { StudentUser } from '@interfaces/users.interface';

const studentUserSchema: Schema = new Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  route: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    required: true,
  },
});

const studentUserModel = model<StudentUser & Document>('StudentUser', studentUserSchema);

export default studentUserModel;
