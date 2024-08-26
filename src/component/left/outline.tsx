import { useState, useContext, useEffect } from "react";
import { EditorContext } from "../../App";
import { OutlineItem, IChild } from "./outline/item";
import styles from "./style.module.scss";

export const Outline = () => {
  const editor = useContext(EditorContext);
  const [rootChildren, setRootChildren] = useState<IChild[]>([]);

  useEffect(() => {
    editor.$ObserverSubject.subscribe((ml) => {
      if (!rootChildren.length) {
        parseChildren();
      } else {
        ml.forEach((m) => {
          if (m.target === editor.Layer) {
            parseChildren();
          }
        });
      }
    });
  }, []);

  const parseChildren = () => {
    if (editor.Layer) {
      let gcnt = 0;
      setRootChildren(
        Array.from(editor.Layer.children).map((child) => {
          return {
            ele: child,
            id: "item_" + (gcnt++).toString(),
          };
        })
      );
    }
  };

  return (
    <>
      {rootChildren.length > 0 && (
        <div className={styles.wrapOutline}>
          <ul className={styles.ulOutline}>
            {rootChildren.map((child) => (
              <OutlineItem
                child={child}
                setParentIsOpen={() => {}}
                key={child.id}
              />
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
