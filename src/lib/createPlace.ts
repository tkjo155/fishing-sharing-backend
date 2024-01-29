import { PrismaClient, Place } from "@prisma/client";
const MAX_NAME_LENGTH = 50;

//PrismaClientのインスタンスを作成(クライアントを通じて、PrismaがDBに対して行う操作（クエリやミューテーションなど）を実行できる)
//prismaを使用できるようにする
const prisma = new PrismaClient();
// name の文字列の指定文字数について検証(検証対象を引数に)
const validateParameterLength = (name: string) => {
  if (!name.length) {
    throw new Error(`Invalid Parameter: Name is required`);
  }
  if (name.length >= MAX_NAME_LENGTH) {
    throw new Error(
      `Invalid Parameter:To ${MAX_NAME_LENGTH}characters can be entered`
    );
  }
};
//非同期関数 createPlace を新しくDBに作成
const createPlace = async (
  name: string,
  prefectureId: number
): Promise<Place> => {
  //文字列の長さが制約を満たしているかどうかを検証する関数を呼び出す
  try {
    validateParameterLength(name);
    // Prismaを使用して新しいplaceをデータベースに作成
    const placeData = await prisma.place.create({
      data: {
        name: name,
        prefectureId: prefectureId,
      },
    });
    //データベースとの対話が完了したらprisma接続を閉じる
    await prisma.$disconnect();
    //作成されたplaceを返す
    return placeData;
    //検証エラーまたはデータベースエラーが発生した場合、エラーメッセージをコンソールに出力し、その後エラーを再度スローして呼び出し元に伝える
  } catch (err) {
    //データベースとの対話が完了したらprisma接続を閉じる
    await prisma.$disconnect();
    // エラーを再スローして呼び出し元に伝える
    throw new Error(`Failed create places. detail: ${err}`);
  }
};

export default createPlace;
