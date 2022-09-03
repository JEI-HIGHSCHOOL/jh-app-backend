import deviceModel from "@/models/devices.model";
import { HttpException } from "@/exceptions/HttpException";
import { Expo } from "expo-server-sdk";

const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

export const pushAlarm = async (
  title: string,
  content: string,
  data?: {},
  target?: string[]
): Promise<boolean> => {
  try {
    let devices = await deviceModel.find({ pushPermission: true });
    if (target) {
      devices = await deviceModel.find({ pushPermission: true, deviceId: {"$in": target} });
    }
    const messages = [];
    for await (const device of devices) {
      messages.push({
        to: device.pushToken,
        sound: "default",
        title: title,
        body: content,
        data,
      });
    }
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];
    for await (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        throw new HttpException(500, "푸시 알림 전송에 실패했습니다");
      }
    }

    return true;
  } catch (err) {
    console.log(err);
    throw new HttpException(500, "푸시 알림 전송에 실패했습니다");
  }
};
