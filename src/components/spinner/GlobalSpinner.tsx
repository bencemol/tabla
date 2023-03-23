import Spinner from "./Spinner";

export default function GlobalSpinner({ className = "" }) {
  return <Spinner size="36" className={`!fixed mr-3 mb-3 z-50 ${className}`} />;
}
