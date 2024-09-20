import { sele } from "../../funcs/selector";
import styles from "./style.module.scss";
import { domFuncs } from "../../funcs/htmlDoms";
import { useContext, useState, useEffect } from "react";
import { EditorContext } from "../../App";

interface IInlineItem {
  inline: sele.ISelectItem | null;
}

export const InlineEditor = (props: IInlineItem) => {
  const editor = useContext(EditorContext);
  const [inline, setInline] = useState<sele.ISelectItem | null>(props.inline);

  useEffect(() => {
    setInline(props.inline);
  }, [props]);

  const stripInlineTag = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (inline) {
      const tar = inline.ele;
      const rslt = editor.SaverCommand(() => {
        domFuncs.StripTag(tar);
      }, `Strip tag: ${tar.tagName}`);
      if (rslt && editor.Block) {
        editor.SetSelect(editor.Block.ele);
      }
    }
  };

  return (
    <>
      {inline && (
        <div className={styles.inlineCon} tabIndex={-1}>
          <label className={styles.tag}>{inline.tagInfo.name}</label>
          <button onClick={(e) => editor.RemoveSelect(true)}>Delete</button>
          {!inline.tagInfo.hasText && (
            <button onClick={stripInlineTag}>Strip</button>
          )}
        </div>
      )}
    </>
  );
};
