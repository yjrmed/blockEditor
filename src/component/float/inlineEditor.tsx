import { sele } from "../../funcs/selector";
import styles from "./style.module.scss";
import { htmlTag, domFuncs } from "../../funcs/htmlDoms";
import { useContext } from "react";
import { EditorContext } from "../../App";
import { cmdFunc } from "../../funcs/commandFunction";

interface IInlineItem {
  so: sele.ISelectionObj | null;
}

export const InlineEditor = (props: IInlineItem) => {
  const editor = useContext(EditorContext);

  const toggleChk = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cb = e.target as HTMLInputElement;
    const tagInfo = htmlTag.GetTagInfo(cb.value);
    if (props.so && tagInfo) {
      const order = props.so.helper.getSelectionOrder();

      if (order) {
        if (cb.checked) {
          if (!order.isCollapsed) {
            editor.SaverCommand(() => {
              cmdFunc.RangeCapTagCommand(
                tagInfo.name,
                order.startNode,
                order.startOffset,
                order.endNode,
                order.endOffset
              );
            }, `cap with ${tagInfo.name}`);
          }
        } else {
          if (!order.isCollapsed) {
            editor.SaverCommand(() => {
              cmdFunc.RemoveRangeCapTagCommand(
                tagInfo.name,
                order.startNode,
                order.startOffset,
                order.endNode,
                order.endOffset
              );
            }, `Remove cap of ${tagInfo.name}`);
          }
        }
      }
    }
  };

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

  const prevInline = editor.GetNeighborEle(false, {
    block: false,
    inline: true,
  });

  const nextInline = editor.GetNeighborEle(true, {
    block: false,
    inline: true,
  });

  const caps = props.so?.helper
    ? props.so.helper.getCappedLineTags().map((cap) => {
        return cap.tagName;
      })
    : [];

  return (
    <div className={styles.inlineCon}>
      <div>
        <button
          disabled={prevInline === null}
          onClick={(e) => {
            editor.SetSelect(prevInline);
          }}>
          ←
        </button>

        <button
          disabled={nextInline === null}
          onClick={(e) => {
            editor.SetSelect(nextInline);
          }}>
          →
        </button>

        <input
          value="B"
          id="chk_b"
          type="checkbox"
          onChange={toggleChk}
          checked={caps.includes("B")}
        />
        <label htmlFor="chk_b">b</label>

        <input
          value="I"
          id="chk_i"
          type="checkbox"
          onChange={toggleChk}
          checked={caps.includes("I")}
        />
        <label htmlFor="chk_i">i</label>

        <input
          value="SUP"
          id="chk_sup"
          type="checkbox"
          onChange={toggleChk}
          checked={caps.includes("SUP")}
        />
        <label htmlFor="chk_sup">sup</label>

        <input
          value="SUB"
          id="chk_sub"
          type="checkbox"
          onChange={toggleChk}
          checked={caps.includes("SUB")}
        />
        <label htmlFor="chk_sub">sub</label>

        <input
          value="U"
          id="chk_u"
          type="checkbox"
          onChange={toggleChk}
          checked={caps.includes("U")}
        />
        <label htmlFor="chk_u">u</label>

        <input
          value="S"
          id="chk_s"
          type="checkbox"
          onChange={toggleChk}
          checked={caps.includes("S")}
        />
        <label htmlFor="chk_s">s</label>

        {editor.Inline && <button onClick={stripInlineTag}>strip</button>}
      </div>
    </div>
  );
};
