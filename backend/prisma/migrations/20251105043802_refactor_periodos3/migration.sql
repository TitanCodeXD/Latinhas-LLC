/*
  Warnings:

  - You are about to drop the column `totalPlanned` on the `Demand` table. All the data in the column will be lost.
  - You are about to drop the column `totalPlanned` on the `Periodo` table. All the data in the column will be lost.
  - Added the required column `totalPlan` to the `Demand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPlan` to the `Periodo` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Demand" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sku" TEXT NOT NULL,
    "description" TEXT,
    "totalPlan" INTEGER NOT NULL,
    "totalProd" INTEGER NOT NULL DEFAULT 0,
    "periodoId" INTEGER NOT NULL,
    CONSTRAINT "Demand_periodoId_fkey" FOREIGN KEY ("periodoId") REFERENCES "Periodo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Demand" ("description", "id", "periodoId", "sku", "totalProd") SELECT "description", "id", "periodoId", "sku", "totalProd" FROM "Demand";
DROP TABLE "Demand";
ALTER TABLE "new_Demand" RENAME TO "Demand";
CREATE TABLE "new_Periodo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "totalPlan" INTEGER NOT NULL,
    "totalProd" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Periodo" ("createdAt", "endDate", "id", "startDate", "status", "totalProd") SELECT "createdAt", "endDate", "id", "startDate", "status", "totalProd" FROM "Periodo";
DROP TABLE "Periodo";
ALTER TABLE "new_Periodo" RENAME TO "Periodo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
