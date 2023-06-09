import Button from "@/components/button/Button";
import GhostModal from "@/components/ghost/GhostModal";
import { IconTrash } from "@tabler/icons-react";

export default function Loading() {
  return (
    <GhostModal>
      <fieldset>
        <label
          htmlFor="name"
          className="w-12 rounded-md border-zinc-200 dark:border-zinc-800 bg-zinc-200 dark:!bg-zinc-800 animate-pulse"
        >
          {"\u00A0"}
        </label>
        <input
          disabled
          id="name"
          name="name"
          type="text"
          className="border-zinc-200 dark:border-zinc-800 bg-zinc-200 dark:!bg-zinc-800 animate-pulse"
        />
      </fieldset>
      <footer>
        <Button className="border-zinc-200 dark:border-zinc-800 bg-zinc-200 dark:!bg-zinc-800 animate-pulse">
          {"\u00A0"}
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="border-zinc-200 dark:border-zinc-800 bg-zinc-200 dark:!bg-zinc-800 animate-pulse"
        >
          {"\u00A0"}
        </Button>
        <Button
          variant="danger"
          className="-order-1 mr-auto border-zinc-200 dark:border-zinc-800 bg-zinc-200 dark:!bg-zinc-800 animate-pulse"
        >
          <IconTrash className="invisible" />
        </Button>
      </footer>
    </GhostModal>
  );
}
