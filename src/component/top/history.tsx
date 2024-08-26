import styles from "./style.module.scss";
import { useContext } from "react";
import { EditorContext } from "../../App";

export const History = () => {
  const editor = useContext(EditorContext);

  return (
    <div className={styles.history}>
      <button onClick={(e) => editor.History(-1)}>&#8656;</button>
      <button onClick={(e) => editor.History(1)}>&#8658;</button>
    </div>
  );
};
