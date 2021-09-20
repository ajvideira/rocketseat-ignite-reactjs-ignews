import { useRouter } from "next/dist/client/router";
import Link, { LinkProps } from "next/link";
import { cloneElement, ReactElement } from "react";

type ActiveLinkProps = LinkProps & {
  children: ReactElement;
  activeClassName?: string;
};

export function ActiveLink({
  children,
  activeClassName,
  ...rest
}: ActiveLinkProps) {
  const { asPath } = useRouter();

  const className = asPath === rest.href ? activeClassName ?? "active" : "";

  return <Link {...rest}>{cloneElement(children, { className })}</Link>;
}
