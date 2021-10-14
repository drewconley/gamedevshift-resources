import { Resource } from "../../types";
import { Tags } from "../Tags/Tags";
import styles from "./Card.module.scss";

export type CardProps = {
  resource: Resource;
};

export function Card(props: CardProps) {
  const { resource } = props;
  const { title, url, tags, blurb } = resource;

  return (
    <div className={styles.root}>
      <h3 className={styles.heading}>
        <a target="_blank" rel="noreferrer" href={url} title={title}>
          {title}
        </a>
      </h3>
      <Tags tags={tags} className={styles.tags} />
      {blurb ? <p className={styles.blurb}>{blurb}</p> : null}
    </div>
  );
}
