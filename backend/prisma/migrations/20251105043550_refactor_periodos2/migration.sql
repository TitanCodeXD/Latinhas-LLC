/*
  Warnings:

  - You are about to drop the column `descricao` on the `Demand` table. All the data in the column will be lost.
  - You are about to drop the column `dataFim` on the `Periodo` table. All the data in the column will be lost.
  - You are about to drop the column `dataInicio` on the `Periodo` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `Periodo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Periodo` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Demand" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sku" TEXT NOT NULL,
    "description" TEXT,
    "totalPlanned" INTEGER NOT NULL,
    "totalProd" INTEGER NOT NULL DEFAULT 0,
    "periodoId" INTEGER NOT NULL,
    CONSTRAINT "Demand_periodoId_fkey" FOREIGN KEY ("periodoId") REFERENCES "Periodo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Demand" ("id", "periodoId", "sku", "totalPlanned", "totalProd") SELECT "id", "periodoId", "sku", "totalPlanned", "totalProd" FROM "Demand";
DROP TABLE "Demand";
ALTER TABLE "new_Demand" RENAME TO "Demand";
CREATE TABLE "new_Periodo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "totalPlanned" INTEGER NOT NULL,
    "totalProd" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Periodo" ("createdAt", "id", "status", "totalPlanned", "totalProd") SELECT "createdAt", "id", "status", "totalPlanned", "totalProd" FROM "Periodo";
DROP TABLE "Periodo";
ALTER TABLE "new_Periodo" RENAME TO "Periodo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
