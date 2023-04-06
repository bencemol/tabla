import Button from "@/components/button/Button";
import GhostModal from "@/components/ghost/GhostModal";
import TextArea from "@/components/textarea/TextArea";
import { IconTrash } from "@tabler/icons-react";

export default function Loading() {
  return (
    <GhostModal hasTitle={false}>
      <fieldset>
        <input
          disabled
          id="title"
          name="title"
          type="text"
          className="border-zinc-200 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-800 animate-pulse"
        />
      </fieldset>
      <fieldset>
        <label
          htmlFor="description"
          className="w-24 rounded-md bg-zinc-200 dark:bg-zinc-800 animate-pulse"
        >
          {"\u00A0"}
        </label>
        <TextArea
          disabled
          id="description"
          name="description"
          className="resize-none min-h-[20rem] max-h-96 border-zinc-200 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-800 animate-pulse"
        />
      </fieldset>
      <footer className="grid-cols-[repeat(3,1fr)]">
        <Button className="col-start-3 border-zinc-200 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-800 animate-pulse">
          {"\u00A0"}
        </Button>
        <Button
          variant="danger"
          className="-order-1 mr-auto border-zinc-200 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-800 animate-pulse"
        >
          <IconTrash className="invisible" />
        </Button>
      </footer>
    </GhostModal>
  );
}
