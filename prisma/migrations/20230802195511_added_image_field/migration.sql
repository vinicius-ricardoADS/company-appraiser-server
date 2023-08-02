/*
  Warnings:

  - Added the required column `imageUrl` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "evaluation" BOOLEAN NOT NULL,
    "description" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "company_id" BIGINT NOT NULL,
    CONSTRAINT "Product_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("company_id", "description", "evaluation", "id", "model") SELECT "company_id", "description", "evaluation", "id", "model" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
