export namespace htmlTag {
  export const enum TagType {
    inline = "inline",
    block = "block",
    etc = "etc",
  }

  export interface IHtmlTag {
    name: string;
    type: TagType;
    selfClose: boolean;
    parentType?: string[];
    applendables?: string[];
    NotEditable?: boolean;
    description?: string;
  }

  //TODO: NotEditable で video を編集不可に

  const HtmlTags: IHtmlTag[] = [
    {
      name: "A",
      type: TagType.inline,
      selfClose: false,
    },
    {
      name: "ADDR",
      type: TagType.inline,
      selfClose: false,
    },
    {
      name: "ADDRESS",
      type: TagType.block,
      selfClose: false,
    },
    {
      name: "AREA",
      type: TagType.block,
      parentType: ["map"],
      selfClose: true,
    },
    {
      name: "ARTICLE",
      type: TagType.block,
      selfClose: false,
    },
    {
      name: "ASIDE",
      type: TagType.block,
      selfClose: false,
    },
    {
      name: "B",
      type: TagType.inline,
      selfClose: false,
    },
    {
      name: "BDO",
      type: TagType.inline,
      selfClose: false,
    },
    {
      name: "BLOCKQUOTE",
      type: TagType.block,
      selfClose: false,
    },
    {
      name: "BR",
      type: TagType.etc,
      selfClose: true,
    },
    {
      name: "BUTTON",
      type: TagType.inline,
      selfClose: false,
    },
    {
      name: "CANVAS",
      type: TagType.block,
      selfClose: false,
    },
    {
      name: "CITE",
      type: TagType.inline,
      selfClose: false,
    },
    {
      name: "CODE",
      type: TagType.inline,
      selfClose: false,
    },
    {
      name: "DD",
      type: TagType.block,
      parentType: ["DL"],
      selfClose: false,
    },
    {
      name: "DFN",
      type: TagType.inline,
      selfClose: false,
    },
    {
      name: "DIV",
      type: TagType.block,
      selfClose: false,
    },
    {
      name: "DL",
      type: TagType.block,
      selfClose: false,
    },
    {
      name: "DT",
      type: TagType.block,
      parentType: ["DL"],
      selfClose: false,
    },
    {
      name: "EM",
      type: TagType.inline,
      selfClose: false,
    },
    {
      name: "FIELDSET",
      type: TagType.block,
      selfClose: false,
    },

    {
      name: "FIGCAPTION",
      type: TagType.block,
      parentType: ["FIGURE"],
      selfClose: true,
    },
    {
      name: "FIGURE",
      type: TagType.block,
      selfClose: false,
    },
    {
      name: "FOOTER",
      type: TagType.block,
      selfClose: false,
    },
    {
      name: "FORM",
      type: TagType.block,
      selfClose: false,
    },
    {
      name: "I",
      type: TagType.inline,
      selfClose: false,
    },
    {
      name: "IMG",
      type: TagType.inline,
      selfClose: true,
    },
    {
      name: "INPUT",
      type: TagType.inline,
      selfClose: true,
    },
    {
      name: "KBD",
      type: TagType.inline,
      selfClose: false,
    },
    {
      name: "LABEL",
      type: TagType.inline,
      selfClose: false,
    },
    {
      name: "MAP",
      type: TagType.inline,
      selfClose: false,
    },
    {
      name: "OBJECT",
      type: TagType.inline,
      selfClose: false,
    },
    {
      name: "OUTPUT",
      type: TagType.inline,
      selfClose: false,
    },
    {
      name: "Q",
      type: TagType.inline,
      selfClose: false,
    },
    {
      name: "RP",
      type: TagType.inline,
      selfClose: false,
    },
    {
      name: "RT",
      type: TagType.inline,
      selfClose: false,
    },
    {
      name: "SAMP",
      type: TagType.inline,
      selfClose: false,
    },
    {
      name: "SCRIPT",
      type: TagType.inline,
      selfClose: false,
    },
    {
      name: "SELECT",
      type: TagType.inline,
      selfClose: false,
    },
    {
      name: "SMALL",
      type: TagType.inline,
      selfClose: false,
    },
    {
      name: "SPAN",
      type: TagType.inline,
      selfClose: false,
    },
    {
      name: "STRONG",
      type: TagType.inline,
      selfClose: false,
    },
    {
      name: "SUB",
      type: TagType.inline,
      selfClose: false,
    },
    {
      name: "SUP",
      type: TagType.inline,
      selfClose: false,
    },
    {
      name: "TEXTAREA",
      type: TagType.inline,
      selfClose: false,
    },
    {
      name: "TIME",
      type: TagType.inline,
      selfClose: false,
    },
    {
      name: "TT",
      type: TagType.inline,
      selfClose: false,
    },

    {
      name: "H1",
      type: TagType.block,
      selfClose: false,
    },
    {
      name: "H2",
      type: TagType.block,
      selfClose: false,
    },
    {
      name: "H3",
      type: TagType.block,
      selfClose: false,
    },
    {
      name: "H4",
      type: TagType.block,
      selfClose: false,
    },
    {
      name: "H5",
      type: TagType.block,
      selfClose: false,
    },
    {
      name: "H6",
      type: TagType.block,
      selfClose: false,
    },
    {
      name: "HEADER",
      type: TagType.block,
      selfClose: false,
    },
    {
      name: "HR",
      type: TagType.block,
      selfClose: true,
    },
    {
      name: "LI",
      type: TagType.block,
      parentType: ["OL", "UL"],
      selfClose: false,
    },
    {
      name: "MAIN",
      type: TagType.block,
      selfClose: false,
    },
    {
      name: "NAV",
      type: TagType.block,
      selfClose: false,
    },
    {
      name: "NOSCRIPT",
      type: TagType.block,
      selfClose: false,
    },
    {
      name: "OL",
      type: TagType.block,
      selfClose: false,
      applendables: ["LI"],
    },
    {
      name: "P",
      type: TagType.block,
      selfClose: false,
      applendables: [],
    },
    {
      name: "PRE",
      type: TagType.block,
      selfClose: false,
    },
    {
      name: "RUBY",
      type: TagType.inline,
      selfClose: false,
      applendables: ["RP", "RT"],
    },
    {
      name: "S",
      type: TagType.inline,
      selfClose: false,
      description: "strikethrough",
    },
    {
      name: "SECTION",
      type: TagType.block,
      selfClose: false,
    },
    {
      name: "TABLE",
      type: TagType.block,
      selfClose: false,
      applendables: ["THEAD", "TBODY", "TFOOTER", "CAPTION"],
    },
    {
      name: "THEAD",
      type: TagType.block,
      selfClose: false,
      parentType: ["TABLE"],
      applendables: ["TR"],
    },
    {
      name: "TBODY",
      type: TagType.block,
      selfClose: false,
      parentType: ["TABLE"],
      applendables: ["TR"],
    },
    {
      name: "TFOOTER",
      type: TagType.block,
      selfClose: false,
      parentType: ["TABLE"],
      applendables: ["TR"],
    },
    {
      name: "TR",
      type: TagType.block,
      selfClose: false,
      parentType: ["THEAD", "TBODY", "TFOOTER"],
      applendables: ["TH", "TD"],
    },
    {
      name: "TD",
      type: TagType.inline,
      selfClose: false,
      parentType: ["TR"],
    },
    {
      name: "TH",
      type: TagType.inline,
      selfClose: false,
      parentType: ["TR"],
    },
    {
      name: "U",
      type: TagType.inline,
      selfClose: false,
      description: "underline",
    },
    {
      name: "UL",
      type: TagType.block,
      selfClose: false,
      applendables: ["LI"],
    },
    {
      name: "VAR",
      type: TagType.inline,
      selfClose: false,
    },
    {
      name: "VIDEO",
      type: TagType.block,
      selfClose: false,
      applendables: [],
    },
    // {
    //   name: "SOURCE",
    //   type: TagType.etc,
    //   selfClose: true,
    // },
  ];

