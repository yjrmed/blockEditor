import { fromEvent, Subscription } from "rxjs";
import { saver } from "./saver";
import { sele } from "./selector";

export namespace contentEdit {
  export class Editor {
    constructor(private saver: saver.Saver) {}

    private sbscReady: Subscription | null = null;
    private sbscTargetEvents: Subscription | null = null;

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
            this.sbscReady = fromEvent(this.target, "pointerdown").subscribe(
              (res) => {
                this.Open();
              }
            );
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
        this.sbscTargetEvents?.unsubscribe();
        this.sbscTargetEvents = new Subscription();
        this.sbscTargetEvents.add(
          fromEvent(this.target, "keydown").subscribe((e) => {
            const ke = e as KeyboardEvent;
            if (!ke.ctrlKey && this.target) {
              console.log(ke.key);
              if (ke.key === "Enter") {
                ke.preventDefault();
                ke.stopPropagation();
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0) {
                  const range = selection.getRangeAt(0);
                  range.deleteContents();
                  let br = document.createElement("br");
                  range.insertNode(br);

                  if (this.target.lastElementChild === br) {
                    br = document.createElement("br");
                    range.insertNode(br);
                  }

                  const newRange = document.createRange();
                  newRange.setStartAfter(br);
                  newRange.setEndAfter(br);

                  selection.removeAllRanges();
                  selection.addRange(newRange);
                }
              } else if (ke.key === "Backspace") {
                if (this.target.textContent === "") {
                  ke.preventDefault();
                  ke.stopPropagation();
                  const prev = this.target.previousElementSibling;
                  const blank = this.target;
                  const selection = window.getSelection();
                  if (selection) {
                    if (prev) {
                      const range = document.createRange();
                      range.selectNodeContents(prev);
                      range.collapse(false);
                      selection.removeAllRanges();
                      selection.addRange(range);
                      this.Target = prev as HTMLElement;
                      this.Open();
                    } else {
                      selection.removeAllRanges();
                    }
                  }
                  blank.remove();
                }
              }
            }
          })
        );

        const tar = this.target;
        this.saver.Mute(() => {
          tar.setAttribute("contenteditable", "true");
        });

        this.target.focus();
      }
    }

    public Close() {
      this.sbscTargetEvents?.unsubscribe();
      this.sbscReady?.unsubscribe();
      if (this.target) {
        const tar = this.target;
        this.saver.Mute(() => {
          tar.removeAttribute("contenteditable");
        });
        this.target = null;
      }
    }
  }
}
