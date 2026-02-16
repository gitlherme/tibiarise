-- CreateEnum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Currency') THEN
        CREATE TYPE "Currency" AS ENUM ('GOLD', 'TIBIA_COIN');
    END IF;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "Party" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "inviteCode" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "maxMembers" INTEGER NOT NULL DEFAULT 5,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Party_pkey" PRIMARY KEY ("id")
);

-- Add missing columns to Party if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Party' AND column_name='slug') THEN
        ALTER TABLE "Party" ADD COLUMN "slug" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Party' AND column_name='isPublic') THEN
        ALTER TABLE "Party" ADD COLUMN "isPublic" BOOLEAN NOT NULL DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Party' AND column_name='isActive') THEN
        ALTER TABLE "Party" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Party' AND column_name='maxMembers') THEN
        ALTER TABLE "Party" ADD COLUMN "maxMembers" INTEGER NOT NULL DEFAULT 5;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Party' AND column_name='description') THEN
        ALTER TABLE "Party" ADD COLUMN "description" TEXT;
    END IF;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "PartyMember" (
    "id" TEXT NOT NULL,
    "partyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "isLeader" BOOLEAN NOT NULL DEFAULT false,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartyMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "HuntSession" (
    "id" TEXT NOT NULL,
    "partyId" TEXT NOT NULL,
    "huntName" TEXT NOT NULL,
    "huntDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER,
    "loot" BIGINT NOT NULL DEFAULT 0,
    "supplies" BIGINT NOT NULL DEFAULT 0,
    "balance" BIGINT NOT NULL DEFAULT 0,
    "rawSessionData" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HuntSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "PartyDrop" (
    "id" TEXT NOT NULL,
    "partyId" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "itemId" INTEGER,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "value" BIGINT NOT NULL DEFAULT 0,
    "source" TEXT,
    "sold" BOOLEAN NOT NULL DEFAULT false,
    "droppedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currency" "Currency" NOT NULL DEFAULT 'GOLD',

    CONSTRAINT "PartyDrop_pkey" PRIMARY KEY ("id")
);

-- Add missing columns to PartyDrop if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='PartyDrop' AND column_name='droppedAt') THEN
        ALTER TABLE "PartyDrop" ADD COLUMN "droppedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='PartyDrop' AND column_name='currency') THEN
        ALTER TABLE "PartyDrop" ADD COLUMN "currency" "Currency" NOT NULL DEFAULT 'GOLD';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='PartyDrop' AND column_name='sold') THEN
        ALTER TABLE "PartyDrop" ADD COLUMN "sold" BOOLEAN NOT NULL DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='PartyDrop' AND column_name='source') THEN
        ALTER TABLE "PartyDrop" ADD COLUMN "source" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='PartyDrop' AND column_name='itemId') THEN
        ALTER TABLE "PartyDrop" ADD COLUMN "itemId" INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='PartyDrop' AND column_name='quantity') THEN
        ALTER TABLE "PartyDrop" ADD COLUMN "quantity" INTEGER NOT NULL DEFAULT 1;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='PartyDrop' AND column_name='value') THEN
        ALTER TABLE "PartyDrop" ADD COLUMN "value" BIGINT NOT NULL DEFAULT 0;
    END IF;
END $$;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Party_slug_key" ON "Party"("slug");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Party_inviteCode_key" ON "Party"("inviteCode");

-- AddForeignKeys with exception handling
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Party_createdBy_fkey') THEN
        BEGIN
            ALTER TABLE "Party" ADD CONSTRAINT "Party_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Skipping Party_createdBy_fkey: %', SQLERRM;
        END;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PartyMember_characterId_fkey') THEN
        BEGIN
            ALTER TABLE "PartyMember" ADD CONSTRAINT "PartyMember_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Skipping PartyMember_characterId_fkey: %', SQLERRM;
        END;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PartyMember_partyId_fkey') THEN
        BEGIN
            ALTER TABLE "PartyMember" ADD CONSTRAINT "PartyMember_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Skipping PartyMember_partyId_fkey: %', SQLERRM;
        END;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PartyMember_userId_fkey') THEN
        BEGIN
            ALTER TABLE "PartyMember" ADD CONSTRAINT "PartyMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Skipping PartyMember_userId_fkey: %', SQLERRM;
        END;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'HuntSession_partyId_fkey') THEN
        BEGIN
            ALTER TABLE "HuntSession" ADD CONSTRAINT "HuntSession_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Skipping HuntSession_partyId_fkey: %', SQLERRM;
        END;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PartyDrop_partyId_fkey') THEN
        BEGIN
            ALTER TABLE "PartyDrop" ADD CONSTRAINT "PartyDrop_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Skipping PartyDrop_partyId_fkey: %', SQLERRM;
        END;
    END IF;
END $$;
