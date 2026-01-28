-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "world" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "experience" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyExperience" (
    "id" TEXT NOT NULL,
    "value" BIGINT NOT NULL,
    "level" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyExperience_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DailyExperience" ADD CONSTRAINT "DailyExperience_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
