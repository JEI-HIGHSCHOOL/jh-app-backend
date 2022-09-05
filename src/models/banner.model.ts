import { model, Schema, Document } from 'mongoose';
import { Banner } from '@/interfaces/banner.interface';

const bannerSchema: Schema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String
  },
  color: {
    type: String
  },
  icon: {
    type: String
  },
  url: {
    type: String
  },
  show: {
    type: Boolean
  },
  published_date: { type: Date, default: Date.now },
});

const bannerModel = model<Banner & Document>('banners', bannerSchema);

export default bannerModel;
