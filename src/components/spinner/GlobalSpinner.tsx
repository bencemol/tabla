import Spinner from "./Spinner";

export default function GlobalSpinner({ className = "" }) {
  return (
    <Spinner
      size="48"
      className={`!fixed mr-3 mb-3 z-50 animate-in fade-in-10 ${className}`}
    />
  );
}
