/*
  Warnings:

  - A unique constraint covering the columns `[googleId]` on the table `paciente` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facebookId]` on the table `paciente` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `paciente` ADD COLUMN `facebookId` VARCHAR(191) NULL,
    ADD COLUMN `googleId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `paciente_googleId_key` ON `paciente`(`googleId`);

-- CreateIndex
CREATE UNIQUE INDEX `paciente_facebookId_key` ON `paciente`(`facebookId`);
