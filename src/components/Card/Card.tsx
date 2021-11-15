import clsx from "clsx";
import { Resource } from "../../types";
import { Tags } from "../Tags/Tags";
import styles from "./Card.module.scss";

export type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return <div className={clsx(styles.root, className)}>{children}</div>;
}
