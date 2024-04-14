import { PrismaClient, FishLog } from "@prisma/client";

//PrismaClientのインスタンスを作成(クライアントを通じて、PrismaがDBに対して行う操作（クエリやミューテーションなど）を実行できる)
//prismaを使用できるようにする
const prisma = new PrismaClient();

const deleteFishlog = async (id: number): Promise<FishLog> => {
    try {
      const result = await prisma.fishLog.delete({
        where: { id: Number(id) },
      });
      await prisma.$disconnect();
  
      return result;
    } catch (err) {
      await prisma.$disconnect();
      throw new Error(`Failed delete fishlog. detail: ${err}`);
    }
  };


export default deleteFishlog;
