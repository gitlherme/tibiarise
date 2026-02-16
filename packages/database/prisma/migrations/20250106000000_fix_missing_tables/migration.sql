-- CreateTable
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "ProfitEntry" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "huntName" TEXT NOT NULL DEFAULT '',
    "huntDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profit" BIGINT NOT NULL,
    "preyCardsUsed" INTEGER NOT NULL,
    "boostsValue" INTEGER NOT NULL,
    "tibiaCoinValue" BIGINT NOT NULL,
    "netProfit" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "huntDuration" INTEGER,

    CONSTRAINT "ProfitEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "VerifyCharacter" (
    "id" TEXT NOT NULL,
    "characterName" TEXT NOT NULL,
    "verificationCode" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerifyCharacter_pkey" PRIMARY KEY ("id")
);

-- Add Columns to Character if Only needed
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Character' AND column_name='userId') THEN
        ALTER TABLE "Character" ADD COLUMN "userId" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Character' AND column_name='verified') THEN
        ALTER TABLE "Character" ADD COLUMN "verified" BOOLEAN DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Character' AND column_name='verifiedAt') THEN
        ALTER TABLE "Character" ADD COLUMN "verifiedAt" TIMESTAMP(3);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Character' AND column_name='vocation') THEN
        ALTER TABLE "Character" ADD COLUMN "vocation" TEXT;
    END IF;
END $$;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Character_userId_fkey') THEN
        ALTER TABLE "Character" ADD CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ProfitEntry_characterId_fkey') THEN
        ALTER TABLE "ProfitEntry" ADD CONSTRAINT "ProfitEntry_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;
