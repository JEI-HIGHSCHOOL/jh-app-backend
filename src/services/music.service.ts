import userModel from "@models/users.model";
import { Request } from "express";
import { importData, getData } from "@utils/googleSheetAPI";
import { Music } from "@/dtos/music.dto";
import musicModel from "@/models/music.model";
import { getDate } from "@/utils/util";
import dayjs from "dayjs";
require('dayjs/locale/ko')

class MusicService {
  public users = userModel;
  public musics = musicModel;

  public async addMusic(req: Request): Promise<any> {
    const { deviceId, song } = req.body as Music;
    const musicDB = new this.musics({
      deviceId,
      song,
    });
    await importData([[dayjs(new Date()).locale('ko').format("YYYY. MM. DD A HH:mm:ss"), song, "위 내용을 숙지 하였으며 준수하도록 하겠습니다", deviceId]]);
    await musicDB.save();
    const musicList = await getData();
    return musicList.data.values.length;
  }
}

export default MusicService;
