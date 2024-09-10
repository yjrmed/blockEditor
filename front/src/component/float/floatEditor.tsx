import { useContext, useState, useRef, useEffect } from "react";
import { EditorContext } from "../../App";
import styles from "./style.module.scss";
import { BlockEditor } from "./blockController";
import { InlineEditor } from "./inlineEditor";
import { MoveController } from "./moveCon";
import { RangeEditor } from "./rangeEditor";
import { sele } from "../../funcs/selector";

interface IPopPos {
  top: string;
  left: string;
  display: string;
}

const hidePos: IPopPos = {
  top: "unset",
  left: "unset",
  display: "none",
};

export const PopEditorWrap = () => {
  const editor = useContext(EditorContext);
  const popEditor = useRef<HTMLDivElement>(null);
  const [popPos, setPopPos] = useState<IPopPos>(hidePos);
  const [seleObj, setSeleObj] = useState<sele.ISelectionObj | null>(null);

  useEffect(() => {
    editor.$SelectionChange.subscribe((res) => {
      setSeleObj(res);
    });
  }, []);

  useEffect(() => {
    const wrapArticle = popEditor.current?.parentElement;
    if (seleObj?.block && wrapArticle) {
      const wrapRect = wrapArticle.getBoundingClientRect();
      const tarRect = seleObj.block.ele.getBoundingClientRect();
      const selfRect = popEditor.current.getBoundingClientRect();

      let top = tarRect.top - wrapRect.top;
      if (top < selfRect.height) {
        top += tarRect.height + selfRect.height;
      }

      let left = tarRect.left - wrapRect.left;
      if (left + selfRect.width > wrapRect.width) {
        left -= selfRect.width - tarRect.width;
      }

      setPopPos({
        top: `${top}px`,
        left: `${left}px`,
        display: "block",
      });
    } else {
      setPopPos(hidePos);
    }
  }, [seleObj?.block]);

  return (
    <>
      {seleObj && (
        <div
          ref={popEditor}
          style={popPos}
          className={styles.blockEditor}
          tabIndex={-1}>
          <div className="inner">
            <MoveController />
            <BlockEditor block={seleObj.block} />
            <InlineEditor inline={seleObj.Inline} />
            <RangeEditor sele={seleObj.selection} />
          </div>
        </div>
      )}
    </>
  );
};
