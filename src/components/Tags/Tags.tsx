import classnames from "classnames";

import { Tag } from "../../types";
import styles from "./Tags.module.scss";

export type TagsProps = {
  className?: string;
  tags?: Array<Tag>;
};

export function Tags(props: TagsProps) {
  const { className, tags = [] } = props;

  return (
    <ul className={classnames(styles.root, className)}>
      {tags.map((tag) => (
        <li key={tag} className={styles.tag}>
          {tag}
        </li>
      ))}
    </ul>
  );
}
