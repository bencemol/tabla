import Spinner from "../spinner/Spinner";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  isLoading?: boolean;
};

const variants = {
  primary:
    "bg-emerald-200 hover:bg-emerald-300 active:bg-emerald-400 dark:bg-emerald-900 dark:hover:bg-emerald-800 dark:active:bg-emerald-700",
  default:
    "bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-400 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:active:bg-neutral-600",
  delete:
    "bg-red-200 hover:bg-red-300 active:bg-red-400 dark:bg-red-900 dark:hover:bg-red-800 dark:active:bg-red-700",
  flat: "bg-transparent hover:bg-neutral-300 active:bg-neutral-400 dark:bg-transparent dark:hover:bg-neutral-700 dark:active:bg-neutral-600",
};

export default function Button({
  type = "button",
  children,
  className,
  isLoading,
  variant = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`relative rounded-md transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      <span
        className={`flex p-2 items-center gap-2 ${isLoading && `invisible`}`}
      >
        {children}
      </span>
      {isLoading && <Spinner />}
    </button>
  );
}
