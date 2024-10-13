import { PredictionStatus } from "@prisma/client";

export const predictionStatusList = [
    PredictionStatus.PENDING,
    PredictionStatus.CREATION_DONE,
    PredictionStatus.UPDATED_DONE,
    PredictionStatus.PROCESS_DONE,
    PredictionStatus.ERROR,
]
