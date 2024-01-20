import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function prefecturesDatabase() {
  await prisma.prefectures.createMany({
    data: [
      { placeId: 1, name: "北海道" },
      { placeId: 2, name: "青森県" },
      { placeId: 3, name: "岩手県" },
      { placeId: 4, name: "宮城県" },
      { placeId: 5, name: "秋田県" },
      { placeId: 6, name: "山形県" },
      { placeId: 7, name: "福島県" },
      { placeId: 8, name: "茨城県" },
      { placeId: 9, name: "栃木県" },
      { placeId: 10, name: "群馬県" },
      { placeId: 11, name: "埼玉県" },
      { placeId: 12, name: "千葉県" },
      { placeId: 13, name: "東京都" },
      { placeId: 14, name: "神奈川県" },
      { placeId: 15, name: "新潟県" },
      { placeId: 16, name: "富山県" },
      { placeId: 17, name: "石川県" },
      { placeId: 18, name: "福井県" },
      { placeId: 19, name: "山梨県" },
      { placeId: 20, name: "長野県" },
      { placeId: 21, name: "岐阜県" },
      { placeId: 22, name: "静岡県" },
      { placeId: 23, name: "愛知県" },
      { placeId: 24, name: "三重県" },
      { placeId: 25, name: "滋賀県" },
      { placeId: 26, name: "京都府" },
      { placeId: 27, name: "大阪府" },
      { placeId: 28, name: "兵庫県" },
      { placeId: 29, name: "奈良県" },
      { placeId: 30, name: "和歌山県" },
      { placeId: 31, name: "鳥取県" },
      { placeId: 32, name: "島根県" },
      { placeId: 33, name: "岡山県" },
      { placeId: 34, name: "広島県" },
      { placeId: 35, name: "山口県" },
      { placeId: 36, name: "徳島県" },
      { placeId: 37, name: "香川県" },
      { placeId: 38, name: "愛媛県" },
      { placeId: 39, name: "高知県" },
      { placeId: 40, name: "福岡県" },
      { placeId: 41, name: "佐賀県" },
      { placeId: 42, name: "長崎県" },
      { placeId: 43, name: "熊本県" },
      { placeId: 44, name: "大分県" },
      { placeId: 45, name: "宮崎県" },
      { placeId: 46, name: "鹿児島県" },
      { placeId: 47, name: "沖縄県" },
    ],
  });
}

// 処理開始
prefecturesDatabase()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
