import { useContext, useState, useEffect } from "react";
import styles from "./style.module.scss";
import { sele } from "../../funcs/selector";
import { EditorContext } from "../../App";
import { DropDown, DropdownContext } from "../utils/dropdown";
import { htmlTag, domFuncs } from "../../funcs/htmlDoms";
import { cmdFunc } from "../../funcs/commandFunction";

interface IBlockEditor {
  block: sele.ISelectItem;
}

export const BlockEditor = (props: IBlockEditor) => {
  const editor = useContext(EditorContext);
  const [block, setBlock] = useState<sele.ISelectItem>(props.block);

  useEffect(() => {
    setBlock(props.block);
  }, [props]);

  let ibArray: htmlTag.IHtmlTag[] = [];
  if (block.ele.parentElement) {
    const blockParent = htmlTag.GetTagInfo(block.ele.parentElement);
    if (blockParent) {
      ibArray = htmlTag.GetAppendablesBlock(blockParent);
    }
  }

  const AppendChild = (tn: string) => {
    const tar = block.ele;
    const newEle = cmdFunc.CreateBlock(tn);
    if (newEle) {
      const rslt = editor.SaverCommand(() => {
        tar.appendChild(newEle);
      }, `Append Child ${tar.tagName}`);
      if (rslt) {
        editor.SetSelect(
          newEle.firstElementChild ? newEle.firstElementChild : newEle,
          true,
          true
        );
      }
    }
  };

  const before = (tn: string) => {
    const tar = block.ele;
    const newEle = cmdFunc.CreateBlock(tn);
    if (newEle) {
      const rslt = editor.SaverCommand(() => {
        tar.before(newEle);
      }, `Before ${newEle.tagName}`);
      if (rslt) {
        editor.SetSelect(
          newEle.firstElementChild ? newEle.firstElementChild : newEle,
          true,
          true
        );
      }
    }
  };

  const Duplication = (): void => {
    const tar = block.ele;
    const newEle = domFuncs.SafeCloenEle(tar);
    const rslt = editor.SaverCommand(() => {
      tar.after(newEle);
    }, `Duplication ${newEle.tagName}`);
    if (rslt) {
      editor.SetSelect(newEle);
    }
  };

  const acArray = block ? htmlTag.GetAppendablesBlock(block.tagInfo) : [];

  return (
    <div className={styles.blockCon} tabIndex={-1}>
      <label className={styles.tag}>{block.tagInfo.name}</label>

      <button onClick={(e) => editor.RemoveSelect()}>Delete</button>

      <DropDown>
        <DropDown.Button
          txt="Apend"
          className={styles.itemBtn}
          disabled={acArray.length === 0}
        />
        <DropDown.Body>
          <FormSelectBlockTag tags={acArray} onSelect={AppendChild} />
        </DropDown.Body>
      </DropDown>

      <DropDown>
        <DropDown.Button
          txt="Before"
          className={styles.itemBtn}
          disabled={ibArray.length === 0}
        />
        <DropDown.Body>
          <FormSelectBlockTag tags={ibArray} onSelect={before} />
        </DropDown.Body>
      </DropDown>

      <button onClick={Duplication}>Duplication</button>
    </div>
  );
};

interface IFormSelectTag {
  tags: htmlTag.IHtmlTag[];
  onSelect: (ret: string) => void;
}

const FormSelectBlockTag = (props: IFormSelectTag) => {
  const dd = useContext(DropdownContext);
  const onClickBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.onSelect((e.target as HTMLButtonElement).value);
    dd.setStateOpen(false);
  };

  return (
    <div className={styles.selectForm}>
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
