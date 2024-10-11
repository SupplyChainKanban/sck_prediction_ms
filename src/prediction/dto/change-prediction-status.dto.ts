import { PredictionStatus } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { predictionStatusList } from "../enums/data.enum";

export class ChangePredictionStatusDto {

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    public id: string;

    @IsEnum(PredictionStatus, {
        message: `Possible status are ${predictionStatusList}`
    })
    public status: PredictionStatus;
}