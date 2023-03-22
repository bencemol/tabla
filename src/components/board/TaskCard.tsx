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
  const charLength = 60;
  const taskUrl = `/boards/${task.boardId}/tasks/${task.id}`;

  const editTask = () => router.push(taskUrl);
  const prefetchTask = () => router.prefetch(taskUrl);

  return (
    <button
      className={`p-2 rounded-md bg-neutral-100 hover:bg-emerald-100 dark:bg-neutral-800 text-left shadow ${className}`}
      onClick={editTask}
      onMouseOver={prefetchTask}
      style={{
        transitionProperty:
          "transform, color, background-color, border-color, text-decoration-color, fill, stroke",
      }}
      {...props}
    >
      <article>
        <h3>{task.title}</h3>
        {task.description && (
          <p>
            {task.description.slice(0, charLength) +
              ((task.description.length ?? 0) > charLength ? "..." : "")}
          </p>
        )}
      </article>
    </button>
  );
}
