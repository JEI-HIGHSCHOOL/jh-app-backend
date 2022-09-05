import { IsHexColor, IsIn, IsString } from "class-validator";

export class CreateBannerDto {
  @IsString({ message: "제목을 입력해주세요" })
  public title: string;

  @IsString({ message: "설명을 입력해주세요" })
  public description: string;
  @IsHexColor({ message: "배경색을 선택해주세요" })
  public color: string;
  @IsString({ message: "아이곤을 입력해주세요" })
  public icon: string;
  @IsString({message: "링크를 입력해주세요"})
  public url: string
}
