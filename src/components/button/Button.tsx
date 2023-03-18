type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  isLoading?: boolean;
};

const variants = {
  primary: "bg-emerald-200 hover:bg-emerald-300 active:bg-emerald-400",
  default: "bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-400",
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
      className={` p-2 rounded-md  transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="flex items-center gap-2">{children}</span>
    </button>
  );
}
