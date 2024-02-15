import { IsString } from "class-validator";

export class SearchMealDto {
  @IsString({ message: "검색 일자를 입력해주세요." })
  public date: string;
}
