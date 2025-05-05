-- AlterTable
ALTER TABLE `course` MODIFY `status` ENUM('DRAFT', 'PENDING', 'PUBLISHED', 'UNPUBLISHED', 'REJECTED', 'REVOKED') NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE `video` ADD COLUMN `isReady` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `StripeCustomer` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `stripeCustomerId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `StripeCustomer_userId_key`(`userId`),
    UNIQUE INDEX `StripeCustomer_stripeCustomerId_key`(`stripeCustomerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
