import { Card } from "../../components/Card/Card";
import { Header } from "../Header/Header";
import { Resource, Tag } from "../../types";
import { TagFilter } from "../TagFilter/TagFilter";
import resources from "../../data.json";

import styles from "./App.module.scss";
import { useState } from "react";
import { ResourceCard } from "../ResourceCard/ResourceCard";

// Gather up a unique set of all the tags in all the resources as a once off operation
const allTags = {
  All: resources.length,
  ...resources.reduce<Record<Tag, number>>((previousValue, { tags = [] }) => {
    tags.forEach((tag) => {
      previousValue[tag] = previousValue[tag] ? previousValue[tag] + 1 : 1;
    });
    return previousValue;
  }, {}),
};

function App() {
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
            tags={allTags}
          />
        </div>
      </div>
      <section className={styles.resources}>
        {resources.filter(filterByTag).map((resource, key) => (
          <ResourceCard key={key} resource={resource} />
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

export default App;
