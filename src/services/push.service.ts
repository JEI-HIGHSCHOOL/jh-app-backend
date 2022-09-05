import { NoticeAddDto, NoticeDto, PushDto } from "@/dtos/push.dto";
import { HttpException } from "@/exceptions/HttpException";
import { RequestWithUser } from "@/interfaces/auth.interface";
import deviceModel from "@/models/devices.model";
import noticeModel from "@/models/notice.model";
import userModel from "@/models/users.model";
import { noticeCache } from "@/utils/cache";
import { pushAlarm } from "@/utils/pushAlarm";
import { Request } from "express";
import { isValidObjectId } from "mongoose";

class DeviceService {
  public device = deviceModel;

  public async checkDevice(req: Request): Promise<any> {
    const { deviceId, token } = req.body as PushDto;
    const device = await this.device.findOne({ deviceId });
    if (!device) {
      const deviceDB = new this.device({
        deviceId,
        pushToken: token,
        pushPermission: true,
      });
      await deviceDB.save();
    } else {
      await device.updateOne({ pushToken: token });
    }
    return null;
  }

  public async addNotice(req: Request): Promise<any> {
    const { title, description, url, target } = req.body as NoticeDto;
    await pushAlarm(title, description, {"url": url}, target);
    return null;
  }

  public async publishNotice(req: RequestWithUser): Promise<any> {
    const { title, description, usePush } = req.body as NoticeAddDto;
    const noticeDB = new noticeModel({
      title,
      content: description,
      publisher: req.user._id,
    });
    const notice = await noticeDB.save();
    if(usePush) await pushAlarm("새로운 알림 등록", title, {"url": `notice/${notice._id}`});
    noticeCache.flushAll();
    return null;
  }

  public async getNotice(): Promise<any> {
    const noticeCaches = noticeCache.has("notice");
    if (!noticeCaches) {
      const noticesDB = await noticeModel
        .find({}, null, { sort: { published_date: -1 } })
        .limit(20);
      const notices = [];
      for await (const notice of noticesDB) {
        const publisher = await userModel.findOne(
          { _id: notice.publisher },
          { name: 1, id: 1 }
        );
        notices.push({
          ...notice.toJSON(),
          publisher: publisher
            ? publisher
            : {
                id: notice.publisher,
                name: "알 수 없음",
              },
        });
      }
      noticeCache.set("notice", notices);
      return notices;
    } else {
      return noticeCache.get("notice");
    }
  }

  public async getNoticeById(req: Request): Promise<any> {
    const { noticeId } = req.params;
    if(!isValidObjectId(noticeId)) throw new HttpException(404, "찾을 수 없는 알림 입니다");
    const noticeCaches = noticeCache.has("notice" + req.params.noticeId);
    if (!noticeCaches) {
      const noticesDB = await noticeModel.findOne({ _id: noticeId });
      if(!noticesDB) throw new HttpException(404, "찾을 수 없는 알림 입니다");
      const publisher = await userModel.findOne(
        { _id: noticesDB.publisher },
        { name: 1, id: 1 }
      );
      const notice = {
        ...noticesDB.toJSON(),
        publisher: publisher
          ? publisher
          : {
              id: noticesDB.publisher,
              name: "알 수 없음",
            },
      };
      noticeCache.set("notice" + req.params.noticeId, notice);
      return notice;
    } else {
      return noticeCache.get("notice" + req.params.noticeId);
    }
  }

  public async editNoticeById(req: Request): Promise<any> {
    const { noticeId } = req.params;
    const { title, description } = req.body as NoticeAddDto
    if(!isValidObjectId(noticeId)) throw new HttpException(404, "찾을 수 없는 알림 입니다");
    const noticesDB = await noticeModel.findOne({ _id: noticeId });
    if (!noticesDB) throw new HttpException(404, "찾을 수 없는 알림 입니다");
    await noticesDB.updateOne({$set: {title, content: description}})
    noticeCache.del("notice" + noticeId)
    return true
  }

  public async deleteNoticeById(req: Request): Promise<any> {
    const { noticeId } = req.params;
    if(!isValidObjectId(noticeId)) throw new HttpException(404, "찾을 수 없는 알림 입니다");
    const noticesDB = await noticeModel.findOne({ _id: noticeId });
    if (!noticesDB) throw new HttpException(404, "찾을 수 없는 알림 입니다");
    await noticesDB.deleteOne()
    noticeCache.flushAll();
    return true
  }
}

export default DeviceService;
