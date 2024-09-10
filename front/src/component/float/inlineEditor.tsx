import { sele } from "../../funcs/selector";
import styles from "./style.module.scss";
import { domFuncs } from "../../funcs/htmlDoms";
import { useContext } from "react";
import { EditorContext } from "../../App";

interface IInlineItem {
  inline: sele.ISelectItem | null;
}

export const InlineEditor = (props: IInlineItem) => {
  const editor = useContext(EditorContext);

  const stripInlineTag = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (editor.Inline) {
      const tar = editor.Inline.ele;
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
      {props.inline && (
        <div className={styles.inlineCon} tabIndex={-1}>
          <label className={styles.tag}>{props.inline.tagInfo.name}</label>
          {editor.Inline && !editor.Inline.tagInfo.selfClose && (
            <button onClick={stripInlineTag}>strip</button>
          )}
        </div>
      )}
    </>
  );
};
