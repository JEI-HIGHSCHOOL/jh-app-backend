import { model, Schema, Document } from 'mongoose';
import { StudentBusBoarding } from '@interfaces/users.interface';

const studentBordingSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  busId: {
    type: String,
    required: true,
  },
  bordingTime: {
    type: Date,
    required: true,
  }, 
});

const studentBordingModel = model<StudentBusBoarding & Document>('StudentBording', studentBordingSchema);

export default studentBordingModel;
