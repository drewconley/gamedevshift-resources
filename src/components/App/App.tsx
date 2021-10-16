import { Card } from "../../components/Card/Card";
import { Header } from "../Header/Header";
import resources from "../../data";
import styles from "./App.module.scss";

function App() {
  return (
    <div className={styles.root}>
      <Header />
      <div className={styles.resources}>
        {resources.map((resource, key) => (
          <Card key={key} resource={resource} />
        ))}
      </div>
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
    </div>
  );
}

export default App;
