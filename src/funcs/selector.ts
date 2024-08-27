import { Observable, fromEvent, switchMap } from "rxjs";
import { htmlTag } from "./htmlDoms";

export namespace sele {
  export interface ISelectItem {
    ele: HTMLElement;
    tagInfo: htmlTag.IHtmlTag;
  }

  export interface ISelectionOrder {
    isCollapsed: boolean;
    startNode: Node;
    startOffset: number;
    endNode: Node;
    endOffset: number;
  }

  export interface ISelectBlockFunc {
    getCappedLineTags: () => HTMLElement[];
    getSelectionOrder: () => ISelectionOrder | undefined;
  }

  export interface ISelectionObj {
    block: ISelectItem;
    Inline: ISelectItem | null;
    selection: Selection;
    helper: ISelectBlockFunc;
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

          // パースした際に BR など編集不可の要素は選択させない。




          if (rslt && rslt.block?.ele) {
            return {
              block: rslt.block,
              Inline: rslt.inline,
              helper: this.getHelpers(rslt.block.ele),
              selection: this.selection,
            } as ISelectionObj;
          }
          return null;
        })
      );
    }

    public SetElement(ele: HTMLElement | null | undefined): void {
      this.Deselect();
      if (ele && this.layer?.contains(ele)) {
        setTimeout(() => {
          const range = document.createRange();
          range.collapse(false);
          if (ele instanceof HTMLElement) {
            if (htmlTag.InlineNames.includes(ele.tagName)) {
              range.selectNodeContents(ele);
            } else {
              range.setStart(ele, 0);
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
      block: ISelectItem | null;
      inline: ISelectItem | null;
    } {
      // console.log(`anchorNode: ${this.selection.anchorNode}`);
      // console.log(`anchorOffset: ${this.selection.anchorOffset}`);
      // console.log(`focusNode: ${this.selection.focusNode}`);
      // console.log(`focusOffset: ${this.selection.focusOffset}`);
      // console.log(`isCollapsed: ${this.selection.isCollapsed}`);
      if (
        this.layer &&
        this.selection.anchorNode &&
        this.layer.contains(this.selection.anchorNode) &&
        this.selection.focusNode &&
        this.layer.contains(this.selection.focusNode)
      ) {
        const ret: {
          block: ISelectItem | null;
          inline: ISelectItem | null;
        } = { block: null, inline: null };

        const setResultFromNode = (node: Node): void => {
          let _ele = node instanceof HTMLElement ? node : node.parentElement;

          if (_ele) {
            if (htmlTag.InlineNames.includes(_ele.tagName)) {
              ret.inline = {
                ele: _ele,
                tagInfo: htmlTag.GetTagInfo(_ele),
              } as ISelectItem;
            }

            while (_ele && !htmlTag.BlockNames.includes(_ele.tagName)) {
              _ele = _ele.parentElement;
            }

            if (_ele) {
              ret.block = {
                ele: _ele,
                tagInfo: htmlTag.GetTagInfo(_ele),
              } as ISelectItem;
            }
          }
        };

        const _anchorNode = this.selection.anchorNode;
        if (_anchorNode) {
          if (this.selection.isCollapsed && this.selection.anchorNode) {
            setResultFromNode(this.selection.anchorNode);
            return ret;
          } else {
            if (_anchorNode === this.selection.focusNode) {
              setResultFromNode(_anchorNode);
            } else {
              const layer = this.layer;
              const getParents = (_node: Node): HTMLElement[] => {
                let parent: HTMLElement | null | undefined =
                  _node instanceof HTMLElement ? _node : _node.parentElement;
                const parents: HTMLElement[] = [];
                while (parent && parent !== layer) {
                  parents.push(parent);
                  parent = parent.parentElement;
                }
                return parents;
              };
              const sfps = new Set(getParents(this.selection.focusNode));
              const common = getParents(_anchorNode).find((ele) => {
                return sfps.has(ele);
              });
              if (common) {
                setResultFromNode(common);
              }
            }
            return ret;
          }
        }
      }

      return { block: null, inline: null };
    }

    private getHelpers(block: HTMLElement): ISelectBlockFunc {
      return {
        getCappedLineTags: (): HTMLElement[] => {
          if (this.selection.anchorNode && this.selection.focusNode) {
            const getInline = (_ele: Node): HTMLElement[] => {
              let ele: HTMLElement | null | undefined =
                _ele instanceof HTMLElement ? _ele : _ele.parentElement;
              const caps: HTMLElement[] = [];
              do {
                if (ele && htmlTag.InlineNames.includes(ele.tagName)) {
                  caps.push(ele);
                }
                ele = ele?.parentElement;
              } while (ele && ele !== block);
              return caps;
            };
            const set1: Set<HTMLElement> = new Set(
              getInline(this.selection.anchorNode)
            );
            const set2: Set<HTMLElement> = new Set(
              getInline(this.selection.focusNode)
            );
            return Array.from(set1).filter((element) => set2.has(element));
          }
          return [];
        },

        getSelectionOrder: (): ISelectionOrder | undefined => {
          if (this.selection.anchorNode && this.selection.focusNode) {
            const anchor = this.selection.anchorNode;
            const focus = this.selection.focusNode;
            const position = anchor.compareDocumentPosition(focus);

            const ret = {
              isCollapsed: this.selection.isCollapsed,
              startNode: anchor,
              startOffset: this.selection.anchorOffset,
              endNode: focus,
              endOffset: this.selection.focusOffset,
            } as ISelectionOrder;

            if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
              // type range
              return ret;
            } else if (position & Node.DOCUMENT_POSITION_PRECEDING) {
              // type range (reverse)
              ret.startNode = focus;
              ret.startOffset = this.selection.focusOffset;
              ret.endNode = anchor;
              ret.endOffset = this.selection.anchorOffset;
              return ret;
            } else {
              // same node
              if (this.selection.isCollapsed) {
                // caret type
                return ret;
              } else {
                // type range
                if (anchor instanceof HTMLElement) {
                  const txtNodes = Array.from(anchor.childNodes).filter(
                    (node) => {
                      return node.nodeType === Node.TEXT_NODE;
                    }
                  );
                  if (txtNodes) {
                    ret.startNode = txtNodes[0];
                    ret.startOffset = 0;
                    const _end = txtNodes[txtNodes.length - 1];
                    ret.endNode = _end;
                    ret.endOffset = _end.textContent
                      ? _end.textContent.length
                      : 0;
                    return ret;
                  }
                  return ret;
                } else {
                  if (
                    this.selection.anchorOffset > this.selection.focusOffset
                  ) {
                    ret.startOffset = this.selection.focusOffset;
                    ret.endOffset = this.selection.anchorOffset;
                  }
                  return ret;
                }
              }
            }
          }
        },
      };
    }
  }
}
