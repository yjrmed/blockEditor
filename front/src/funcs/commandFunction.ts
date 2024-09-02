import { domFuncs } from "./htmlDoms";

export namespace cmdFunc {
  export function RangeCapTagCommand(
    tagName: string,
    start: Node,
    startOffset: number,
    end: Node,
    endOffset: number
  ) {
    const ancestors = domFuncs.GetCommonAncestorElements(start, end);
    if (!ancestors.length) {
      throw new Error("CapRangeTagCommand: not found ancestor");
    }
    const commonAncestorElement = ancestors[0];
    const tag = document.createElement(tagName);
    Array.from(commonAncestorElement.childNodes).forEach((node) => {
      tag.appendChild(node);
    });
    commonAncestorElement.innerHTML = "";
    commonAncestorElement.appendChild(tag);
    const former = domFuncs.SplitElement(tag, start, startOffset);
    domFuncs.SplitElement(
      tag,
      end,
      start === end ? endOffset - startOffset : endOffset
    );
    const latter = tag;
    domFuncs.StripTag(former);
    domFuncs.StripTag(latter);
    domFuncs.OptimizeInlineTag(commonAncestorElement);
  }

  export function RemoveRangeCapTagCommand(
    tagName: string,
    start: Node,
    startOffset: number,
    end: Node,
    endOffset: number
  ) {
    const commonAncestorTag = domFuncs
      .GetCommonAncestorElements(start, end)
      .find((ancestor) => {
        return ancestor.tagName === tagName;
      });
    if (!commonAncestorTag) {
      throw new Error(`not found common ${tagName} element`);
    }
    domFuncs.SplitElement(commonAncestorTag, start, startOffset);
    const middle = domFuncs.SplitElement(
      commonAncestorTag,
      end,
      start === end ? endOffset - startOffset : endOffset
    );
    domFuncs.StripTag(middle);
  }

  export function DeleteElement(ele: HTMLElement) {
    ele.remove();
  }

}
