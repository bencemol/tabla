import { db } from "@/lib/db";

export async function createSampleBoard(ownerId: string) {
  console.log(`creating sample board for ${ownerId}`);
  debugger;
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
        title: "💩 that needs to be done",
        description: "move tasks between columns by dragging them",
      },
      {
        boardId,
        stateId: states[1].id,
        title: "💩 is in progress",
        description: "click on a task to edit or delete one",
      },
      {
        boardId,
        stateId: states[1].id,
        title: "some other 💩 that's in progress",
        description: "columns can be renamed with the little pencil icon above",
      },
      {
        boardId,
        stateId: states[2].id,
        title: "💩 is done",
        description:
          "rename or delete the board with the big pencil button in the header",
      },
    ],
  });
}
