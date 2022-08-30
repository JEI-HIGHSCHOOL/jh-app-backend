import { HttpException } from "@/exceptions/HttpException";
import { google } from "googleapis";
import { SHEET_ID, SHEET_NAME } from "@config";

const keys = require("../../google_api_key.json");
const client = new google.auth.JWT(keys.client_email, null, keys.private_key, [
  "https://www.googleapis.com/auth/spreadsheets",
]);

const importData = async (data: string[][]) => {
  client.authorize(async function (err, tokens) {
    if (err) {
      throw new HttpException(
        500,
        "내부 서버 오류입니다. 관리자에게 문의해주세요"
      );
    }
  });
  const sheets = google.sheets({ version: "v4", auth: client });
  const request = {
    spreadsheetId: SHEET_ID,
    range: SHEET_NAME,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    resource: { values: data },
  };

  const response = await sheets.spreadsheets.values.append(request);
  if (response.status !== 200) {
    throw new HttpException(
      500,
      "내부 서버 오류입니다. 관리자에게 문의해주세요"
    );
  }
};

const getData = async () => {
    client.authorize(async function (err, tokens) {
      if (err) {
        throw new HttpException(
          500,
          "내부 서버 오류입니다. 관리자에게 문의해주세요"
        );
      }
    });
    const sheets = google.sheets({ version: "v4", auth: client });
    const request = {
      spreadsheetId: SHEET_ID,
      range: SHEET_NAME,
    };
  
    const response = await sheets.spreadsheets.values.get(request);
    if (response.status !== 200) {
      throw new HttpException(
        500,
        "내부 서버 오류입니다. 관리자에게 문의해주세요"
      );
    }
    return response
  };
  

export { importData, getData };
