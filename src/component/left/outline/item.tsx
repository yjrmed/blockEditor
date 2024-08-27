import React, { useState, useContext, useEffect, useRef } from "react";
import { EditorContext } from "../../../App";
import { htmlTag } from "../../../funcs/htmlDoms";
import styles from "../style.module.scss";
import { Subscription } from "rxjs";

export interface IChild {
  ele: Element;
  id: string;
}

export interface IOutlineItem {
  child: IChild;
  setParentIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const OutlineItem = (props: IOutlineItem) => {
  const editor = useContext(EditorContext);
  const sbsc = useRef<Subscription | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const parseChildren = (): IChild[] => {
    let gcnt = 0;
    return Array.from(props.child.ele.children).map((child) => {
      return {
        ele: child,
        id: props.child.id + "_" + (gcnt++).toString(),
      } as IChild;
    });
  };
  const [children, setChildren] = useState<IChild[]>(() => parseChildren());

  useEffect(() => {
    editor.$SelectionChange.subscribe((res) => {
      if (res?.block.ele === props.child.ele) {
        setIsActive(true);
        setIsOpen(true);
      } else {
        setIsActive(false);
      }
    });
    editor.$ObserverSubject.subscribe((ml) => {
      ml.forEach((m) => {
        if (m.target === props.child.ele) {
          setChildren(parseChildren());
        }
      });
    });
    setChildren(parseChildren());
  }, [props]);

  useEffect(() => {
    if (isOpen) {
      props.setParentIsOpen(true);
    }
  }, [isOpen]);

  sbsc.current?.unsubscribe();
  if (isActive) {
    editor.$ObserverSubject.subscribe((ml) => {
      const found = ml.find((m) => {
        return m.type === "characterData";
      });
      if (found) {
        setChildren(parseChildren());
      }
    });
  }

  const tag = htmlTag.GetTagInfo(props.child.ele as HTMLElement);

  return (
    <li
      className={`
        ${styles.liItem} 
        ${children.length > 0 ? styles.hasChild : ""}
        ${isOpen ? styles.open : ""}`}>
      <label id={props.child.id} className={`${isActive ? styles.active : ""}`}>
        <span
          className={`${styles.type} ${tag?.type ? styles[tag.type] : ""} `}
          onClick={(e) => {
            setIsOpen(!isOpen);
          }}>
          {`${tag?.name}`}
        </span>
        <span
          className={styles.txt}
          onClick={(e) => {
            editor.SetSelect(props.child.ele as HTMLElement, true);
          }}>
          {(props.child.ele.textContent?.trim())
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
