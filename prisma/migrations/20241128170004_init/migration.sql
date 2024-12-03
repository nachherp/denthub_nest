-- CreateTable
CREATE TABLE `dentista` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `apellidoPaterno` VARCHAR(191) NOT NULL,
    `apellidoMaterno` VARCHAR(191) NOT NULL,
    `fechaNacimiento` DATETIME(3) NOT NULL,
    `correoElectronico` VARCHAR(191) NOT NULL,
    `numeroTelefono` VARCHAR(191) NOT NULL,
    `estadoCivil` VARCHAR(191) NOT NULL,
    `sexo` VARCHAR(191) NOT NULL,
    `lugarNacimiento` VARCHAR(191) NOT NULL,
    `nacionalidad` VARCHAR(191) NOT NULL,
    `cargo` VARCHAR(191) NOT NULL,
    `rfc` VARCHAR(191) NOT NULL,
    `numeroSeguroSocial` VARCHAR(191) NULL,
    `turnoLaboral` VARCHAR(191) NOT NULL,
    `tieneAlergia` BOOLEAN NOT NULL DEFAULT false,
    `tieneHijos` BOOLEAN NOT NULL DEFAULT false,
    `tieneDiscapacidad` BOOLEAN NOT NULL DEFAULT false,
    `esZurdo` BOOLEAN NOT NULL DEFAULT false,
    `fotoPerfil` VARCHAR(191) NULL,
    `universidad` VARCHAR(191) NOT NULL,
    `tituloObtenido` VARCHAR(191) NOT NULL,
    `anoGraduacion` INTEGER NOT NULL,
    `especialidad` VARCHAR(191) NOT NULL,
    `paisEstudio` VARCHAR(191) NOT NULL,
    `numeroCedula` VARCHAR(191) NOT NULL,
    `licenciaPractica` VARCHAR(191) NOT NULL,
    `anosExperiencia` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `dentista_correoElectronico_key`(`correoElectronico`),
    UNIQUE INDEX `dentista_rfc_key`(`rfc`),
    UNIQUE INDEX `dentista_numeroCedula_key`(`numeroCedula`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Certificacion` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `dentistaId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Certificacion_dentistaId_idx`(`dentistaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClinicaPrevia` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `dentistaId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ClinicaPrevia_dentistaId_idx`(`dentistaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Procedimiento` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `dentistaId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Procedimiento_dentistaId_idx`(`dentistaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paciente` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `apellidoPaterno` VARCHAR(191) NOT NULL,
    `apellidoMaterno` VARCHAR(191) NOT NULL,
    `fechaNacimiento` DATETIME(3) NOT NULL,
    `correoElectronico` VARCHAR(191) NULL,
    `contrasena` VARCHAR(191) NOT NULL,
    `numeroTelefono` VARCHAR(191) NULL,
    `nacionalidad` VARCHAR(191) NOT NULL,
    `fechaRegistro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sexo` VARCHAR(191) NOT NULL,
    `tieneAlergia` BOOLEAN NOT NULL DEFAULT false,
    `fotoPerfil` VARCHAR(191) NULL,
    `motivoConsulta` VARCHAR(191) NULL,
    `ultimaVisita` DATETIME(3) NULL,
    `doloresDentales` VARCHAR(191) NULL,
    `condicionActual` VARCHAR(191) NULL,
    `labios` VARCHAR(191) NULL,
    `encias` VARCHAR(191) NULL,
    `pisoBoca` VARCHAR(191) NULL,
    `vestibulos` VARCHAR(191) NULL,
    `paladar` VARCHAR(191) NULL,
    `temporoMandibula` VARCHAR(191) NULL,
    `carrillos` VARCHAR(191) NULL,
    `lengua` VARCHAR(191) NULL,
    `cuello` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `paciente_correoElectronico_key`(`correoElectronico`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProcedimientoAnterior` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `pacienteId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ProcedimientoAnterior_pacienteId_idx`(`pacienteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `citas` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `fechaHora` DATETIME(3) NOT NULL,
    `servicioId` VARCHAR(191) NOT NULL,
    `comentarios` VARCHAR(191) NULL,
    `pacienteId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `citas_pacienteId_idx`(`pacienteId`),
    INDEX `citas_servicioId_idx`(`servicioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servicios` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `duracion` INTEGER NULL,
    `categoria` ENUM('GENERAL', 'RESTAURATIVO', 'ESTETICO', 'QUIRURGICO', 'ORTODONTICO', 'PROTESICO') NOT NULL DEFAULT 'GENERAL',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `servicios_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Certificacion` ADD CONSTRAINT `Certificacion_dentistaId_fkey` FOREIGN KEY (`dentistaId`) REFERENCES `dentista`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClinicaPrevia` ADD CONSTRAINT `ClinicaPrevia_dentistaId_fkey` FOREIGN KEY (`dentistaId`) REFERENCES `dentista`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Procedimiento` ADD CONSTRAINT `Procedimiento_dentistaId_fkey` FOREIGN KEY (`dentistaId`) REFERENCES `dentista`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProcedimientoAnterior` ADD CONSTRAINT `ProcedimientoAnterior_pacienteId_fkey` FOREIGN KEY (`pacienteId`) REFERENCES `paciente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `citas` ADD CONSTRAINT `citas_servicioId_fkey` FOREIGN KEY (`servicioId`) REFERENCES `servicios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `citas` ADD CONSTRAINT `citas_pacienteId_fkey` FOREIGN KEY (`pacienteId`) REFERENCES `paciente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
