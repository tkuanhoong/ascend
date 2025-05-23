/*
  Warnings:

  - The values [UNPUBLISHED] on the enum `Course_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `course` MODIFY `status` ENUM('DRAFT', 'PENDING', 'PUBLISHED', 'REJECTED', 'REVOKED') NOT NULL DEFAULT 'DRAFT';
