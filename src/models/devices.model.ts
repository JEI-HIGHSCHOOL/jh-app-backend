import { model, Schema, Document } from 'mongoose';
import { Device } from '@interfaces/users.interface';

const deviceSchema: Schema = new Schema({
  deviceId: {
    type: String,
    required: true,
  },
  pushToken: {
    type: String
  },
  pushPermission: {
    type: Boolean
  }
});

const deviceModel = model<Device & Document>('device', deviceSchema);

export default deviceModel;
