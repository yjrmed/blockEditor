import { Observable, fromEvent, switchMap } from "rxjs";
import { htmlTag, IDomItem, IOrderdSelection } from "./htmlDoms";

export namespace sele {
  export interface ISelectionObj {
    block: IDomItem;
    Inline: IDomItem | null;
    selection: Selection;
  }

  export class Selector {
    constructor() {
      this.selection = document.getSelection() as Selection;
      try {
        if (this.selection == null) {
          throw new Error("cant get document selection.");
        }
      } catch (e) {
        console.error(e);
      }
    }

    private selection: Selection;
    private layer: HTMLElement | null = null;
    public get Layer(): HTMLElement | null {
      return this.layer;
    }

    public $SelectChange: Observable<ISelectionObj | null> | undefined;

    public Initialization(_layer: HTMLElement) {
      this.layer = _layer;
      this.$SelectChange = fromEvent(document, "selectionchange").pipe(
        switchMap(async (event) => {
          const rslt = this.parseSelection();
          if (rslt && rslt.block?.ele) {
            return {
              block: rslt.block,
              Inline: rslt.inline,
              selection: this.selection,
            } as ISelectionObj;
          }
          return null;
        })
      );
    }

    public SetElement(node: Node | null | undefined): void {
      this.Deselect();
      if (node && this.layer?.contains(node)) {
        setTimeout(() => {
          const range = document.createRange();
          range.collapse(false);
          if (node instanceof HTMLElement) {
            if (htmlTag.InlineNames.includes(node.tagName)) {
              range.selectNodeContents(node);
            } else {
              range.setStart(node, 0);
            }
          }
          this.selection?.addRange(range);
        }, 0);
      }
    }

    public ReSelect(): void {
      if (!this.selection) {
        return;
      }

      const _range = this.selection.getRangeAt(0);
      const save = {
        startContainer: _range.startContainer,
        startOffset: _range.startOffset,
        endContainer: _range.endContainer,
        endOffset: _range.endOffset,
      };

      this.Deselect();

      const range = document.createRange();
      range.setStart(save.startContainer, save.startOffset);
      range.setEnd(save.endContainer, save.endOffset);

      this.selection.addRange(range);
    }

    public Deselect(): void {
      this.selection?.removeAllRanges();
    }

    private parseSelection(): {
      block: IDomItem | null;
      inline: IDomItem | null;
    } {
      // console.log(`anchorNode: ${this.selection.anchorNode}`);
      // console.log(`anchorOffset: ${this.selection.anchorOffset}`);
      // console.log(`focusNode: ${this.selection.focusNode}`);
      // console.log(`focusOffset: ${this.selection.focusOffset}`);
      // console.log(`isCollapsed: ${this.selection.isCollapsed}`);

      const readyResult = (
        node?: Node | undefined
      ): {
        block: IDomItem | null;
        inline: IDomItem | null;
      } => {
        const _ret: {
          block: IDomItem | null;
          inline: IDomItem | null;
        } = { block: null, inline: null };

        if (!node) {
          return _ret;
        }

        const ele = node instanceof HTMLElement ? node : node.parentElement;
        if (ele) {
          if (htmlTag.InlineNames.includes(ele.tagName)) {
            _ret.inline = {
              ele: ele,
              tagInfo: htmlTag.GetTagInfo(ele),
            } as IDomItem;
          }
          let _ele: HTMLElement | null = ele;
          while (_ele && !htmlTag.BlockNames.includes(_ele.tagName)) {
            _ele = _ele.parentElement;
          }
          if (_ele) {
            _ret.block = {
              ele: _ele,
              tagInfo: htmlTag.GetTagInfo(_ele),
            } as IDomItem;
          }
          return _ret;
        }
        return _ret;
      };

      if (
        this.layer &&
        this.selection.anchorNode &&
        this.layer.contains(this.selection.anchorNode) &&
        this.selection.focusNode &&
        this.layer.contains(this.selection.focusNode)
      ) {
        const an = this.selection.anchorNode;
        const fn = this.selection.focusNode;

        if (this.selection.isCollapsed || an === fn) {
          return readyResult(an);
        } else {
          const getParents = (_node: Node): HTMLElement[] => {
            let parent: HTMLElement | null | undefined =
              _node instanceof HTMLElement ? _node : _node.parentElement;
            const parents: HTMLElement[] = [];
            while (parent && parent !== this.layer) {
              parents.push(parent);
              parent = parent.parentElement;
            }
            return parents;
          };
          const sfps = new Set(getParents(fn));
          const common = getParents(an).find((ele) => {
            return sfps.has(ele);
          });
          if (common) {
            return readyResult(common);
          }
        }
      }

      return readyResult();
    }

    public static GetCappedInlineTags(sele: Selection): HTMLElement[] {
      if (sele.anchorNode && sele.focusNode) {
        // anchor から上の要素に行きfocus を含んでいて inline ならば返す。

        const getInline = (_ele: Node): HTMLElement[] => {
          let ele: HTMLElement | null | undefined =
            _ele instanceof HTMLElement ? _ele : _ele.parentElement;
          const caps: HTMLElement[] = [];
          while (ele && htmlTag.InlineNames.includes(ele.tagName)) {
            caps.push(ele);
            ele = ele?.parentElement;
          }
          return caps;
        };
        const set1: Set<HTMLElement> = new Set(getInline(sele.anchorNode));
        const set2: Set<HTMLElement> = new Set(getInline(sele.focusNode));
        return Array.from(set1).filter((element) => set2.has(element));
      }
      return [];
    }

    public static GetSelectionOrder(
      sele: Selection
    ): IOrderdSelection | undefined {
      if (sele.anchorNode && sele.focusNode) {
        const anchor = sele.anchorNode;
        const focus = sele.focusNode;
        const position = anchor.compareDocumentPosition(focus);

        const ret = {
          isCollapsed: sele.isCollapsed,
          startNode: anchor,
          startOffset: sele.anchorOffset,
          endNode: focus,
          endOffset: sele.focusOffset,
        } as IOrderdSelection;

        if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
          // type range
          return ret;
        } else if (position & Node.DOCUMENT_POSITION_PRECEDING) {
          // type range (reverse)
          ret.startNode = focus;
          ret.startOffset = sele.focusOffset;
          ret.endNode = anchor;
          ret.endOffset = sele.anchorOffset;
          return ret;
        } else {
          // same node
          if (sele.isCollapsed) {
            // caret type
            return ret;
          } else {
            // type range
            if (anchor instanceof HTMLElement) {
              const txtNodes = Array.from(anchor.childNodes).filter((node) => {
                return node.nodeType === Node.TEXT_NODE;
              });
              if (txtNodes) {
                ret.startNode = txtNodes[0];
                ret.startOffset = 0;
                const _end = txtNodes[txtNodes.length - 1];
                ret.endNode = _end;
                ret.endOffset = _end.textContent ? _end.textContent.length : 0;
                return ret;
              }
              return ret;
            } else {
              if (sele.anchorOffset > sele.focusOffset) {
                ret.startOffset = sele.focusOffset;
                ret.endOffset = sele.anchorOffset;
              }
              return ret;
            }
          }
        }
      }
    }

    public static GetCaretParentElement(
      sele: Selection
    ): HTMLElement | undefined {
      // caretの場合の親などを返す
      // isCollapsed　or not で条件分岐

      return;
    }
  }
}
