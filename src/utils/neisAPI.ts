import { NEIS_API_KEY } from "@/config";
import axios from "axios";

export const neisClient = axios.create({
  baseURL: "https://open.neis.go.kr/",
  params: {
    KEY: NEIS_API_KEY,
    Type: "json",
  },
});
