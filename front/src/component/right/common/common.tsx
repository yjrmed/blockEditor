import { FoldableBox } from "../../utils/foldableBox";
import { sele } from "../../../funcs/selector";
import { EleClass } from "./class";
import { EleStyle } from "./style";
// import { EleAttrs } from "./attrs";

interface ICommonAttribute {
  item: sele.ISelectItem;
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
