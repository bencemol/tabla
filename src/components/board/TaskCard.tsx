import { Task } from "@prisma/client";
import { useRouter } from "next/navigation";

type TaskProps = React.HtmlHTMLAttributes<HTMLButtonElement> & {
  task: Task;
};

export default function TaskCard({
  task,
  className = "",
  ...props
}: TaskProps) {
  const router = useRouter();
  const charWidth = 60;
  const taskUrl = `/boards/${task.boardId}/tasks/${task.id}`;

  const editTask = () => router.push(taskUrl);
  const prefetchTask = () => router.prefetch(taskUrl);

  return (
    <button
      className={`p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 text-left ${className}`}
      onClick={editTask}
      onMouseOver={prefetchTask}
      {...props}
    >
      <article>
        <h3>{task.title}</h3>
        {task.description && (
          <p>
            {task.description.slice(0, charWidth) +
              ((task.description.length ?? 0) > charWidth ? "..." : "")}
          </p>
        )}
      </article>
    </button>
  );
}
