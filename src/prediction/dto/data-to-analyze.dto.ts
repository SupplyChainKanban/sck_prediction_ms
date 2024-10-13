import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class DataToAnalyze {
    @IsNotEmpty()
    @IsNumber()
    public totalQuantityUsed: number;

    @IsNotEmpty()
    @IsNumber()
    public totalQuantityPurchased: number;

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    public lastPurchasedDate?: Date;

    @IsNotEmpty()
    @IsNumber()
    public avgDailyUsed: number;

    @IsNotEmpty()
    @IsNumber()
    public usedTrend: string;

    @IsNotEmpty()
    @IsNumber()
    daysSinceLastPurchase: number;

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    public avgTimeBetweenPurchases: number;

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    public recommendation: string;
}