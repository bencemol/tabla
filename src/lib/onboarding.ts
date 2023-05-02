import { db } from "@/lib/db";

export async function createSampleBoard(ownerId: string) {
  console.log(`creating sample board for ${ownerId}`);
  const { id: boardId } = await db.board.create({
    data: {
      name: "Roadmap to the 🌙",
      ownerId,
    },
  });
  await db.taskState.createMany({
    data: [
      { boardId, name: "todo" },
      { boardId, name: "in progress" },
      { boardId, name: "done" },
    ],
  });
  const states = await db.taskState.findMany({
    where: { boardId },
    orderBy: { order: "asc" },
  });
  await db.task.createMany({
    data: [
      {
        boardId,
        stateId: states[0].id,
        title: "drag me daddy",
        description: "move tasks between columns by dragging them",
      },
      {
        boardId,
        stateId: states[0].id,
        title: "priorities, priorities...",
        description: "columns can also be reordered by dragging the title",
      },
      {
        boardId,
        stateId: states[1].id,
        title: "focused af",
        description: "click on a task to edit or delete one",
      },
      {
        boardId,
        stateId: states[1].id,
        title: "does multitasking sooth your ADHD too?",
        description: "columns can be renamed with the little pencil icon above",
      },
      {
        boardId,
        stateId: states[2].id,
        title: "finally at ☮️",
        description:
          "rename or delete the board with the big pencil button in the header",
      },
    ],
  });
}
