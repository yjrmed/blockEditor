import { useState, useContext, useEffect } from "react";
import { EditorContext } from "../../App";
import { FilerContext } from "../../App";
import { htmlTag } from "../../funcs/htmlDoms";
import { OutlineItem, INode, ParseChildren } from "./outline/item";
import styles from "./style.module.scss";

export const Outline = () => {
  const editor = useContext(EditorContext);
  const filer = useContext(FilerContext);
  const [root, setRoot] = useState<INode | null>(null);

  useEffect(() => {
    const sbsc = filer.$PostChange.subscribe((res) => {
      setRoot((pre) => {
        if (res) {
          return {
            ele: res.article,
            tag: htmlTag.GetTagInfo(res.article as HTMLElement),
            id: pre + "0",
          };
        } else {
          return null;
        }
      });
    });

    return () => {
      sbsc.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const sbsc = editor.$ObserverSubject.subscribe((ml) => {
      const found = ml.find((m) => {
        return m.target === root?.ele;
      });
      if (found) {
        setRoot((pre) => {
          if (pre) {
            return {
              ele: pre.ele,
              tag: htmlTag.GetTagInfo(pre.ele as HTMLElement),
              id: pre + "0",
            };
          } else {
            return null;
          }
        });
      }
    });

    return () => {
      sbsc.unsubscribe();
    };
  }, [root]);

  const children = root ? ParseChildren(root.ele, root.id) : [];

  return (
    <>
      {children.length > 0 && (
        <div className={styles.wrapOutline}>
          <ul className={styles.ulOutline}>
            {children.map((child, idx) => (
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
