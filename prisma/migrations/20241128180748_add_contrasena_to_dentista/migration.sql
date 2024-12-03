/*
  Warnings:

  - Added the required column `contrasena` to the `dentista` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dentista` ADD COLUMN `contrasena` VARCHAR(191) NOT NULL;
