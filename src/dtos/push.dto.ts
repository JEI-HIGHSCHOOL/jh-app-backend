import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class PushDto {
  @IsString()
  public deviceId: string;

  @IsString()
  public token: string;
}

export class NoticeDto {
  @IsString()
  public title: string;

  @IsString()
  public description: string;
  @IsString()
  @IsOptional()
  public url: string;

  @IsArray()
  public target: string[];
}

export class NoticeAddDto {
  @IsString({message: "제목을 입력해주세요"})
  public title: string;

  @IsString({message: "내용을 입력해주세요"})
  public description: string;
  
  @IsOptional()
  @IsBoolean()
  public usePush: boolean
}
