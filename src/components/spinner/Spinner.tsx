import { IconLoader2 } from "@tabler/icons-react";

export default function Spinner({
  className = "",
  size,
}: {
  className?: string;
  size?: string;
}) {
  return (
    <IconLoader2
      size={size}
      className={`absolute stroke-2 m-auto inset-0 animate-spin ${className}`}
    />
  );
}
