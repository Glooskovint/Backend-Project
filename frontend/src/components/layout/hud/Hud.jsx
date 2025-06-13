import styles from "./Hud.module.css";

const Hud = () => {
  return (
    <div className={styles["hud-container"]}>
      <div className={styles["outermost-elements"]}></div>
      <div className={styles["outer-ticks-ring"]}></div>
      <div className={styles["fine-ticks-ring"]}></div>
      {/* <div className={styles.segmentedRing}></div> */}
    </div>
  );
};

export default Hud;

