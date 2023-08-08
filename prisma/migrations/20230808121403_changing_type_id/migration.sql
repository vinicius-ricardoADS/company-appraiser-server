/*
  Warnings:

  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Company` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Evaluations` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "evaluation" BOOLEAN NOT NULL,
    "description" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "imageUrl" TEXT,
    "company_id" TEXT NOT NULL,
    CONSTRAINT "Product_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("company_id", "createdAt", "description", "evaluation", "id", "imageUrl", "model", "updatedAt") SELECT "company_id", "createdAt", "description", "evaluation", "id", "imageUrl", "model", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE TABLE "new_Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "segment" TEXT NOT NULL
);
INSERT INTO "new_Company" ("id", "name", "segment") SELECT "id", "name", "segment" FROM "Company";
DROP TABLE "Company";
ALTER TABLE "new_Company" RENAME TO "Company";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "birth_date" DATETIME NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_User" ("birth_date", "cpf", "email", "id", "name", "password") SELECT "birth_date", "cpf", "email", "id", "name", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_password_key" ON "User"("password");
CREATE TABLE "new_Evaluations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "score" INTEGER NOT NULL,
    "preferences" TEXT NOT NULL DEFAULT 'None',
    "would_buy" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    CONSTRAINT "Evaluations_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Evaluations" ("id", "preferences", "productId", "score", "would_buy") SELECT "id", "preferences", "productId", "score", "would_buy" FROM "Evaluations";
DROP TABLE "Evaluations";
ALTER TABLE "new_Evaluations" RENAME TO "Evaluations";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
