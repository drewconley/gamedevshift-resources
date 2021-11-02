import classnames from "classnames";

import { Tag } from "../../types";

import styles from "./TagFilter.module.scss";

export type TagsProps = {
  className?: string;
  onFilter: (tag: Tag) => void;
  tags?: Record<Tag, number>;
  currentTag: Tag;
};

export function TagFilter(props: TagsProps) {
  const { className, currentTag, onFilter, tags = [] } = props;

  return (
    <ul className={classnames(styles.root, className)}>
      {Object.entries(tags).map(([tag, count]) => (
        <li
          key={tag}
          className={classnames(styles.tag, {
            [styles.selected]: tag === currentTag,
          })}
        >
          <button className={styles.button} onClick={() => onFilter(tag)}>
            {tag} <span className={styles.count}>{count}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
