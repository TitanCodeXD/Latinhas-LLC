-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Periodo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "totalPlan" INTEGER NOT NULL,
    "totalProd" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PLANEJAMENTO',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Periodo" ("createdAt", "endDate", "id", "startDate", "status", "totalPlan", "totalProd") SELECT "createdAt", "endDate", "id", "startDate", "status", "totalPlan", "totalProd" FROM "Periodo";
DROP TABLE "Periodo";
ALTER TABLE "new_Periodo" RENAME TO "Periodo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
