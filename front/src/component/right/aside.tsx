import styles from "./style.module.scss";
import { sele } from "../../funcs/selector";
import { htmlTag } from "../../funcs/htmlDoms";
import { EditorContext } from "../../App";
import { useContext, useEffect, useRef, useState } from "react";
import { CommonAttribute } from "./common/common";
import { BlockProperty } from "./block/block";
import { InlineProperty } from "./inline/inline";
import { Subscription } from "rxjs";

export const Aside = () => {
  const editor = useContext(EditorContext);
  const [target, setTarget] = useState<sele.ISelectItem | null>(null);
  const sbsc = useRef<Subscription>(new Subscription());

  sbsc.current.unsubscribe();
  sbsc.current = editor.$SelectionChange.subscribe((res) => {
    setTarget(res?.Inline ? res.Inline : res?.block ? res.block : null);
  });

  return (
    <aside className={styles.rightAside} tabIndex={-1}>
      <div className={styles.inner}>
        {target?.tagInfo && (
          <label className={styles.tarLabel}>
            <span
              className={
                target.tagInfo.type === htmlTag.TagType.block
                  ? styles.block
                  : target?.tagInfo.type === htmlTag.TagType.inline
                  ? styles.inline
                  : ""
              }>
              {target.tagInfo.name}
            </span>
            <span>{target?.ele.textContent?.slice(0, 20)}</span>
          </label>
        )}

        {target && <CommonAttribute item={target}></CommonAttribute>}

        {/* inline action */}
        {target && target.tagInfo.type === htmlTag.TagType.inline && (
          <InlineProperty inline={target}></InlineProperty>
        )}

        {/* block action */}
        {target && target.tagInfo.type === htmlTag.TagType.block && (
          <BlockProperty block={target}></BlockProperty>
        )}
      </div>
    </aside>
  );
};
