import { PrismaClient } from "@prisma/client";
import { FishLog } from "@prisma/client";

const prisma = new PrismaClient();

const updateFishlog = async (
    id: number,
    placeId: number,
    date: string,
    image: string,
    fishName: string,
    isSunny: boolean,
    isRainy: boolean,
    isCloudy: boolean,
    size: number,
    tide: string,
): Promise<FishLog> => {
    try {
        const result = await prisma.fishLog.update({
            where: { id: Number(id) },
            data: {
                placeId,
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
        console.log(result);
        await prisma.$disconnect();

        return result;
    } catch (err) {
        await prisma.$disconnect();
        throw new Error(`Failed update fishlog. detail: ${err}`);
    }
};

export default updateFishlog;