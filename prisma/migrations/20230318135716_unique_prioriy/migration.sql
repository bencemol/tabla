/*
  Warnings:

  - A unique constraint covering the columns `[boardId,state,priority]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
CREATE SEQUENCE task_priority_seq;
ALTER TABLE "Task" ALTER COLUMN "priority" SET DEFAULT nextval('task_priority_seq');
ALTER SEQUENCE task_priority_seq OWNED BY "Task"."priority";

-- CreateIndex
CREATE UNIQUE INDEX "Task_boardId_state_priority_key" ON "Task"("boardId", "state", "priority");
