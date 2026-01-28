-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "formerNames" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "formerWorlds" TEXT[] DEFAULT ARRAY[]::TEXT[];
