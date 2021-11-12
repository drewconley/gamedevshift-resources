import { useState } from "react";
import { Resource, Tag } from "../types";
import styles from "./index.module.scss";
import resources from "../data.json";
import { Header } from "src/components/Header/Header";
import { TagFilter } from "src/components/TagFilter/TagFilter";
import { Card } from "src/components/Card/Card";
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      // Gather up a unique set of all the tags in all the resources
      tags: {
        All: resources.length,
        ...resources.reduce<Record<Tag, number>>(
          (previousValue, { tags = [] }) => {
            tags.forEach((tag) => {
              previousValue[tag] = previousValue[tag]
                ? previousValue[tag] + 1
                : 1;
            });
            return previousValue;
          },
          {}
        ),
      },
    },
  };
};

export default function Index({ tags }: { tags: Record<Tag, number> }) {
  const [currentTag, setCurrentTag] = useState<Tag>("All");

  const filterByTag = ({ tags = [] }: Resource): boolean => {
    return currentTag === "All" || tags.includes(currentTag);
  };

  return (
    <main>
      <Header />
      <div className={styles.tagFilter}>
        <div className={styles.tagFilterContainer}>
          <TagFilter
            currentTag={currentTag}
            onFilter={setCurrentTag}
            tags={tags}
          />
        </div>
      </div>
      <section className={styles.resources}>
        {resources.filter(filterByTag).map((resource, key) => (
          <Card key={key} resource={resource} />
        ))}
      </section>
      <div className={styles.addContainer}>
        <a
          className={styles.add}
          target="_blank"
          rel="noreferrer"
          href="https://github.com/drewconley/gamedevshift-resources"
        >
          Add a resource
        </a>
      </div>
    </main>
  );
}
