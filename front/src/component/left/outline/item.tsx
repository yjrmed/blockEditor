import React, { useState, useContext, useEffect } from "react";
import { EditorContext } from "../../../App";
import { htmlTag } from "../../../funcs/htmlDoms";
import styles from "../style.module.scss";
import { Subscription } from "rxjs";

export interface IChild {
  ele: Element;
  id: string;
  tag: htmlTag.IHtmlTag | null;
}

export function ParseChildren(ele: Element, pre: string = ""): IChild[] {
  let gcnt = 0;
  return Array.from(ele.children)

    .map((child) => {
      return {
        ele: child,
        tag: htmlTag.GetTagInfo(child as HTMLElement),
        id: pre + "_" + (gcnt++).toString(),
      } as IChild;
    })
    .filter((child) => {
      return child.tag && child.tag.type !== htmlTag.TagType.etc;
    });
}

export interface IOutlineItem {
  child: IChild;
  setParentIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const OutlineItem = (props: IOutlineItem) => {
  const editor = useContext(EditorContext);
  const [item, setItem] = useState<IChild>(props.child);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [children, setChildren] = useState<IChild[]>(
    ParseChildren(item.ele, item.id)
  );

  useEffect(() => {
    const sbsc = new Subscription();
    sbsc.add(
      editor.$SelectionChange.subscribe((res) => {
        if (res?.block.ele === item.ele) {
          setIsActive(true);
          setIsOpen(true);
        } else if (res?.Inline?.ele === item.ele) {
          setIsActive(true);
        } else {
          setIsActive(false);
        }
      })
    );
    sbsc.add(
      editor.$ObserverSubject.subscribe((ml) => {
        ml.forEach((m) => {
          if (m.target === item.ele) {
            setChildren(ParseChildren(item.ele, item.id));
          } else if (isActive) {
            const found = ml.find((m) => {
              return m.type === "characterData";
            });
            if (found) {
              setChildren(ParseChildren(item.ele, item.id));
            }
          }
        });
      })
    );
    setChildren(ParseChildren(item.ele, item.id));
    return () => {
      sbsc.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setItem(props.child);
  }, [props.child]);

  useEffect(() => {
    if (isOpen) {
      props.setParentIsOpen(true);
    }
  }, [isOpen]);

  return (
    <li
      className={`
        ${styles.liItem} 
        ${children.length > 0 ? styles.hasChild : ""}
        ${isOpen ? styles.open : ""}`}>
      <label id={item.id} className={`${isActive ? styles.active : ""}`}>
        <span
          className={`${styles.type} ${
            item.tag?.type ? styles[item.tag.type] : ""
          } `}
          onClick={(e) => {
            setIsOpen(!isOpen);
            if (!isOpen) {
              editor.SetSelect(item.ele as HTMLElement, true);
            }
          }}>
          {`${item.tag?.name}`}
        </span>
        <span
          className={styles.txt}
          onDoubleClick={(e) => {
            editor.SetSelect(item.ele as HTMLElement, true, true);
          }}
          onClick={(e) => {
            editor.SetSelect(item.ele as HTMLElement, true);
          }}>
          {item.ele.textContent?.trim()
            ? item.ele.textContent.substring(0, 20)
            : "______"}
        </span>
      </label>
      {children.length > 0 && (
        <ul>
          {children.map((child) => (
            <OutlineItem
              child={child}
              setParentIsOpen={setIsOpen}
              key={child.id}
            />
          ))}
        </ul>
      )}
    </li>
  );
};
