import React, { useState, useContext, useEffect } from "react";
import { EditorContext } from "../../../App";
import { htmlTag } from "../../../funcs/htmlDoms";
import styles from "../style.module.scss";
import { Subscription } from "rxjs";

export interface IOutlineItem {
  child: INode;
  setParentIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface INode {
  ele: Element;
  id: string;
  tag: htmlTag.IHtmlTag | null;
}

export function ParseChildren(ele: Element, pre: string = ""): INode[] {
  let gcnt = 0;
  return Array.from(ele.children)
    .map((child) => {
      return {
        ele: child,
        tag: htmlTag.GetTagInfo(child as HTMLElement),
        id: pre + "_" + (gcnt++).toString(),
      } as INode;
    })
    .filter((child) => {
      return child.tag && child.tag.type !== htmlTag.TagType.etc;
    });
}

export const OutlineItem = (props: IOutlineItem) => {
  const editor = useContext(EditorContext);
  const [item, setItem] = useState<INode>(props.child);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setItem(props.child);
  }, [props.child]);

  useEffect(() => {
    const sbsc = new Subscription();
    sbsc.add(
      editor.$SelectionChange.subscribe((res) => {
        if (item.ele === res?.block.ele) {
          setIsActive(true);
          setIsOpen(true);
        } else if (item.ele === res?.Inline?.ele) {
          setIsActive(true);
        } else {
          setIsActive(false);
        }
      })
    );

    sbsc.add(
      editor.$ObserverSubject.subscribe((ml) => {
        const found = ml.find((m) => {
          return (
            item.ele ===
            (m.target instanceof HTMLElement
              ? m.target
              : m.target.parentElement)
          );
        });
        if (found) {
          setItem((pre) => {
            return {
              ele: pre.ele,
              tag: pre.tag,
              id: pre.id,
            };
          });
        }
      })
    );

    return () => {
      sbsc.unsubscribe();
    };
  }, [item]);

  useEffect(() => {
    if (isOpen) {
      props.setParentIsOpen(true);
    }
  }, [isOpen]);

  const children = ParseChildren(item.ele, item.id);

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
          {children.map((child, idx) => (
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
