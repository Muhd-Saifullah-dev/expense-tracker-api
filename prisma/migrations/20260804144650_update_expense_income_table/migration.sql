/*
  Warnings:

  - Added the required column `date` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Expense` ADD COLUMN `date` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Income` ADD COLUMN `note` VARCHAR(100) NULL;

-- CreateIndex
CREATE INDEX `Expense_userId_date_idx` ON `Expense`(`userId`, `date`);

-- CreateIndex
CREATE INDEX `Income_userId_date_idx` ON `Income`(`userId`, `date`);

-- RenameIndex
ALTER TABLE `Expense` RENAME INDEX `Expense_categoryId_fkey` TO `Expense_categoryId_idx`;
