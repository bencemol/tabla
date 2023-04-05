import { ElementType, Fragment } from "react";

type HighlightProps = {
  text: string;
  highlight?: string;
  contextualize?: boolean;
  hideOnNoMatch?: boolean;
  wrapper?: ElementType;
};

export default function Highlight({
  text,
  highlight,
  contextualize = false,
  hideOnNoMatch = false,
  wrapper: Wrapper = Fragment,
}: HighlightProps) {
  let context = text;
  if (contextualize && highlight) {
    context = extractContext(text, highlight);
  }
  const regex = highlight
    ? new RegExp(`(${highlight})`, "i")
    : new RegExp(".^"); // don't match anything
  const parts = context.split(regex);

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

function extractContext(text: string, highlight: string): string {
  const contextWords = 5;
  let context =
    text.match(
      new RegExp(
        `(\\S+\\s){0,${contextWords}}(${highlight})(\\S*\\s){0,${contextWords}}`
      )
    )?.[0] ?? "";
  if (!text.startsWith(context)) {
    context = `...${context}`;
  }
  if (!text.endsWith(context)) {
    context = `${context}...`;
  }
  return context;
}
