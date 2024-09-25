import styles from "./style.module.scss";
import { useContext } from "react";
import { EditorContext } from "../../App";
import { sele } from "../../funcs/selector";
import { htmlTag } from "../../funcs/htmlDoms";
import { cmdFunc } from "../../funcs/commandFunction";
import { DropDown, DropdownContext } from "../utils/dropdown";
interface IRangeEditor {
  sele: Selection;
}

const inlins = htmlTag.GetInlines(false).filter((inline) => {
  return !["B", "I", "SUP", "SUB", "U", "S"].includes(inline.name);
});

const selfCloseInlines = htmlTag.GetInlines(true);

export const RangeEditor = (props: IRangeEditor) => {
  const editor = useContext(EditorContext);

  const toggleChk = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cb = e.target as HTMLInputElement;
    const tagInfo = htmlTag.GetTagInfo(cb.value);
    const order = sele.Selector.GetSelectionOrder(props.sele);
    if (tagInfo && !tagInfo.noText && order && !order.isCollapsed) {
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

  const insertTxtlessEelment = (tagName: string) => {
    // 選択テキストノードの親要素が　自己完結タグの場合は無効にさせる。

    const range = props.sele.getRangeAt(0);
    const ele = document.createElement(tagName);
    range.insertNode(ele);
  };

  const range = props.sele.getRangeAt(0);
  const selectedNode = range.commonAncestorContainer;
  const caps = sele.Selector.GetCappedInlineTags(props.sele).map((cap) => {
    return cap.tagName;
  });

  return (
    <>
      {props.sele.isCollapsed && !htmlTag.IsInsertableElement(selectedNode) && (
        <div className={styles.rangeCon} tabIndex={-1}>
          <DropDown>
            <DropDown.Button txt="Insert" className={styles.itemBtn} />
            <DropDown.Body>
              <FormSelectSelfInlineTag
                tags={selfCloseInlines}
                onSelect={insertTxtlessEelment}
              />
            </DropDown.Body>
          </DropDown>
        </div>
      )}

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

              <DropDown>
                <DropDown.Button txt="Etc" className={styles.itemBtn} />
                <DropDown.Body>
                  <FormSelectInlineTag
                    tags={inlins}
                    caps={caps}
                    onChange={toggleChk}
                  />
                </DropDown.Body>
              </DropDown>
            </div>
          )}

          {selectedNode.nodeType === Node.ELEMENT_NODE && <></>}
        </div>
      )}
    </>
  );
};

interface IFormSelectTag {
  tags: htmlTag.IHtmlTag[];
  caps: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormSelectInlineTag = (props: IFormSelectTag) => {
  const dd = useContext(DropdownContext);
  const _toggleChk = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(e);
    dd.setStateOpen(false);
  };

  return (
    <div className={styles.selectInline}>
      {props.tags?.map((tag, idx) => {
        return (
          <div key={`${idx}_${tag.name}`}>
            <input
              type="checkbox"
              id={`chk_${tag.name}`}
              value={tag.name}
              onChange={_toggleChk}
              checked={props.caps.includes(tag.name)}></input>
            <label htmlFor={`chk_${tag.name}`}>{tag.name}</label>
          </div>
        );
      })}
    </div>
  );
};

interface IFormSelectSelfInlineTag {
  tags: htmlTag.IHtmlTag[];
  onSelect: (ret: string) => void;
}

const FormSelectSelfInlineTag = (props: IFormSelectSelfInlineTag) => {
  const dd = useContext(DropdownContext);
  const onClickBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.onSelect((e.target as HTMLButtonElement).value);
    dd.setStateOpen(false);
  };

  return (
    <div className={styles.selectInline2}>
      {props.tags?.map((tag, idx) => {
        return (
          <button
            key={`${idx}_${tag.name}`}
            value={tag.name}
            onClick={onClickBtn}>
            {tag.name}
          </button>
        );
      })}
    </div>
  );
};
