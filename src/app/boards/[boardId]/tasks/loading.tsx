import Button from "@/components/button/Button";
import GhostModal from "@/components/ghost/GhostModal";
import TextArea from "@/components/textarea/TextArea";
import { IconTrash } from "@tabler/icons-react";

export default function Loading() {
  return (
    <GhostModal>
      <fieldset>
        <label htmlFor="title">{"\u00A0"}</label>
        <input
          disabled
          id="title"
          name="title"
          type="text"
          className="bg-zinc-200 dark:bg-zinc-800 animate-pulse"
        />
      </fieldset>
      <fieldset>
        <label htmlFor="description">{"\u00A0"}</label>
        <TextArea
          disabled
          id="description"
          name="description"
          className="resize-none min-h-[10rem] max-h-96 bg-zinc-200 dark:bg-zinc-800 animate-pulse"
        />
      </fieldset>
      <footer>
        <Button>{"\u00A0"}</Button>
        <Button type="submit" variant="primary">
          {"\u00A0"}
        </Button>
        <Button variant="danger" className="-order-1 mr-auto">
          <IconTrash className="invisible" />
        </Button>
      </footer>
    </GhostModal>
  );
}
