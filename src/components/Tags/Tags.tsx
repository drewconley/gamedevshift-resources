import classnames from "classnames";

import { Resource } from "../../types";
import styles from "./Tags.module.scss";

export type TagsProps = {
  className: string;
  tags: Resource["tags"];
};

export function Tags(props: TagsProps) {
  const { className, tags = [] } = props;

  return (
    <ul className={classnames(styles.root, className)}>
      {tags.map((tag) => (
        <li className={styles.tag}>{tag}</li>
      ))}
    </ul>
  );
}
