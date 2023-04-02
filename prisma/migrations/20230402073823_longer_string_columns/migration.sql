-- AlterTable
ALTER TABLE `Board` MODIFY `name` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Task` MODIFY `title` TEXT NOT NULL,
    MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `TaskState` MODIFY `name` TEXT NOT NULL;
