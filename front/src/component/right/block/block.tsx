import { FoldableBox } from "../../utils/foldableBox";
import { TextAlign } from "./textAlign";
import { FontFamily } from "../common/fontFamily";
import { FontWeight } from "../common/fontWeight";
import { VideoProp } from "./video";
import { IDomItem } from "../../../funcs/htmlDoms";

interface IBlock {
  block: IDomItem;
}

export const BlockProperty = (prop: IBlock) => {
  return (
    <>
      <FoldableBox title="Typography">
        {/* wrap and add class */}
        <TextAlign block={prop.block.ele} />
        <FontFamily tar={prop.block.ele} />
        <FontWeight tar={prop.block.ele} />
      </FoldableBox>

      {prop.block.ele instanceof HTMLVideoElement && (
        <FoldableBox title="VIDEO">
          <VideoProp video={prop.block.ele} />
        </FoldableBox>
      )}
    </>
  );
};
