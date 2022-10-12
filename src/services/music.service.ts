import userModel from "@models/users.model";
import { Request } from "express";
import { importData, getData } from "@utils/googleSheetAPI";
import { Music } from "@/dtos/music.dto";
import musicModel from "@/models/music.model";
import dayjs from "dayjs";
import { HttpException } from "@/exceptions/HttpException";
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
    await importData([[dayjs().locale('ko').format("YYYY. M. D A HH:mm:ss"), "위 내용을 숙지 하였으며 준수하도록 하겠습니다", song, deviceId]]);
    await musicDB.save();
    const musicList = await getData();
    return musicList.data.values.length;
  }
}

export default MusicService;
