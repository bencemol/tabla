import Spinner from "../spinner/Spinner";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  isLoading?: boolean;
};

const variants = {
  primary:
    "bg-black text-white disabled:bg-zinc-700 dark:bg-white dark:border-white dark:text-black dark:disabled:bg-zinc-400 active:translate-y-0.5",
  default:
    "bg-white disabled:border-zinc-700 dark:bg-zinc-900 dark:border-white dark:disabled:border-zinc-400 active:translate-y-0.5",
  danger:
    "bg-white text-red-800 border-red-800 focus:shadow-red-800 disabled:border-red-700 dark:focus:shadow-red-300 dark:bg-zinc-900 dark:text-red-300 dark:border-red-300 dark:disabled:border-red-400 active:translate-y-0.5",
  flat: "border-transparent bg-transparent hover:bg-zinc-300 focus:bg-zinc-300 active:bg-zinc-400 disabled:bg-transparent disabled:text-zinc-200 dark:bg-transparent dark:hover:bg-zinc-700 dark:focus:bg-zinc-700 dark:active:bg-zinc-600 dark:disabled:bg-transparent",
  ghost:
    "bg-transparent border-dashed border-zinc-200 dark:border-zinc-800 focus-visible:focus:border-transparent hover:border-transparent text-zinc-200 hover:text-inherit focus-visible:focus:text-inherit dark:text-zinc-800 hover:bg-zinc-100 focus-visible:focus:bg-zinc-100 dark:focus-visible:focus:bg-zinc-800 dark:hover:bg-zinc-800",
};

export default function Button({
  type = "button",
  children,
  className = "",
  isLoading,
  variant = "default",
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`relative border-2 rounded-md transition-colors disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      style={{
        transitionProperty:
          "transform, color, background-color, border-color, text-decoration-color, fill, stroke",
        ...style,
      }}
      {...props}
    >
      <span
        className={`flex p-2 items-center gap-2 ${isLoading && `invisible`}`}
        style={{ justifyContent: "inherit" }}
      >
        {children}
      </span>
      {isLoading && <Spinner />}
    </button>
  );
}
