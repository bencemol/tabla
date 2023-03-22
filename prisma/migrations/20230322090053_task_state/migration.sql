/*
  Warnings:

  - You are about to drop the column `state` on the `Task` table. All the data in the column will be lost.
  - Added the required column `stateId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "state",
ADD COLUMN     "stateId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "TaskState" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" SERIAL NOT NULL,
    "boardId" TEXT NOT NULL,

    CONSTRAINT "TaskState_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "TaskState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskState" ADD CONSTRAINT "TaskState_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;
