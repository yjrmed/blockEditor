import { fromEvent, Subscription, map } from "rxjs";

export namespace contentEdit {
  export class Editor {
    constructor(private muteCommand: Function) {}

    private sbscReady: Subscription | null = null;
    private sbscKeys: Subscription | null = null;
    private endSpaceNode: Node = document.createTextNode("\u200B");

    private target: HTMLElement | null = null;
    get Target(): HTMLElement | null {
      return this.target;
    }

    set Target(val: HTMLElement | null) {
      if (val) {
        if (val !== this.target) {
          this.Close();
          this.target = val;
          if (this.target) {
            this.sbscReady?.unsubscribe();
            this.sbscReady = fromEvent(this.target, "pointerdown")
              .pipe(
                map((e) => {
                  e.preventDefault();
                  e.stopPropagation();
                })
              )
              .subscribe((res) => {
                this.Open();
              });
          }
        }
      } else {
        this.Close();
      }
    }

    get IsEditting(): boolean {
      return Boolean(this.target?.getAttribute("contenteditable") === "true");
    }

    public Open() {
      this.sbscReady?.unsubscribe();
      if (this.target) {
        this.sbscKeys?.unsubscribe();
        this.sbscKeys = new Subscription();
        this.sbscKeys.add(
          fromEvent(this.target, "keydown").subscribe((e) => {
            const ke = e as KeyboardEvent;

            if (!ke.ctrlKey) {
              if (ke.key === "Enter") {
                ke.preventDefault();
                ke.stopPropagation();
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0) {
                  const range = selection.getRangeAt(0);
                  range.deleteContents();
                  const br = document.createElement("br");
                  range.insertNode(br);

                  if (br.nextSibling === this.target?.lastChild) {
                    this.muteCommand(() => {
                      br.after(this.endSpaceNode);
                    });
                  }

                  const newRange = document.createRange();
                  newRange.setStartAfter(br);
                  newRange.setEndAfter(br);
                  selection.removeAllRanges();
                  selection.addRange(newRange);
                }
              }
            }
          })
        );
        this.sbscKeys.add(
          fromEvent(this.target, "keyup").subscribe((e) => {
            const ke = e as KeyboardEvent;
          })
        );

        const tar = this.target;
        this.muteCommand(() => {
          tar.setAttribute("contenteditable", "true");
        });

        this.target.focus();
      }
    }

    public Close() {
      this.sbscKeys?.unsubscribe();
      this.sbscReady?.unsubscribe();

      if (this.target) {
        const tar = this.target;
        this.muteCommand(() => {
          tar.removeAttribute("contenteditable");
          this.endSpaceNode.parentElement?.removeChild(this.endSpaceNode);
        });
        this.target = null;
      }
    }
  }
}
