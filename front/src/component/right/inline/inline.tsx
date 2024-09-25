import { FoldableBox } from "../../utils/foldableBox";
import { AProp } from "./a";
import { ImgProp } from "./img";
import { FontFamily } from "../common/fontFamily";
import { FontWeight } from "../common/fontWeight";
import { RubyProp } from "./ruby";
import { IFrameProp } from "./iframe";
import { IInputProp } from "./input";
import { IDomItem } from "../../../funcs/htmlDoms";

interface IInline {
  inline: IDomItem;
}

export const InlineProperty = (prop: IInline) => {
  return (
    <>
      {/* <FoldableBox title="Inline">
        <div>common Inline</div>
      </FoldableBox> */}

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
      {prop.inline.ele instanceof HTMLIFrameElement && (
        <FoldableBox title="IMG">
          <IFrameProp iframe={prop.inline.ele} />
        </FoldableBox>
      )}
      {/* {prop.inline.ele instanceof HTMLInputElement && (
        <FoldableBox title="INPUT">
          <IInputProp input={prop.inline.ele} />
        </FoldableBox>
      )} */}
      {prop.inline.tagInfo.name === "RUBY" && (
        <FoldableBox title="RUBY">
          <RubyProp ruby={prop.inline.ele} />
        </FoldableBox>
      )}
      <FoldableBox title="Typography">
        <FontFamily tar={prop.inline.ele} />
        <FontWeight tar={prop.inline.ele} />
      </FoldableBox>
    </>
  );
};
