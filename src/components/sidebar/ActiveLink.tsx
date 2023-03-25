"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";

type ActiveLinkProps = LinkProps & {
  pathMatch?: "full" | "prefix";
  className?: string;
};

const ActiveLink = ({
  children,
  pathMatch = "prefix",
  className,
  ...props
}: PropsWithChildren<ActiveLinkProps>) => {
  const activePathname = usePathname();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const linkPathname = new URL(
      (props.as || props.href) as string,
      location.href
    ).pathname;

    const isActive =
      pathMatch === "full"
        ? activePathname === linkPathname
        : activePathname?.startsWith(linkPathname) === true;

    setIsActive(isActive);
  }, [pathMatch, activePathname, props.as, props.href]);

  return (
    <Link className={className} data-active={isActive} {...props}>
      {children}
    </Link>
  );
};

export default ActiveLink;
