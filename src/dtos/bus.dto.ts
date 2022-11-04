import { IsObject, IsString } from "class-validator";

export class StartBusDto {
    @IsString({message: "버스 노선을 선택해주세요"})
    readonly bus: string;

    @IsObject({message: "버스 위치로드를 실패했습니다"})
    readonly location: {
        lat: number;
        lng: number;
    };
}

export class StopBusDto {
    @IsString({message: "버스 노선을 선택해주세요"})
    readonly bus: string;
}