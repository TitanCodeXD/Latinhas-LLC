-- CreateTable
CREATE TABLE "Demand" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sku" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "totalPlanned" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PLANEJAMENTO',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Demand_sku_key" ON "Demand"("sku");
