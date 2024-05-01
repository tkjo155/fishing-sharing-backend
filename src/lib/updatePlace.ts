import { PrismaClient } from "@prisma/client";
import { Place } from "@prisma/client";
const MAX_NAME_LENGTH = 50;


const prisma = new PrismaClient();
// name の文字列の指定文字数について検証(検証対象を引数に)
const validateParameterLength = (name: string) => {
  if (!name.length) {
    throw new Error(`Invalid Parameter: Name is required`);
  }
  if (name.length >= MAX_NAME_LENGTH) {
    throw new Error(
      `Invalid Parameter:To${MAX_NAME_LENGTH}characters can be entered`
    );
  }
};

const updatePlace = async (
  id: number,
  name: string,
  prefectureId: number
): Promise<Place> => {
  try {
    validateParameterLength(name);
    const result = await prisma.place.update({
      where: { id: Number(id) },
      data: {
        name: name,
        prefectureId: prefectureId,
      },
    });
    await prisma.$disconnect();

    return result;
  } catch (err) {
    await prisma.$disconnect();
    throw new Error(`Failed update place. detail: ${err}`);
  }
};

export default updatePlace;