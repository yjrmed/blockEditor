import { useContext, useState, useRef, useEffect } from "react";
import { EditorContext } from "../../App";
import styles from "./style.module.scss";
import { BlockEditor } from "./blockCon";
import { InlineEditor } from "./inlineCon";
import { MoveController } from "./moveCon";
import { RangeEditor } from "./rangeEditor";
import { sele } from "../../funcs/selector";
import { Subscription } from "rxjs";

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
  const [isEditting, setIsEditting] = useState<boolean>(false);

  useEffect(() => {
    const sbsc = new Subscription();

    sbsc.add(
      editor.$SelectionChange.subscribe((res) => {
        // console.log(res?.selection);
        setSeleObj(res);
      })
    );

    sbsc.add(
      editor.EditStateChange.subscribe((res) => {
        setIsEditting(res);
      })
    );

    return () => {
      sbsc.unsubscribe();
    };
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
            {isEditting && <RangeEditor sele={seleObj.selection} />}
          </div>
        </div>
      )}
    </>
  );
};
