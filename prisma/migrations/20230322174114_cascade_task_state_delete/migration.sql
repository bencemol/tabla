-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_stateId_fkey";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "TaskState"("id") ON DELETE CASCADE ON UPDATE CASCADE;
