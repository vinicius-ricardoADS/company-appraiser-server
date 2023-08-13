/*
  Warnings:

  - You are about to alter the column `would_buy` on the `Evaluations` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Evaluations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "score" INTEGER NOT NULL,
    "preferences" TEXT NOT NULL DEFAULT 'None',
    "would_buy" REAL NOT NULL,
    "productId" INTEGER NOT NULL,
    CONSTRAINT "Evaluations_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Evaluations" ("id", "preferences", "productId", "score", "would_buy") SELECT "id", "preferences", "productId", "score", "would_buy" FROM "Evaluations";
DROP TABLE "Evaluations";
ALTER TABLE "new_Evaluations" RENAME TO "Evaluations";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
