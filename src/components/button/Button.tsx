type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

const variants = {
  primary: "bg-emerald-200 hover:bg-emerald-300 active:bg-emerald-400",
  default: "bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-400",
};

export default function Button({
  type = "button",
  children,
  className,
  variant = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`flex gap-2 p-2 rounded-md  transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
