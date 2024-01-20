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
    "placeId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Prefectures_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Prefectures" ADD CONSTRAINT "Prefectures_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
