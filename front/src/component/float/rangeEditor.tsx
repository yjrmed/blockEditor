import styles from "./style.module.scss";
import { useContext } from "react";
import { EditorContext } from "../../App";
import { sele } from "../../funcs/selector";
import { htmlTag } from "../../funcs/htmlDoms";
import { cmdFunc } from "../../funcs/commandFunction";

interface IRangeEditor {
  sele: Selection;
}

export const RangeEditor = (props: IRangeEditor) => {
  const editor = useContext(EditorContext);

  const toggleChk = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cb = e.target as HTMLInputElement;
    const tagInfo = htmlTag.GetTagInfo(cb.value);
    const order = sele.Selector.GetSelectionOrder(props.sele);
    if (tagInfo && order && !order.isCollapsed) {
      if (cb.checked) {
        editor.SaverCommand(() => {
          cmdFunc.RangeCapTagCommand(
            tagInfo.name,
            order.startNode,
            order.startOffset,
            order.endNode,
            order.endOffset
          );
        }, `cap with ${tagInfo.name}`);
      } else {
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
  };

  const range = props.sele.getRangeAt(0);
  const selectedNode = range.commonAncestorContainer;
  const caps = sele.Selector.GetCappedInlineTags(props.sele).map((cap) => {
    return cap.tagName;
  });

  return (
    <>
      {!props.sele.isCollapsed && (
        <div className={styles.rangeCon} tabIndex={-1}>
          {(selectedNode.nodeType === Node.TEXT_NODE ||
            selectedNode.nodeType === Node.ELEMENT_NODE) && (
            <div>
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
            </div>
          )}

          {selectedNode.nodeType === Node.ELEMENT_NODE && <></>}
        </div>
      )}
    </>
  );
};
