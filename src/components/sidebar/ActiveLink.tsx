"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";

type ActiveLinkProps = LinkProps & {
  className?: string;
};

const ActiveLink = ({
  children,
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

    setIsActive(linkPathname === activePathname);
  }, [activePathname, props.as, props.href]);

  return (
    <Link className={className} data-active={isActive} {...props}>
      {children}
    </Link>
  );
};

export default ActiveLink;
