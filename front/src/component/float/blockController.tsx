import React, { useContext } from "react";
import styles from "./style.module.scss";
import { sele } from "../../funcs/selector";
import { EditorContext } from "../../App";
import { DropDown, DropdownContext } from "../utils/dropdown";
import { htmlTag, domFuncs } from "../../funcs/htmlDoms";

interface IBlockEditor {
  block: sele.ISelectItem | null;
}

export const BlockEditor = (props: IBlockEditor) => {
  const editor = useContext(EditorContext);

  const acArray = props.block
    ? htmlTag.GetAppendablesBlock(props.block.tagInfo)
    : [];

  let ibArray: htmlTag.IHtmlTag[] = [];
  if (props.block?.ele.parentElement) {
    const blockParent = htmlTag.GetTagInfo(props.block.ele.parentElement);
    if (blockParent) {
      ibArray = htmlTag.GetAppendablesBlock(blockParent);
    }
  }

  const DeleteElement = () => {
    if (editor.Block?.ele) {
      const tar = editor.Block.ele;
      const next = editor.Block.ele.nextElementSibling as HTMLElement;
      const rslt = editor.SaverCommand(() => {
        tar.remove();
      }, `Delete ${tar.tagName}`);
      if (rslt && next) {
        editor.SetSelect(next);
      }
    }
  };

  const AppendChild = (tn: string) => {
    if (editor.Block?.ele) {
      const tar = editor.Block.ele;
      const newEle = document.createElement(tn);
      newEle.textContent = `new ${tn} is appended`;
      const rslt = editor.SaverCommand(() => {
        tar.appendChild(newEle);
      }, `Append Child ${tar.tagName}`);
      if (rslt) {
        editor.SetSelect(newEle);
      }
    }
  };

  const before = (tn: string) => {
    if (editor.Block?.ele) {
      const tar = editor.Block.ele;
      const newEle = document.createElement(tn);
      newEle.textContent = `${tn}: Before`;
      const rslt = editor.SaverCommand(() => {
        tar.before(newEle);
      }, `Before ${newEle.tagName}`);
      if (rslt) {
        editor.SetSelect(newEle);
      }
    }
  };

  const Duplication = (): void => {
    if (editor.Block?.ele) {
      const tar = editor.Block.ele;
      const newEle = domFuncs.SafeCloenEle(tar);
      const rslt = editor.SaverCommand(() => {
        tar.after(newEle);
      }, `Duplication ${newEle.tagName}`);
      if (rslt) {
        editor.SetSelect(newEle);
      }
    }
  };

  return (
    <>
      {props.block && (
        <div className={styles.blockCon} tabIndex={-1}>
          <label className={styles.tag}>{props.block.tagInfo.name}</label>

          <button onClick={DeleteElement}>del</button>

          <DropDown>
            <DropDown.Button
              txt="ac"
              className={styles.itemBtn}
              disabled={acArray.length === 0}
            />
            <DropDown.Body>
              <FormSelectTag tags={acArray} onSelect={AppendChild} />
            </DropDown.Body>
          </DropDown>

          <DropDown>
            <DropDown.Button
              txt="before"
              className={styles.itemBtn}
              disabled={ibArray.length === 0}
            />
            <DropDown.Body>
              <FormSelectTag tags={ibArray} onSelect={before} />
            </DropDown.Body>
          </DropDown>

          <button onClick={Duplication}>duplication</button>
        </div>
      )}
    </>
  );
};

interface IFormSelectTag {
  tags: htmlTag.IHtmlTag[];
  onSelect: (ret: string) => void;
}

const FormSelectTag = (props: IFormSelectTag) => {
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
