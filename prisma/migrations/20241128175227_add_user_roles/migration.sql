-- AlterTable
ALTER TABLE `dentista` ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'dentist';

-- AlterTable
ALTER TABLE `paciente` ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'patient';
