-- DropIndex
DROP INDEX `Course_title_idx` ON `course`;

-- CreateIndex
CREATE FULLTEXT INDEX `Course_title_description_idx` ON `Course`(`title`, `description`);
