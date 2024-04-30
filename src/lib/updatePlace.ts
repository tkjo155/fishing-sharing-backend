import { PrismaClient } from "@prisma/client";
import { Place } from "@prisma/client";

const prisma = new PrismaClient();

const updatePlace = async (
  id: number,
  name: string,
  prefectureId: number
): Promise<Place> => {
  try {
    const result = await prisma.place.update({
      where: { id: Number(id) },
      data: {
        name: name,
        prefectureId: prefectureId,
      },
    });
    console.log(result);
    await prisma.$disconnect();

    return result;
  } catch (err) {
    await prisma.$disconnect();
    throw new Error(`Failed update place. detail: ${err}`);
  }
};

export default updatePlace;