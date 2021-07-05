import styles from "../styles/Loader.module.css";
export default function Loader(props) {
  return (
    <>
      <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingio_spinner_pulse_8pqnwl6s1kj}>
            <div class={styles.ldio_19f7j3wy9x9}>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
