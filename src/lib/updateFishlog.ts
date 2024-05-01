import { PrismaClient } from "@prisma/client";
import { FishLog } from "@prisma/client";
const MAX_NAME_LENGTH = 50;
const MAX_SIZE = 1000;

const prisma = new PrismaClient();
// nameの文字数とsizeについて検証(検証対象を引数に)
const validateFishLogParameters = (fishName: string, size: number): void => {
    if (!fishName.length) {
      throw new Error(`Invalid Parameter: FishName is required`);
    }
  
    if (fishName.length > MAX_NAME_LENGTH) {
      throw new Error(
        `Invalid Parameter: FishName must be less than ${MAX_NAME_LENGTH} characters`
      );
    }
  
    if (size > MAX_SIZE) {
      throw new Error(`Invalid Parameter: Size must be  ${MAX_SIZE}`);
    }
  };

const updateFishlog = async (
    id: number,
    date: string,
    image: string,
    fishName: string,
    isSunny: boolean,
    isRainy: boolean,
    isCloudy: boolean,
    size: number,
    tide: string,
): Promise<FishLog> => {
    //文字列とサイズの数値が制約を満たしているかどうかを検証
    try {
        validateFishLogParameters(fishName, size);
        const result = await prisma.fishLog.update({
            where: { id: Number(id) },
            data: {
                date,
                image,
                fishName,
                isSunny,
                isRainy,
                isCloudy,
                size,
                tide
            },
        });
        await prisma.$disconnect();

        return result;
    } catch (err) {
        await prisma.$disconnect();
        throw new Error(`Failed update fishlog. detail: ${err}`);
    }
};

export default updateFishlog;