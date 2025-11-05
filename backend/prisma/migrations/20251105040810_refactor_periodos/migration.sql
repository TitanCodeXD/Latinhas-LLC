/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Demand` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Demand` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Demand` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Demand` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Demand` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Demand` table. All the data in the column will be lost.
  - You are about to alter the column `totalPlanned` on the `Demand` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - Added the required column `periodoId` to the `Demand` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Periodo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dataInicio" DATETIME NOT NULL,
    "dataFim" DATETIME NOT NULL,
    "totalPlanned" INTEGER NOT NULL,
    "totalProd" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Demand" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sku" TEXT NOT NULL,
    "descricao" TEXT,
    "totalPlanned" INTEGER NOT NULL,
    "totalProd" INTEGER NOT NULL DEFAULT 0,
    "periodoId" INTEGER NOT NULL,
    CONSTRAINT "Demand_periodoId_fkey" FOREIGN KEY ("periodoId") REFERENCES "Periodo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Demand" ("id", "sku", "totalPlanned") SELECT "id", "sku", "totalPlanned" FROM "Demand";
DROP TABLE "Demand";
ALTER TABLE "new_Demand" RENAME TO "Demand";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
