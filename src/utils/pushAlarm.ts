import axios from "axios";
import deviceModel from "@/models/devices.model";
import { HttpException } from "@/exceptions/HttpException";
export const pushAlarm = async (
  title: string,
  content: string,
  data?: {}
): Promise<boolean> => {
  try {
    const devices = await deviceModel.find({ pushPermission: true });
    let pushList = [];
    const totalLength = devices.length;
    const tokenListLengthForPush100Limit = Number(totalLength / 100);
    const expectedOutput = totalLength % 100;
    for (let i = 0; i < tokenListLengthForPush100Limit; i++) {
      const limit = 100 * i;
      await new Promise<void>((resolve, reject) => {
        for (let j = 0 + limit; j < 100 + limit; j++) {
          if (!devices[j]) resolve();
          pushList.push(devices[j].pushToken);
        }
      });
      const message = {
        to: pushList,
        sound: "default",
        title: title,
        body: content,
        data,
      };
      await axios("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        data: JSON.stringify(message),
      });
      pushList = [];
    }

    // 100 나누기 나머지 보내기
    await new Promise<void>((resolve, reject) => {
      for (
        let i = tokenListLengthForPush100Limit * 100;
        i < tokenListLengthForPush100Limit * 100 + expectedOutput;
        i++
      ) {
        if (!devices[i]) resolve();
        pushList.push(devices[i].pushToken);
      }
    });
    if(pushList.length === 0) return true
    const message = {
      to: pushList,
      sound: "default",
      title: title,
      body: content,
      data,
    };
    await axios("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      data: JSON.stringify(message),
    });

    return true;
  } catch (err) {
    console.log(err);
    throw new HttpException(500, "푸시 알림 전송에 실패했습니다");
  }
};
