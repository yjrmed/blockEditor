import { domFuncs, htmlTag } from "./htmlDoms";

export namespace cmdFunc {
  export function RangeCapTagCommand(
    tagName: string,
    start: Node,
    startOffset: number,
    end: Node,
    endOffset: number
  ): HTMLElement {
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
    const ret = domFuncs.SplitElement(
      tag,
      end,
      start === end ? endOffset - startOffset : endOffset
    );
    const latter = tag;
    domFuncs.StripTag(former);
    domFuncs.StripTag(latter);
    domFuncs.OptimizeInlineTag(commonAncestorElement);
    additionalInline(ret);
    return ret;
  }

  function additionalInline(inline: HTMLElement) {
    if (inline.tagName === "RUBY") {
      let temp = document.createElement("rp");
      temp.textContent = "(";
      inline.appendChild(temp);
      temp = document.createElement("rt");
      temp.textContent = "rt";
      inline.appendChild(temp);
      temp = document.createElement("rp");
      temp.textContent = ")";
      inline.appendChild(temp);
    }
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

  export function CreateBlock(tagName: string): HTMLElement | undefined {
    const tagInfo = htmlTag.GetTagInfo(tagName);
    if (!tagInfo) {
      return;
    }

    const ret = document.createElement(tagName);
    if (ret instanceof HTMLUListElement || ret instanceof HTMLOListElement) {
      const li = document.createElement("li");
      ret.appendChild(li);
    } else if (ret instanceof HTMLDListElement) {
      let temp = document.createElement("dt");
      ret.appendChild(temp);
      temp = document.createElement("dd");
      ret.appendChild(temp);
    }

    return ret;
  }
}
