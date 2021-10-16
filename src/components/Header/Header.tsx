import { Discord } from "../../icons/Discord";
import styles from "./Header.module.scss";

export function Header() {
  return (
    <header className={styles.root}>
      <div className={styles.container}>
        <div className={styles.left}>
          <a className={styles.headingLink} href="https://gamedevshift.com/">
            <h1 className={styles.heading}>GameDev Shift</h1>
          </a>
        </div>
        <div className={styles.right}>
          <a
            className={styles.discordButton}
            target="_blank"
            rel="noreferrer"
            title="Join our Discord"
            href="https://discord.gg/umD2GRy"
          >
            <span className={styles.discordButtonSvg}>
              <Discord />
            </span>
            <span>Join our Discord</span>
          </a>
        </div>
      </div>
    </header>
  );
}
