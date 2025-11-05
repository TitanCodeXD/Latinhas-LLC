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
    CONSTRAINT "Demand_periodoId_fkey" FOREIGN KEY ("periodoId") REFERENCES "Periodo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Demand" ("description", "id", "periodoId", "sku", "totalPlan", "totalProd") SELECT "description", "id", "periodoId", "sku", "totalPlan", "totalProd" FROM "Demand";
DROP TABLE "Demand";
ALTER TABLE "new_Demand" RENAME TO "Demand";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
