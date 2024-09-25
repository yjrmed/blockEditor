import styles from "./style.module.scss";
import { sele } from "../../funcs/selector";
import { htmlTag } from "../../funcs/htmlDoms";
import { EditorContext } from "../../App";
import { useContext, useEffect, useState } from "react";
import { CommonAttribute } from "./common/common";
import { ELementTag } from "./common/label";
import { BlockProperty } from "./block/block";
import { InlineProperty } from "./inline/inline";
import { IDomItem } from "../../funcs/htmlDoms";

export const Aside = () => {
  const editor = useContext(EditorContext);
  const [target, setTarget] = useState<IDomItem | null>(null);

  useEffect(() => {
    const sbsc = editor.$SelectionChange.subscribe((res) => {
      setTarget(res?.Inline ? res.Inline : res?.block ? res.block : null);
    });
    return () => {
      sbsc.unsubscribe();
    };
  }, []);

  return (
    <aside className={styles.rightAside} tabIndex={-1}>
      {target && (
        <div className={styles.inner}>
          <ELementTag target={target} />
          <CommonAttribute item={target} />
          {target.tagInfo.type === htmlTag.TagType.inline && (
            <InlineProperty inline={target}></InlineProperty>
          )}
          {target.tagInfo.type === htmlTag.TagType.block && (
            <BlockProperty block={target}></BlockProperty>
          )}
        </div>
      )}
    </aside>
  );
};
