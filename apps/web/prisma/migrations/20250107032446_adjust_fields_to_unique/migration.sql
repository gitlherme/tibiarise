/*
  Warnings:

  - A unique constraint covering the columns `[characterId]` on the table `DailyExperience` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "DailyExperience_date_key";

-- CreateIndex
CREATE UNIQUE INDEX "DailyExperience_characterId_key" ON "DailyExperience"("characterId");
