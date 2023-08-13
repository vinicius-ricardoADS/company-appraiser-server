/*
  Warnings:

  - You are about to drop the column `productId` on the `Evaluations` table. All the data in the column will be lost.
  - Added the required column `product_id` to the `Evaluations` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Evaluations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "score" INTEGER NOT NULL,
    "preferences" TEXT NOT NULL DEFAULT 'None',
    "would_buy" REAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    CONSTRAINT "Evaluations_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Evaluations" ("id", "preferences", "score", "would_buy") SELECT "id", "preferences", "score", "would_buy" FROM "Evaluations";
DROP TABLE "Evaluations";
ALTER TABLE "new_Evaluations" RENAME TO "Evaluations";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
