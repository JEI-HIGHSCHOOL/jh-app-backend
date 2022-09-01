import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { SECRET_KEY } from "@config";
import { CreateUserDto } from "@dtos/users.dto";
import { HttpException } from "@exceptions/HttpException";
import userModel from "@models/users.model";
import { Request } from "express";
import { importData, getData } from "@utils/googleSheetAPI";
import { Music } from "@/dtos/music.dto";
import musicModel from "@/models/music.model";
import { getDate } from "@/utils/util";

class MusicService {
  public users = userModel;
  public musics = musicModel;

  public async addMusic(req: Request): Promise<any> {
    const { deviceId, song } = req.body as Music;
    const music = await this.musics
      .find({
        deviceId,
      })
      .sort({ published_date: -1 })
      .limit(1);
    if (
      music.length === 0 ||
      getDate(new Date(music[0].published_date)) !== getDate(new Date())
    ) {
      const musicDB = new this.musics({
        deviceId,
        song,
      });
      await importData([[deviceId, song]]);
      await musicDB.save();
      const musicList = await getData();
      return musicList.data.values.length;
    } else {
      throw new HttpException(400, "오늘은 이미 노래를 신청하셨습니다");
    }
  }
}

export default MusicService;
