import { PrismaClient, Place } from "@prisma/client";

//PrismaClientのインスタンスを作成(クライアントを通じて、PrismaがDBに対して行う操作（クエリやミューテーションなど）を実行できる)
//prismaを使用できるようにする
const prisma = new PrismaClient();

const deletePlace = async (id: number): Promise<Place> => {
    try {
      const result = await prisma.place.delete({
        where: { id: Number(id) },
      });
      await prisma.$disconnect();
  
      return result;
    } catch (err) {
      await prisma.$disconnect();
      throw new Error(`Failed update tasks. detail: ${err}`);
    }
  };


export default deletePlace;
