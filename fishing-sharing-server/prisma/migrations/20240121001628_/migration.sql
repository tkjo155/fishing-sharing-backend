-- CreateTable
CREATE TABLE "Places" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "placeId" INTEGER NOT NULL,

    CONSTRAINT "Places_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prefectures" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Prefectures_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Places" ADD CONSTRAINT "Places_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Prefectures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
