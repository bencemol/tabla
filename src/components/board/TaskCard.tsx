import { Task } from "@/models/task";
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
  const taskUrl = `/boards/${task.boardId}/tasks/${task.id}`;

  const editTask = () => router.push(taskUrl);
  const prefetchTask = () => router.prefetch(taskUrl);

  return (
    <button
      className={`px-3 py-2 rounded-md border-2 border-t-8 bg-white dark:bg-zinc-900 text-left shadow-md ${className}`}
      onClick={editTask}
      onMouseOver={prefetchTask}
      style={{
        transitionProperty:
          "transform, color, background-color, border-color, text-decoration-color, fill, stroke",
      }}
      {...props}
    >
      <article className="space-y-2">
        <h3>{task.title}</h3>
        {task.description && (
          <p className="line-clamp-3" style={{ wordBreak: "break-word" }}>
            {task.description}
          </p>
        )}
      </article>
    </button>
  );
}
