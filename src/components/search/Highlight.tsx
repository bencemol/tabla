import { ElementType, Fragment } from "react";

type HighlightProps = {
  text: string;
  highlight?: string;
  hideOnNoMatch?: boolean;
  wrapper?: ElementType;
};

export default function Highlight({
  text,
  highlight,
  hideOnNoMatch = false,
  wrapper: Wrapper = Fragment,
}: HighlightProps) {
  const regex = highlight
    ? new RegExp(`(${highlight})`, "gi")
    : new RegExp(".^"); // don't match anything
  const parts = text.split(regex);

  const template =
    !hideOnNoMatch || parts.length > 1
      ? parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i}>{part}</mark>
          ) : (
            <Fragment key={i}>{part}</Fragment>
          )
        )
      : null;

  return Wrapper && template ? <Wrapper>{template}</Wrapper> : <>{template}</>;
}
