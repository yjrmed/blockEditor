import { Subject } from "rxjs";
import { sele } from "./selector";
import { saver } from "./saver";
import { htmlTag } from "./htmlDoms";
import { contentEdit } from "./contentEdit";
import { utilis } from "./utlis";

export namespace controller {
  export interface GetFilter {
    block: boolean;
    inline: boolean;
    tagNames?: string[];
    contains?: HTMLElement;
  }

  export class EditController {
    public Initialization(layer: HTMLElement) {
      this.selector.Initialization(layer);
      this.selector.$SelectChange?.subscribe((res) => {
        if (res) {
          this.SeleObj = res;
        }
      });
      this.saver.Initialization(layer);
      this.treeWalker = document.createTreeWalker(
        layer,
        NodeFilter.SHOW_ELEMENT
      );
    }

    public get IsSelecting(): boolean {
      return Boolean(this._seleObj?.block);
    }

    public get IsEditting(): boolean {
      return this.editor.IsEditting;
    }

    private editor: contentEdit.Editor = new contentEdit.Editor();

    private saver: saver.Saver = new saver.Saver();

    private selector: sele.Selector = new sele.Selector();

    private treeWalker = document.createTreeWalker(document.body);

    public get $ObserverSubject(): Subject<MutationRecord[]> {
      return this.saver.$ObserverSubject;
    }

    get Layer(): HTMLElement | null {
      return this.selector.Layer;
    }

    public $SelectionChange: Subject<sele.ISelectionObj | null> = new Subject();
    private _seleObj: sele.ISelectionObj | null = null;

    set SeleObj(val: sele.ISelectionObj | null) {
      if (val?.block.ele && !this.editor.Target?.contains(val.block.ele)) {
        this.editor.Target = val.block.ele;
      }
      this._seleObj = val;
      this.$SelectionChange.next(this._seleObj);
    }

    get Block(): sele.ISelectItem | null {
      return this._seleObj ? this._seleObj.block : null;
    }

    get Inline(): sele.ISelectItem | null {
      return this._seleObj?.Inline ? this._seleObj.Inline : null;
    }

    public SetSelect = (
      tar: HTMLElement | null | undefined,
      scroll = true,
      edit = false
    ): void => {
      this.selector.SetElement(tar);
      if (tar && (scroll || edit)) {
        const onSent = this.$SelectionChange.subscribe((res) => {
          if (scroll && this.Block) {
            utilis.SetViewNode(this.Block.ele, "smooth");
            onSent.unsubscribe();
          }
          if (edit) {
            this.editor.Open();
          }
        });
      } else {
        this.SeleObj = null;
        this.editor.Close();
      }
    };

    ReSelect(): void {
      this.selector.ReSelect();
    }

    GetNeighborEle(forward: boolean, filter?: GetFilter): HTMLElement | null {
      const isTarget = (ele: HTMLElement): boolean => {
        const tn = ele.tagName;
        if (filter) {
          if (filter.tagNames && !filter.tagNames.includes(tn)) {
            return false;
          }
          if (filter.block && htmlTag.BlockNames.includes(tn)) {
            return true;
          }
          if (filter.inline && htmlTag.InlineNames.includes(tn)) {
            return true;
          }
          return false;
        } else {
          return true;
        }
      };

      if (filter?.inline && this._seleObj?.Inline?.ele) {
        this.treeWalker.currentNode = this._seleObj.Inline?.ele;
      } else if (this._seleObj?.block.ele) {
        this.treeWalker.currentNode = this._seleObj.block.ele;
      } else {
        return null;
      }

      if (forward) {
        while (this.treeWalker.nextNode()) {
          const node = this.treeWalker.currentNode;
          if (node instanceof HTMLElement && isTarget(node)) {
            return node;
          }
        }
      } else {
        while (this.treeWalker.previousNode()) {
          const node = this.treeWalker.currentNode;
          if (node instanceof HTMLElement && isTarget(node)) {
            return node;
          }
        }
      }
      return null;
    }

    public GetCommandList(): {
      back: saver.CommandRecord[];
      forward: saver.CommandRecord[];
    } {
      return this.saver.CommnadList;
    }

    public ExecCommand(func: Function, description?: string): boolean {
      return this.saver.Command(func, description);
    }

    public ExecMuteCommand(func: Function): MutationRecord[] | undefined {
      return this.saver.MuteCommand(func);
    }

    public History(step: number): void {
      let node: Node | null = null;
      if (step > 0) {
        while (step-- > 0) {
          node = this.saver.Forward();
        }
      } else if (step < 0) {
        while (step++ < 0) {
          node = this.saver.Back();
        }
      }
      if (node) {
        utilis.SetViewNode(node);
      }
    }
  }

  export interface IPostItem {
    title: string;
    description?: string;
    article: HTMLElement;
  }

  export class FileController {
    private _post: IPostItem | null = null;

    get Post(): IPostItem | null {
      return this._post;
    }

    public async ImportDoc(
      _path: string,
      callback: (arg: IPostItem | null) => void
    ) {
      const path = new URL(_path);
      fetch(path.href)
        .then((response) => response.text())
        .then((html) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const article = doc.querySelector(
            path.hash ? `#${path.hash}` : "article"
          );
          this._post =
            article instanceof HTMLElement
              ? { title: doc.title, article: article }
              : null;
          callback(this._post);
        });
    }

    public ImportStyle = (path: string, ele?: HTMLElement) => {
      if (!ele) {
        ele = document.head;
      }
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.type = "text/css";
      link.dataset.wcms = `editor_css_${utilis.GenRandomString()}`;
      link.href = path;
      ele.appendChild(link);

      // if (link.sheet) {
      //   // cors の関係で cssRules にはアクセスできない。
      // 　サーバー側に要求する際 scope を送って編集して送ってもらう。
      //   // サーバー側で変更するしかない。
      //   const scopedRules = Array.from(link.sheet.cssRules)
      //     .map((rule) => {
      //       return `@scope (article) { ${rule.cssText} }`;
      //     })
      //     .join(" ");

      //   const styleElement = document.createElement("style");
      //   styleElement.textContent = scopedRules;
      // }
    };

    public GetCurrentStyles(): { href: string; disabled: boolean }[] {
      return Array.from(
        document.head.querySelectorAll('link[rel="stylesheet"][data-wcms]')
      ).map((link) => {
        const _link = link as HTMLLinkElement;
        return { href: _link.href, disabled: _link.disabled };
      });
    }

    public ExportHtml(layer: HTMLElement) {
      setTimeout(() => {
        const blob = new Blob([layer.outerHTML], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "layer.html";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
    }
  }
}
