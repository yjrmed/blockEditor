import { domFuncs, htmlTag, IOrderdSelection } from "./htmlDoms";

export namespace cmdFunc {
  export function RangeCapTagCommand(
    tagName: string,
    oSele: IOrderdSelection,
    ancestor: Node
  ) {
    if (oSele.isCollapsed) {
      return;
    }

    const df = document.createDocumentFragment();
    while (ancestor.firstChild) {
      df.append(ancestor.firstChild);
    }
    const __df = domFuncs.SplitHtmlElement(
      df,
      oSele.endNode as unknown as Text,
      oSele.endOffset
    );
    const _df = domFuncs.SplitHtmlElement(
      df,
      oSele.startNode as unknown as Text,
      oSele.startOffset
    );
    const tag = document.createElement(tagName);
    tag.append(_df);
    df.append(tag);
    df.append(__df);
    domFuncs.OptimizeInline(df);
    ancestor.appendChild(df);
  }

  export function RemoveRangeCapTagCommand(
    tagName: string,
    oSele: IOrderdSelection,
    ancestor: Node
  ) {
    if (oSele.isCollapsed) {
      return;
    }

    let tar = ancestor as HTMLElement | null;
    while (tar && tar.tagName !== tagName) {
      tar = tar.parentElement;
    }

    if (!tar) {
      throw new Error(`not found common ${tagName} element`);
    }

    const originalParent = tar.parentElement;
    const nextSibling = tar.nextSibling;
    const df = document.createDocumentFragment();
    df.append(tar);
    const __df = domFuncs.SplitHtmlElement(
      df,
      oSele.endNode as unknown as Text,
      oSele.endOffset
    );
    const _df = domFuncs.SplitHtmlElement(
      df,
      oSele.startNode as unknown as Text,
      oSele.startOffset
    );
    domFuncs.StripTag(_df.firstChild as HTMLElement);
    df.append(_df);
    df.append(__df);
    domFuncs.OptimizeInline(df);
    originalParent?.insertBefore(df, nextSibling);
    return;
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
