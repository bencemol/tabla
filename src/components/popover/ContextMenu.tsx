import { IconDotsVertical } from "@tabler/icons-react";
import { useState } from "react";
import Button from "../button/Button";
import Popover from "./Popover";

export default function ContextMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen((o) => !o)}>
        <IconDotsVertical />
        <Popover isOpen={isOpen} pos="bottom-right">
          {children}
        </Popover>
      </Button>
    </>
  );
}
