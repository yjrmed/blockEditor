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
    .filter((child) => {
      return !child.classList.contains("__WORKCLASS__");
    })
    .map((child) => {
      return {
        ele: child,
        tag: htmlTag.GetTagInfo(child as HTMLElement),
        id: pre + "_" + (gcnt++).toString(),
      } as IChild;
    });
}

export interface IOutlineItem {
  child: IChild;
  setParentIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const OutlineItem = (props: IOutlineItem) => {
  const editor = useContext(EditorContext);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [children, setChildren] = useState<IChild[]>(
    ParseChildren(props.child.ele, props.child.id)
  );

  useEffect(() => {
    const sbsc = new Subscription();
    sbsc.add(
      editor.$SelectionChange.subscribe((res) => {
        if (res?.block.ele === props.child.ele) {
          setIsActive(true);
          setIsOpen(true);
        } else {
          setIsActive(false);
        }
      })
    );
    sbsc.add(
      editor.$ObserverSubject.subscribe((ml) => {
        ml.forEach((m) => {
          if (m.target === props.child.ele) {
            setChildren(ParseChildren(props.child.ele, props.child.id));
          } else if (isActive) {
            const found = ml.find((m) => {
              return m.type === "characterData";
            });
            if (found) {
              setChildren(ParseChildren(props.child.ele, props.child.id));
            }
          }
        });
      })
    );
    setChildren(ParseChildren(props.child.ele, props.child.id));
    return () => {
      sbsc.unsubscribe();
    };
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
      <label id={props.child.id} className={`${isActive ? styles.active : ""}`}>
        <span
          className={`${styles.type} ${
            props.child.tag?.type ? styles[props.child.tag.type] : ""
          } `}
          onClick={(e) => {
            setIsOpen(!isOpen);
            if (!isOpen) {
              editor.SetSelect(props.child.ele as HTMLElement, true);
            }
          }}>
          {`${props.child.tag?.name}`}
        </span>
        <span
          className={styles.txt}
          onClick={(e) => {
            editor.SetSelect(props.child.ele as HTMLElement, true);
          }}>
          {props.child.ele.textContent?.trim()
            ? props.child.ele.textContent.substring(0, 20)
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
