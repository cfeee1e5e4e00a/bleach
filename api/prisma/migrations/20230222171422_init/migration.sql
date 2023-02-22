-- CreateEnum
CREATE TYPE "DemandStatus" AS ENUM ('ON_EXPORTING', 'ON_ANALYZING', 'ON_VERIFICATION', 'ON_MIGRATION_GENERATION', 'DONE');

-- CreateTable
CREATE TABLE "Demand" (
    "id" SERIAL NOT NULL,
    "status" "DemandStatus" NOT NULL,
    "suggests" JSONB,
    "migration_file" TEXT,

    CONSTRAINT "Demand_pkey" PRIMARY KEY ("id")
);
