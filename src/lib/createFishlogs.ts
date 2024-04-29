import { PrismaClient, FishLog } from "@prisma/client";
const MAX_NAME_LENGTH = 50;
const MAX_SIZE = 1000;

//PrismaClientのインスタンスを作成(クライアントを通じて、PrismaがDBに対して行う操作（クエリやミューテーションなど）を実行できる)
//prismaを使用できるようにする
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
//非同期関数 createFishLog を新しくDBに作成
const createFishLog = async (
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
  //文字列とサイズの数値が制約を満たしているかどうかを検証する関数を呼び出す
  try {
    validateFishLogParameters(fishName, size);
    // Prismaを使用して新しいfishLogをデータベースに作成
    const fishLogData = await prisma.fishLog.create({
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
    //データベースとの対話が完了したらprisma接続を閉じる
    await prisma.$disconnect();
    //作成されたfishLogDataを返す
    return fishLogData;
    //検証エラーまたはデータベースエラーが発生した場合、エラーメッセージをコンソールに出力し、その後エラーを再度スローして呼び出し元に伝える
  } catch (err) {
    //データベースとの対話が完了したらprisma接続を閉じる
    await prisma.$disconnect();
    // エラーを再スローして呼び出し元に伝える
    throw new Error(`Failed to create fishlog. detail: ${err}`);
  }
};

export default createFishLog;
