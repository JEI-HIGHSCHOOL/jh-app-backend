import userModel from "@models/users.model";
import { Request } from "express";
import { importData, getData } from "@utils/googleSheetAPI";
import { Music } from "@/dtos/music.dto";
import musicModel from "@/models/music.model";
import { getDate } from "@/utils/util";
import dayjs from "dayjs";
import deviceModel from "@/models/devices.model";
import bannerModel from "@/models/banner.model";
import noticeModel from "@/models/notice.model";
require('dayjs/locale/ko')

class WebService {
  public devices = deviceModel;
  public banners = bannerModel
  public notices = noticeModel

  public async getAnalytics(req: Request): Promise<any> {
    const deviceDB = await this.devices.count()
    const bannerDB = (await this.banners.find({show: true})).length
    const noticeDB = await this.notices.count()
    return {
      device: deviceDB,
      banner: bannerDB,
      notice: noticeDB
    }
  }
}

export default WebService;
