import { HttpStatus } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsString, ValidateNested } from "class-validator";
import { DataToAnalyze } from "./data-to-analyze.dto";

export class CreatePredictionDto {

    @IsNotEmpty()
    @IsString()
    public materialID: number;

    @IsObject()
    @IsNotEmptyObject()
    @Transform(({ value }) => {
        try {
            if (typeof value === 'object') {
                return value;
            }
            return JSON.parse(value);
        } catch (error) {
            console.log({ error })
            throw new RpcException({ status: HttpStatus.BAD_REQUEST, message: 'Invalid JSON format for dataPayload' })
        }
    })
    @ValidateNested({ each: true })
    @Type(() => DataToAnalyze)
    public dataToAnalyze: DataToAnalyze;


    @IsNotEmpty()
    @IsNumber()
    public purchaseInEvent: number;

    @IsNotEmpty()
    @IsNumber()
    public usageInEvent: number;

}
