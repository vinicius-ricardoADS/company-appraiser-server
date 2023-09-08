/*
  Warnings:

  - Added the required column `count_evaluations` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` ADD COLUMN `count_evaluations` INTEGER NOT NULL;
