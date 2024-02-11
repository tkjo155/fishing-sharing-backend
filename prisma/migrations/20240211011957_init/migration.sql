-- CreateTable
CREATE TABLE "FishLog" (
    "id" SERIAL NOT NULL,
    "placeId" INTEGER NOT NULL,
    "data" TEXT NOT NULL,
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
ALTER TABLE "FishLog" ADD CONSTRAINT "FishLog_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
