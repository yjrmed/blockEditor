import { fromEvent, Subscription, map } from "rxjs";

export namespace contentEdit {
  export class Editor {

    private sbscReady: Subscription | null = null;
    private sbscKeys: Subscription | null = null;

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

        this.target.setAttribute("contenteditable", "true");
        this.target.focus();
      }
    }

    public Close() {
      this.sbscKeys?.unsubscribe();
      this.sbscReady?.unsubscribe();

      if (this.target) {
        this.target.removeAttribute("contenteditable");
        this.target = null;
      }
    }
  }
}