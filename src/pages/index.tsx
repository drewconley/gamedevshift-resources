import { useState } from "react";
import { Resource, Tag } from "../types";
import styles from "./index.module.scss";
import resources from "../data.json";
import { TagFilter } from "src/components/TagFilter/TagFilter";
import { GetStaticProps } from "next";
import Link from "next/link";
import Head from "next/head";
import { ResourceCard } from "src/components/ResourceCard/ResourceCard";

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      // Gather up a unique set of all the tags in all the resources
      resourcesByTag: {
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

export default function Index({
  resourcesByTag,
}: {
  resourcesByTag: Record<Tag, number>;
}) {
  const [currentTag, setCurrentTag] = useState<Tag>("All");

  const filterByTag = ({ tags = [] }: Resource): boolean => {
    return currentTag === "All" || tags.includes(currentTag);
  };

  return (
    <>
      <Head>
        <meta name="description" content="GameDev Shift resources" />
        <title>GameDev Shift resources</title>
      </Head>
      <div>
        <div className={styles.tagFilter}>
          <div className={styles.tagFilterContainer}>
            <TagFilter
              currentTag={currentTag}
              onFilter={setCurrentTag}
              tags={resourcesByTag}
            />
          </div>
        </div>
        <section className={styles.resources}>
          {resources.filter(filterByTag).map((resource, key) => (
            <ResourceCard key={key} resource={resource} />
          ))}
        </section>
        <div className={styles.addContainer}>
          <Link href="/submit" passHref>
            <a className={styles.add}>Add a resource</a>
          </Link>
        </div>
      </div>
    </>
  );
}
