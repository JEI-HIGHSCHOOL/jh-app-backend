import { IsString } from 'class-validator';

export class Music {
  @IsString({message: "디바이스 정보를 확인 할 수 없습니다"})
  public deviceId: string;

  @IsString({message: "노래 재목을 입력해주세요"})
  public song: string;
}
