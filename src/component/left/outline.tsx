import { useState, useContext, useEffect } from "react";
import { EditorContext } from "../../App";
import { OutlineItem, IChild, ParseChildren } from "./outline/item";
import styles from "./style.module.scss";

export const Outline = () => {
  const editor = useContext(EditorContext);
  const [rootChildren, setRootChildren] = useState<IChild[]>([]);

  useEffect(() => {
    editor.$ObserverSubject.subscribe((ml) => {
      if (!rootChildren.length && editor.Layer) {
        setRootChildren(ParseChildren(editor.Layer, "item_"));
      } else {
        ml.forEach((m) => {
          if (m.target === editor.Layer) {
            setRootChildren(ParseChildren(editor.Layer, "item_"));
          }
        });
      }
    });
  }, []);

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
