import { Fragment } from "react";

type HighlightProps = {
  text: string;
  highlight: string;
  hideOnNoMatch?: boolean;
};

export default function Highlight({
  text,
  highlight,
  hideOnNoMatch = false,
}: HighlightProps) {
  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {!hideOnNoMatch || parts.length > 1
        ? parts.map((part, i) =>
            regex.test(part) ? (
              <mark key={i}>{part}</mark>
            ) : (
              <Fragment key={i}>{part}</Fragment>
            )
          )
        : null}
    </>
  );
}
