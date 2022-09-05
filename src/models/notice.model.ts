import { model, Schema, Document } from 'mongoose';
import { Notice } from '@/interfaces/notice.interface';

const noticeSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String
  },
  publisher: {
    type: String
  },
  published_date: { type: Date, default: Date.now },

});

const noticeModel = model<Notice & Document>('notice', noticeSchema);

export default noticeModel;
