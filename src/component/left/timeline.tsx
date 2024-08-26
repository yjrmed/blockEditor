import { useState, useContext, useEffect } from "react";
import { EditorContext } from "../../App";
import styles from "./style.module.scss";
import { saver } from "../../funcs/saver";

export const Timeline = () => {
  const editor = useContext(EditorContext);
  const [recs, setRecs] = useState<{
    back: saver.CommandRecord[];
    forward: saver.CommandRecord[];
  }>({ back: [], forward: [] });

  useEffect(() => {
    editor.$ObserverSubject.subscribe((res) => {
      setRecs(editor.GetCommandList());
    });
  }, []);

  return (
    <>
      <div className={styles.wrapTimeline}>
        <div className={styles.history}>
          <button onClick={(e) => editor.History(-1)}>&#8656;</button>
          <button onClick={(e) => editor.History(1)}>&#8658;</button>
        </div>

        {recs.forward.length > 0 && (
          <ul className={`${styles.recordList} ${styles.forward}`}>
            {recs.forward.map((rec, idx) => (
              <li
                onClick={(e) => editor.History(recs.forward.length - idx)}
                key={rec.id}>
                {rec.description ? rec.description : "______"}
              </li>
            ))}
          </ul>
        )}

        {recs.back.length > 0 && (
          <ul className={`${styles.recordList} ${styles.back}`}>
            {recs.back
              .slice()
              .reverse()
              .map((rec, idx) => (
                <li onClick={(e) => editor.History(-(idx + 1))} key={rec.id}>
                  {rec.description ? rec.description : "______"}
                </li>
              ))}
          </ul>
        )}
      </div>
    </>
  );
};
