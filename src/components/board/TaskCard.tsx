import { Task } from "@prisma/client";

type TaskProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  task: Task;
};

export default function TaskCard({
  task,
  className = "",
  ...props
}: TaskProps) {
  const charWidth = 60;

  return (
    <article
      className={`p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 ${className}`}
      {...props}
    >
      <h3>{task.title}</h3>
      {task.description && (
        <p>
          {task.description.slice(0, charWidth) +
            ((task.description.length ?? 0) > charWidth ? "..." : "")}
        </p>
      )}
    </article>
  );
}
