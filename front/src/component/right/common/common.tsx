import { FoldableBox } from "../../utils/foldableBox";
import { EleClass } from "./class";
import { EleStyle } from "./style";
import { IDomItem } from "../../../funcs/htmlDoms";

interface ICommonAttribute {
  item: IDomItem;
}

export const CommonAttribute = (prop: ICommonAttribute) => {
  return (
    <>
      <FoldableBox title="class">
        <EleClass item={prop.item.ele} />
      </FoldableBox>
      <FoldableBox title="style">
        <EleStyle item={prop.item.ele} />
      </FoldableBox>
      {/* <FoldableBox title="attrs">
        <EleAttrs item={prop.item.ele} />
      </FoldableBox> */}
    </>
  );
};