  export const BlockNames = HtmlTags.filter((tag) => {
    return tag.type === TagType.block;
  }).map((block) => {
    return block.name;
  });

  export const InlineNames = HtmlTags.filter((tag) => {
    return tag.type === TagType.inline;
  }).map((inline) => {
    return inline.name;
  });

  export function GetTagInfo(
    ele: HTMLElement | string | null
  ): IHtmlTag | null {
    if (ele) {
      const tn = ele instanceof HTMLElement ? ele.tagName : ele;
      const found = HtmlTags.find((tag) => {
        return tag.name === tn;
      });
      return found ? found : null;
    } else {
      return null;
    }
  }

  export function GetBlocks(freeAppend = false): IHtmlTag[] {
    let stackable = HtmlTags.filter((tag) => {
      return tag.type === TagType.block;
    });

    if (freeAppend) {
      stackable = HtmlTags.filter((tag) => {
        return tag.parentType === undefined;
      });
    }

    return stackable;
  }

  export function GetInlines(selfClose = true): IHtmlTag[] {
    let ret = HtmlTags.filter((tag) => {
      return tag.type === TagType.inline;
    });

    if (!selfClose) {
      ret = ret.filter((tag) => {
        return !tag.selfClose;
      });
    }

    return ret;
  }

  export function GetAppendablesBlock(tag: IHtmlTag): IHtmlTag[] {
    if (tag.applendables) {
      const ats = tag.applendables;
      return HtmlTags.filter((block) => {
        return ats.includes(block.name);
      });
    }

    return HtmlTags.filter((block) => {
      if (block.type === TagType.block) {
        if (block.parentType) {
          return block.parentType.includes(tag.name);
        } else {
          return true;
        }
      } else {
        return false;
      }
    });
  }

