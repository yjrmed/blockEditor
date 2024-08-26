import { FoldableBox } from "../../utils/foldableBox";
import { sele } from "../../../funcs/selector";
import { TextAlign } from "./textAlign";
import { FontFamily } from "../common/fontFamily";
import { FontWeight } from "../common/fontWeight";
import { htmlTag } from "../../../funcs/htmlDoms";

interface IBlock {
  block: sele.ISelectItem;
}

export const BlockProperty = (prop: IBlock) => {
  return (
    <>
      {htmlTag.BlockNames.includes(prop.block.tagInfo.name) && (
        <FoldableBox title="Typography">
          <TextAlign block={prop.block.ele} />
          <FontFamily tar={prop.block.ele} />
          <FontWeight tar={prop.block.ele} />
        </FoldableBox>
      )}
    </>
  );
};
