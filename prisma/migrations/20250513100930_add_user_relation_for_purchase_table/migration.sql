-- DropIndex
DROP INDEX `Purchase_courseId_idx` ON `purchase`;

-- CreateIndex
CREATE INDEX `Purchase_courseId_userId_idx` ON `Purchase`(`courseId`, `userId`);
