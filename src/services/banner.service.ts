import deviceModel from "@/models/devices.model";
import bannerModel from "@/models/banner.model";
import noticeModel from "@/models/notice.model";
import { RequestWithUser } from "@/interfaces/auth.interface";
import { CreateBannerDto } from "@/dtos/banner.dto";
import { HttpException } from "@/exceptions/HttpException";
import { bannerCache } from "@/utils/cache";
require('dayjs/locale/ko')

class BannerService {
  public devices = deviceModel;
  public banners = bannerModel
  public notices = noticeModel

  public async addBanner(req: RequestWithUser): Promise<any> {
    const { title, description, color, icon, url } = req.body as CreateBannerDto
    const bannerDB = new this.banners({
      title,
      description,
      color,
      icon,
      url,
      show: true
    })
    await bannerDB.save()
    bannerCache.flushAll()
    return true
  }

  public async enableBanner(req: RequestWithUser): Promise<any> {
    const bannerDB = await this.banners.findOne({_id: req.params.bannerId})
    if(!bannerDB) throw new HttpException(404, "찾을 수 없는 배너입니다");
    await this.banners.updateOne({_id: req.params.bannerId},{$set: {show: true}})
    bannerCache.flushAll()
    return true
  }

  public async disableBanner(req: RequestWithUser): Promise<any> {
    const bannerDB = await this.banners.findOne({_id: req.params.bannerId})
    if(!bannerDB) throw new HttpException(404, "찾을 수 없는 배너입니다");
    await this.banners.updateOne({_id: req.params.bannerId},{$set: {show: false}})
    bannerCache.flushAll()
    return true
  }
  public async getBanners(): Promise<any> {
    if(bannerCache.has("banner")) {
      return bannerCache.get("banner")
    } else {
      const banners = await this.banners.find({show: true})
      bannerCache.set("banner", banners)
      return banners
    }
  }

  public async getBannersAdmin(): Promise<any> {
    const banners = await this.banners.find()
    return banners
  }
}

export default BannerService;
