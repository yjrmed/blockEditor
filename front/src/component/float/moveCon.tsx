import styles from "./style.module.scss";
import { useContext } from "react";
import { EditorContext } from "../../App";
export const MoveController = () => {
  const editor = useContext(EditorContext);

  const prevInline = editor.GetNeighborEle(false, {
    block: false,
    inline: true,
  });

  const nextInline = editor.GetNeighborEle(true, {
    block: false,
    inline: true,
  });

  const prevBlock = editor.GetNeighborEle(false, {
    block: true,
    inline: false,
  });
  const nextBlock = editor.GetNeighborEle(true, { block: true, inline: false });

  return (
    <div className={styles.moveCon}>
      <button
        disabled={prevBlock === null}
        onClick={(e) => {
          editor.SetSelect(prevBlock);
        }}>
        ↑
      </button>

      <button
        disabled={nextBlock === null}
        onClick={(e) => {
          editor.SetSelect(nextBlock);
        }}>
        ↓
      </button>

      <button
        disabled={prevInline === null}
        onClick={(e) => {
          editor.SetSelect(prevInline);
        }}>
        ←
      </button>

      <button
        disabled={nextInline === null}
        onClick={(e) => {
          editor.SetSelect(nextInline);
        }}>
        →
      </button>
    </div>
  );
};
