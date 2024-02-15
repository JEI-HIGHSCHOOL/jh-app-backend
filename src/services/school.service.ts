import userModel from "@models/users.model";
import { Request } from "express";
import { importData, getData } from "@utils/googleSheetAPI";
import musicModel from "@/models/music.model";
import dayjs from "dayjs";
import { neisClient } from "@/utils/neisAPI";
import { logger } from "@/utils/logger";
import { HttpException } from "@/exceptions/HttpException";

class SchoolService {
  public users = userModel;
  public musics = musicModel;
  public async getMeal(date: string): Promise<any> {
    const formatDate = dayjs(date).format("YYYYMMDD");
    try {
      const { data } = await neisClient.get("/hub/mealServiceDietInfo", {
        params: {
          SD_SCHUL_CODE: "7310561",
          ATPT_OFCDC_SC_CODE: "E10",
          MLSV_YMD: formatDate,
        },
      });
      if (!data.mealServiceDietInfo) {
        throw new HttpException(
          404,
          `${dayjs(date).format("YYYY-MM-DD")} 급식 정보가 없습니다.`
        );
      }
      return data.mealServiceDietInfo[1].row[0].DDISH_NM.split("<br/>");
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        if (error.response?.status === 404) {
          throw new HttpException(
            404,
            `${dayjs(date).format("YYYY-MM-DD")} 급식 정보가 없습니다.`
          );
        } else {
          logger.error(error);
          throw new HttpException(500, "서버 에러");
        }
      }
    }
  }
}

export default SchoolService;
