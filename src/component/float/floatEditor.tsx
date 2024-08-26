import { useContext, useState, useRef, useEffect } from "react";
import { EditorContext } from "../../App";
import styles from "./style.module.scss";
import { BlockEditor } from "./blockController";
import { InlineEditor } from "./inlineEditor";
import { sele } from "../../funcs/selector";

interface IPopPos {
  top: string;
  left: string;
  display: string;
}

interface IPopBlockEditorProps {
  RelativeWrap: React.RefObject<HTMLDivElement>;
}

const hidePos: IPopPos = {
  top: "unset",
  left: "unset",
  display: "none",
};

export const PopEditorWrap = (props: IPopBlockEditorProps) => {
  const editor = useContext(EditorContext);
  const popEditor = useRef(null);
  const [popPos, setPopPos] = useState<IPopPos>(hidePos);
  const [seleObj, setSeleObj] = useState<sele.ISelectionObj | null>(null);

  useEffect(() => {
    editor.$SelectionChange.subscribe((res) => {
      setSeleObj(res);
    });
  }, []);

  useEffect(() => {
    if (seleObj?.block && props.RelativeWrap.current) {
      const wrapRect = props.RelativeWrap?.current.getBoundingClientRect();
      const tarRect = seleObj.block.ele.getBoundingClientRect();
      setPopPos({
        top: `${tarRect.top - wrapRect.top}px`,
        left: `${tarRect.left - wrapRect.left}px`,
        display: "block",
      });
    } else {
      setPopPos(hidePos);
    }
  }, [seleObj?.block]);

  return (
    <div
      ref={popEditor}
      style={popPos}
      className={styles.blockEditor}
      tabIndex={-1}>
      <div className="inner">
        <BlockEditor so={seleObj} />
        <InlineEditor so={seleObj} />
      </div>
    </div>
  );
};
