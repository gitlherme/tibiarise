/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Character` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[date]` on the table `DailyExperience` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Character_name_key" ON "Character"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DailyExperience_date_key" ON "DailyExperience"("date");
