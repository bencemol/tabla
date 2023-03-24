import { PrismaClient } from "@prisma/client";

declare global {
  var db: PrismaClient;
}

export let db: PrismaClient;

if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
} else {
  if (!global.db) {
    global.db = new PrismaClient();
  }

  db = global.db;
}

async function generateTasks() {
  const board = await db.board.findFirst({
    where: { name: "stress test" },
    include: { states: { orderBy: { order: "asc" } } },
  });
  if (!board) {
    return;
  }
  const tasks: {
    boardId: string;
    title: string;
    description: string;
    stateId: string;
    priority: number;
  }[] = [];
  for (let i = 0; i < 4000; i++) {
    tasks.push({
      boardId: board.id,
      title: `task ${i}`,
      description: `description ${i}`,
      stateId: board.states[0].id,
      priority: i,
    });
  }
  await db.task.createMany({ data: tasks });
}
