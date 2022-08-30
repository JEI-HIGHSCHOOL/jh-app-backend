import { model, Schema, Document } from "mongoose";
import { Music } from "@/interfaces/music.interface";

const musicSchema: Schema = new Schema({
  deviceId: {
    type: String,
    required: true,
  },
  song: {
    type: String,
    required: true,
  },
  published_date: { type: Date, default: Date.now },
});

const musicModel = model<Music & Document>("Music", musicSchema);

export default musicModel;
