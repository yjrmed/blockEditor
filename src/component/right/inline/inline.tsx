import { sele } from "../../../funcs/selector";
import { FoldableBox } from "../../utils/foldableBox";
import { AProp } from "./a";
import { ImgProp } from "./img";
import { FontFamily } from "../common/fontFamily";
import { FontWeight } from "../common/fontWeight";

interface IInline {
  inline: sele.ISelectItem;
}

export const InlineProperty = (prop: IInline) => {
  return (
    <>
      {prop.inline.ele instanceof HTMLAnchorElement && (
        <FoldableBox title="A">
          <AProp anchor={prop.inline.ele} />
        </FoldableBox>
      )}
      {prop.inline.ele instanceof HTMLImageElement && (
        <FoldableBox title="IMG">
          <ImgProp img={prop.inline.ele} />
        </FoldableBox>
      )}
      <FoldableBox title="Typography">
        <FontFamily tar={prop.inline.ele} />
        <FontWeight tar={prop.inline.ele} />
      </FoldableBox>
    </>
  );
};
