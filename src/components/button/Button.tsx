import Spinner from "../spinner/Spinner";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  isLoading?: boolean;
};

const variants = {
  primary:
    "bg-black text-white disabled:bg-neutral-700 dark:bg-white dark:border-white dark:text-black dark:disabled:bg-neutral-400",
  default:
    "bg-white disabled:border-neutral-700 dark:bg-black dark:border-white dark:disabled:border-neutral-400",
  danger:
    "bg-white text-red-800 border-red-800 disabled:border-red-700 dark:bg-black dark:text-red-200 dark:border-red-200 dark:disabled:border-red-400",
  flat: "border-transparent bg-transparent hover:!-translate-y-0 active:!translate-y-0 hover:bg-neutral-300 active:bg-neutral-400 disabled:bg-transparent disabled:text-neutral-200 dark:bg-transparent dark:hover:bg-neutral-700 dark:active:bg-neutral-600 dark:disabled:bg-transparent",
  ghost:
    "bg-transparent border-dashed border-neutral-200 dark:border-neutral-800 hover:border-transparent text-neutral-200 hover:text-inherit focus-visible:focus-within:text-inherit dark:text-neutral-800 hover:!bg-neutral-100 dark:hover:!bg-neutral-800 hover:!-translate-y-0 active:!translate-y-0",
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
      className={`relative border-2 rounded-md transition-colors disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0.5 ${variants[variant]} ${className}`}
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
