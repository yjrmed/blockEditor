import { sele } from "../../../funcs/selector";
import { useContext, useEffect, useState } from "react";
import { EditorContext } from "../../../App";
import { htmlTag } from "../../../funcs/htmlDoms";
import styles from "./style.module.scss";

interface IELementTag {
  target: sele.ISelectItem;
}

export const ELementTag = (props: IELementTag) => {
  const editor = useContext(EditorContext);

  const parent = editor.GetParentEle(props.target.ele);
  const parentTag =
    parent instanceof HTMLElement ? htmlTag.GetTagInfo(parent) : null;

  return (
    <div className={styles.wapTag}>
      {parent && parentTag && (
        <button
          className={`${styles.tag} ${styles[parentTag.type]}`}
          onClick={(e) => {
            editor.SetSelect(parent, true, editor.IsEditting);
          }}>
          {parentTag.name}
        </button>
      )}
      <div className={styles.targetLabel}>
        <label className={`${styles.tag} ${styles[props.target.tagInfo.type]}`}>
          {props.target.tagInfo.name}
        </label>
        <span>{props.target.ele.textContent?.slice(0, 20)}</span>
      </div>
    </div>
  );
};
