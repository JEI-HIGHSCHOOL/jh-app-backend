import userModel from "@models/users.model";
import { Request } from "express";
import { importData, getData } from "@utils/googleSheetAPI";
import { Music } from "@/dtos/music.dto";
import musicModel from "@/models/music.model";
import { getDate } from "@/utils/util";
import dayjs from "dayjs";
import { HttpException } from "@/exceptions/HttpException";
require('dayjs/locale/ko')

class MusicService {
  public users = userModel;
  public musics = musicModel;

  public async addMusic(req: Request): Promise<any> {
    const { deviceId, song } = req.body as Music;
    throw new HttpException(400, "오류로 인한 임시 비활성화 상태입니다")
    const musicDB = new this.musics({
      deviceId,
      song,
    });
    await importData([[dayjs().locale('ko').format("YYYY. M. D A HH:mm:ss"), song, "위 내용을 숙지 하였으며 준수하도록 하겠습니다", deviceId]]);
    await musicDB.save();
    const musicList = await getData();
    return musicList.data.values.length;
  }
}

export default MusicService;
