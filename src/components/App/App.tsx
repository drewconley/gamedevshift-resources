import { Card } from "../../components/Card/Card";
import resources from "../../data";
import styles from "./App.module.scss";

function App() {
  return (
    <div className={styles.root}>
      <div className={styles.resources}>
        {resources.map((resource, key) => (
          <Card key={key} resource={resource} />
        ))}
      </div>
    </div>
  );
}

export default App;