  export function SplitDom() {}

  export function OptimizeInlines() {}
}

export namespace domFuncs {
  export function StripTag(ele: HTMLElement) {
    const parent = ele.parentNode;
    if (parent) {
      Array.from(ele.childNodes).forEach((node) => {
        parent.insertBefore(node, ele);
      });
      parent.removeChild(ele);
    }
  }

  export function SafeCloenEle(
    ele: HTMLElement,
    withId: boolean = false
  ): HTMLElement {
    const clone = ele.cloneNode(true) as HTMLElement;
    clone.querySelectorAll(":scope [contentEditable]").forEach((_ele) => {
      _ele.removeAttribute("contentEditable");
    });
    if (!withId) {
      clone.querySelectorAll(":scope [id]").forEach((_ele) => {
        _ele.removeAttribute("id");
      });
    }
    return clone;
  }

  export function SplitElement(
    target: HTMLElement,
    node: Node,
    nodeOffset: number
  ): HTMLElement {
    let current = node;
    let _current = document.createTextNode("");
    current.parentElement?.insertBefore(_current, current);
    if (node.textContent) {
      const txt = node.textContent;
      _current.textContent = txt.slice(0, nodeOffset);
      current.textContent = txt.slice(nodeOffset);
    }

    let former: HTMLElement = target;

    while (target.contains(current.parentElement)) {
      const parent = current.parentElement as HTMLElement;
      if (!parent.parentElement) {
        break;
      }
      former = document.createElement(parent.tagName);
      parent.parentElement.insertBefore(former, parent);
      let ele = parent.firstChild;
      while (ele && ele !== current) {
        const _ele = ele?.nextSibling;
        former.appendChild(ele);
        ele = _ele;
      }
      current = parent;
    }
    return former;
  }

  export function GetNodesArray(node: Node): Node[] {
    const tw = document.createTreeWalker(node);
    let crnt: Node | null = tw.currentNode;
    const nodes: Node[] = [];
    while (crnt) {
      nodes.push(crnt);
      crnt = tw.nextNode();
    }
    return nodes;
  }

  export function GetCommonAncestorElements(
    node1: Node,
    node2: Node
  ): HTMLElement[] {
    const ancestors1: Set<HTMLElement> = new Set();
    let current: HTMLElement | null = node1.parentElement;
    while (current) {
      ancestors1.add(current);
      current = current.parentElement;
    }

    const ret: HTMLElement[] = [];
    current = node2.parentElement;
    while (current) {
      if (ancestors1.has(current)) {
        ret.push(current);
      }
      current = current.parentElement;
    }
    return ret;
  }

  export function OptimizeInlineTag(ele: HTMLElement) {
    const tw = document.createTreeWalker(ele, NodeFilter.SHOW_ELEMENT);
    // remove child inline tag if same with parent
    do {
      const ele = tw.currentNode;
      if (
        ele instanceof HTMLElement &&
        htmlTag.InlineNames.includes(ele.tagName)
      ) {
        if (!ele.attributes.length) {
          Array.from(ele.children).forEach((ln) => {
            if (
              ln instanceof HTMLElement &&
              ele.tagName === ln.tagName &&
              !ln.attributes.length
            ) {
              StripTag(ln);
            }
          });
        }
      }
    } while (tw.nextNode());

    tw.currentNode = ele;

    // Combine consecutive inline tags or text node
    do {
      Array.from(ele.childNodes).reduce((pre, node) => {
        if (
          pre instanceof HTMLElement &&
          node instanceof HTMLElement &&
          pre.tagName === node.tagName &&
          !node.attributes.length
        ) {
          // consecutive inline tags
          Array.from(node.childNodes).forEach((_node) => {
            pre.appendChild(_node);
          });
          node.remove();
          return pre;
        } else if (
          // consecutive text node
          pre.nodeType === Node.TEXT_NODE &&
          pre.textContent &&
          node.nodeType === Node.TEXT_NODE &&
          node.textContent
        ) {
          pre.textContent += node.textContent;
          node.remove();
          return pre;
        }
        return node;
      });
    } while (tw.nextNode());

    return ele;
  }
}
