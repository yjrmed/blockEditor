export interface IDomItem {
  ele: HTMLElement;
  tagInfo: htmlTag.IHtmlTag;
}

export namespace htmlTag {
  export const enum TagType {
    inline = "inline",
    block = "block",
    etc = "etc",
  }

  export interface IHtmlTag {
    name: string;
    type: TagType;
    noText?: boolean;
    selfClose?: boolean;
    parentType?: string[];
    applendables?: string[];
    description?: string;
  }

  const HtmlTags: IHtmlTag[] = [
    {
      name: "A",
      type: TagType.inline,
    },
    {
      name: "ADDR",
      type: TagType.inline,
    },
    {
      name: "ADDRESS",
      type: TagType.block,
    },
    {
      name: "AREA",
      type: TagType.block,
      parentType: ["map"],
    },
    {
      name: "ARTICLE",
      type: TagType.block,
    },
    {
      name: "ASIDE",
      type: TagType.block,
    },
    {
      name: "B",
      type: TagType.inline,
    },
    {
      name: "BDO",
      type: TagType.inline,
    },
    {
      name: "BLOCKQUOTE",
      type: TagType.block,
    },
    {
      name: "BR",
      type: TagType.etc,
      noText: true,
      selfClose: true,
    },
    {
      name: "BUTTON",
      type: TagType.inline,
    },
    {
      name: "CANVAS",
      type: TagType.block,
      noText: false,
    },
    {
      name: "CITE",
      type: TagType.inline,
    },
    {
      name: "CODE",
      type: TagType.inline,
    },
    {
      name: "DD",
      type: TagType.block,
      parentType: ["DL"],
    },
    {
      name: "DFN",
      type: TagType.inline,
    },
    {
      name: "DIV",
      type: TagType.block,
    },
    {
      name: "DL",
      type: TagType.block,
    },
    {
      name: "DT",
      type: TagType.block,
      parentType: ["DL"],
    },
    {
      name: "EM",
      type: TagType.inline,
    },
    {
      name: "FIELDSET",
      type: TagType.block,
    },

    {
      name: "FIGCAPTION",
      type: TagType.block,
      parentType: ["FIGURE"],
    },
    {
      name: "FIGURE",
      type: TagType.block,
      noText: true,
    },
    {
      name: "FOOTER",
      type: TagType.block,
    },
    {
      name: "FORM",
      type: TagType.block,
    },
    {
      name: "H1",
      type: TagType.block,
    },
    {
      name: "H2",
      type: TagType.block,
    },
    {
      name: "H3",
      type: TagType.block,
    },
    {
      name: "H4",
      type: TagType.block,
    },
    {
      name: "H5",
      type: TagType.block,
    },
    {
      name: "H6",
      type: TagType.block,
    },
    {
      name: "HEADER",
      type: TagType.block,
    },
    {
      name: "HR",
      type: TagType.block,
    },
    {
      name: "I",
      type: TagType.inline,
    },
    {
      name: "IFRAME",
      type: TagType.inline,
      selfClose: true,
      noText: true,
    },
    {
      name: "IMG",
      type: TagType.inline,
      selfClose: true,
      noText: true,
    },
    {
      name: "INPUT",
      type: TagType.inline,
      selfClose: true,
      noText: true,
    },

    {
      name: "KBD",
      type: TagType.inline,
    },
    {
      name: "LABEL",
      type: TagType.inline,
    },
    {
      name: "LI",
      type: TagType.block,
      parentType: ["OL", "UL"],
    },

    {
      name: "MAP",
      type: TagType.inline,
    },
    {
      name: "MAIN",
      type: TagType.block,
    },
    {
      name: "NAV",
      type: TagType.block,
    },
    {
      name: "NOSCRIPT",
      type: TagType.block,
    },

    {
      name: "OBJECT",
      type: TagType.inline,
      noText: true,
      selfClose: true,
    },
    {
      name: "OL",
      type: TagType.block,
      applendables: ["LI"],
    },
    {
      name: "OPTION",
      type: TagType.etc,
      parentType: ["SELECT"],
    },
    {
      name: "OUTPUT",
      type: TagType.inline,
    },
    {
      name: "P",
      type: TagType.block,
      applendables: [],
    },
    {
      name: "PRE",
      type: TagType.block,
    },
    {
      name: "Q",
      type: TagType.inline,
    },
    {
      name: "RP",
      type: TagType.etc,
    },
    {
      name: "RT",
      type: TagType.etc,
    },
    {
      name: "RUBY",
      type: TagType.inline,
      applendables: ["RP", "RT"],
    },
    {
      name: "S",
      type: TagType.inline,
      description: "strikethrough",
    },
    {
      name: "SAMP",
      type: TagType.inline,
    },
    {
      name: "SCRIPT",
      type: TagType.inline,
    },
    {
      name: "SECTION",
      type: TagType.block,
    },
    {
      name: "SELECT",
      type: TagType.inline,
      noText: true,
      applendables: ["OPTION"],
    },
    {
      name: "SMALL",
      type: TagType.inline,
    },
    {
      name: "SPAN",
      type: TagType.inline,
    },
    {
      name: "STRONG",
      type: TagType.inline,
    },
    {
      name: "SUB",
      type: TagType.inline,
    },
    {
      name: "SUP",
      type: TagType.inline,
    },
    {
      name: "TABLE",
      type: TagType.block,
      noText: true,
      applendables: ["THEAD", "TBODY", "TFOOTER", "CAPTION"],
    },
    {
      name: "TBODY",
      type: TagType.block,
      noText: true,
      parentType: ["TABLE"],
      applendables: ["TR"],
    },
    {
      name: "TD",
      type: TagType.inline,
      parentType: ["TR"],
    },
    {
      name: "TEXTAREA",
      type: TagType.inline,
    },
    {
      name: "TFOOTER",
      type: TagType.block,
      noText: true,
      parentType: ["TABLE"],
      applendables: ["TR"],
    },
    {
      name: "TH",
      type: TagType.inline,
      parentType: ["TR"],
    },
    {
      name: "THEAD",
      type: TagType.block,
      noText: true,
      parentType: ["TABLE"],
      applendables: ["TR"],
    },
    {
      name: "TIME",
      type: TagType.inline,
    },
    {
      name: "TR",
      type: TagType.block,
      noText: true,
      parentType: ["THEAD", "TBODY", "TFOOTER"],
      applendables: ["TH", "TD"],
    },
    {
      name: "TT",
      type: TagType.inline,
    },
    {
      name: "U",
      type: TagType.inline,
      description: "underline",
    },
    {
      name: "UL",
      type: TagType.block,
      noText: true,
      applendables: ["LI"],
    },

    {
      name: "VAR",
      type: TagType.inline,
      noText: false,
    },
    {
      name: "VIDEO",
      type: TagType.block,
      noText: true,
      selfClose: true,
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
        return !tag.noText;
      });
    } else {
      ret = ret.filter((tag) => {
        return tag.noText;
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

  export function IsInsertableElement(node: Node): boolean {
    if (node instanceof HTMLElement) {
      const ti = GetTagInfo(node);
      if (ti) {
        if (ti.selfClose) {
          return true;
        } else if (ti.noText) {
          return true;
        }
      }
    }
    return false;
  }
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
