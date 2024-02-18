-- CreateTable
CREATE TABLE "Place" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "prefectureId" INTEGER NOT NULL,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prefecture" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Prefecture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FishLog" (
    "id" SERIAL NOT NULL,
    "placeId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "fishName" TEXT NOT NULL,
    "weather" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "isSpringTide" BOOLEAN NOT NULL,
    "isMiddleTide" BOOLEAN NOT NULL,
    "isNeapTide" BOOLEAN NOT NULL,
    "isNagashio" BOOLEAN NOT NULL,
    "isWakashio" BOOLEAN NOT NULL,

    CONSTRAINT "FishLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_prefectureId_fkey" FOREIGN KEY ("prefectureId") REFERENCES "Prefecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FishLog" ADD CONSTRAINT "FishLog_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
