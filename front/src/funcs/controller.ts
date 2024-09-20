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
      this.treeWalker = document.createTreeWalker(
        layer,
        NodeFilter.SHOW_ELEMENT
      );
    }

    public SetArticle(article: HTMLElement) {
      if (this.Layer) {
        const layer = this.Layer;
        this.saver.Mute(() => {
          layer.innerHTML = "";
          layer.appendChild(article);
        });
        this.saver.Initialization(layer);
        // layer.classList.add("editRoot");
      }
    }

    public get IsSelecting(): boolean {
      return Boolean(this._seleObj?.block);
    }

    public get IsEditting(): boolean {
      return this.editor.IsEditting;
    }

    private saver: saver.Saver = new saver.Saver();

    private editor: contentEdit.Editor = new contentEdit.Editor(this.saver);

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
      // if (val?.block.ele && !this.editor.Target?.contains(val.block.ele)) {
      if (val?.block.ele && !val.block.tagInfo.selfClose) {
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
      tar: Node | null | undefined,
      scroll = true,
      edit = false
    ): void => {
      this.selector.SetElement(tar);
      if (tar) {
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

    RemoveSelect(inline?: boolean): boolean {
      let tar: HTMLElement | undefined | null = null;
      if (inline || this.Inline) {
        tar = this.Inline?.ele;
      } else if (this.Block) {
        tar = this.Block.ele;
      }
      if (tar) {
        const next = tar.nextElementSibling;
        tar.remove();
        if (next) {
          const editting = this.IsEditting;
          this.SetSelect(next, editting, editting);
        } else {
          this.SetSelect(null);
        }
      }
      return Boolean(tar);
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

    GetParentEle(ele: HTMLElement): Node | null {
      this.treeWalker.currentNode = ele;
      const parent = this.treeWalker.parentNode();
      if (parent === this.Layer) {
        return null;
      }
      return parent;
    }

    public GetCommandList(): {
      back: saver.CommandRecord[];
      forward: saver.CommandRecord[];
    } {
      return this.saver.CommnadList;
    }

    public IsFileDirty(): boolean {
      return this.saver.IsDirty;
    }

    public SaverCommand(func: Function, description?: string): boolean {
      return this.saver.Command(func, description);
    }

    public SaverSetCharge() {
      this.saver.SetCharge();
    }

    public SaverFlash(description?: string) {
      this.saver.Flash(description);
    }

    public SaverHistory(step: number): void {
      this.saver.Flash();

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

  export interface IPostOg {
    url: string | null;
    type: string | null;
    title: string | null;
    description: string | null;
    site_name: string | null;
    image: string | null;
  }

  export interface IPostHead {
    url: string | null;
    type: string | null;
    title: string | null;
    description: string | null;
    site_name: string | null;
    image: string | null;
    og: IPostOg;
  }

  export interface IPostItem {
    orgUrl: string;
    head: IPostHead;
    article: HTMLElement;
    styles: string[];
  }

  export class FileController {
    public $PostChange: Subject<IPostItem | null> = new Subject();

    private scopeID: string = "LayerArticle";
    get ScopeID(): string {
      return this.scopeID;
    }

    private post: IPostItem | null = null;
    get Post(): IPostItem | null {
      return this.post;
    }

    public async ImportDoc(_path: string, callback?: Function) {
      const url = new URL("http://localhost:5000/getPost/");
      const params = new URLSearchParams(url.search);
      params.set("target", _path);
      url.search = params.toString();
      fetch(url.toString())
        .then((res) => res.json())
        .then((json) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(json["body"], "text/html");
          const article = doc.querySelector("article");
          this.post =
            article instanceof HTMLElement
              ? {
                  orgUrl: _path,
                  head: json["head"],
                  article: article,
                  styles: json["styles"],
                }
              : null;

          this.$PostChange.next(this.post);
          callback?.();
        })
        .catch((e) => {
          console.error(e);
        });
    }

    public ImportStyle = (_path: string, callback?: Function) => {
      const url = new URL("http://localhost:5000/getStyle/");
      const params = new URLSearchParams(url.search);
      params.set("target", _path);
      params.set("scopeID", this.scopeID);
      url.search = params.toString();
      fetch(url.toString())
        .then((res) => res.json())
        .then((json) => {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.type = "text/css";
          link.dataset.org = _path;
          link.href = json["href"];
          document.head.appendChild(link);
          callback?.();
        })
        .catch((e) => {
          console.error(e);
        });
    };

    public UploadDoc = (callback?: Function) => {
      if (this.post) {
        const obj = {
          orgUrl: this.post.orgUrl,
          article: this.post.article.outerHTML,
        };
        const url = new URL("http://localhost:5000/upload/");
        fetch(url.toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
        })
          .then((res) => res.json())
          .then((json) => {})
          .finally(() => {
            callback?.();
          });
      }
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

  export class ViewController {
    // 可能であればしていく。
    // ariticle を absolute にして、スクロール、イベントで top, left を設定させる必要がある。
    // 基本的なスクロールは使用できなくなる。 scrollintoview が動くかも不明
    public Initialization(_layer: HTMLElement) {
      this.layer = _layer;
    }

    private layer: HTMLElement | null = null;
    private scale: number = 1.0;
    private point: { x: number; y: number } = { x: 0, y: 0 };

    public Event(e: WheelEvent) {
      console.log(e);
      const direction = e.deltaY / Math.abs(e.deltaY);
      this.Scale(this.scale + direction * 0.05);
    }

    public Scale = (num: number, pos?: { x: number; y: Number }) => {
      if (this.layer) {
        this.scale = num;
        // this.layer.style.transform = `scale(${this.scale})`;

        if (pos) {
        }
      }
    };

    public Init = () => {};
  }
}
