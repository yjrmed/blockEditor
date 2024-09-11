import { controller } from "./controller";
import { domFuncs } from "./htmlDoms";

export namespace appEvents {
  export class AppEvent {
    constructor(private editor: controller.EditController) {
      window.removeEventListener("keydown", this.handleKeyDown);
      window.addEventListener("keydown", this.handleKeyDown);

      // window.removeEventListener("wheel", this.mouseWheel);
      // window.addEventListener("wheel", this.mouseWheel, { passive: false });
    }

    // private mouseWheel = (e: WheelEvent): void => {
    //   if (e.ctrlKey) {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     this.viewer.Event(e);
    //   }
    // };

    private handleKeyDown = (e: KeyboardEvent): void => {
      console.log(e);
      if (e.ctrlKey) {
        if (e.key === "ArrowUp") {
          e.stopPropagation();
          e.preventDefault();
          const tar = this.editor.GetNeighborEle(false, {
            block: true,
            inline: false,
          });
          if (tar) {
            this.editor.SetSelect(tar, true, this.editor.IsEditting);
          }
        } else if (e.key === "ArrowDown") {
          e.stopPropagation();
          e.preventDefault();
          const tar = this.editor.GetNeighborEle(true, {
            block: true,
            inline: false,
          });
          if (tar) {
            this.editor.SetSelect(tar, true, this.editor.IsEditting);
          }
        } else if (e.key === "ArrowLeft") {
          e.stopPropagation();
          e.preventDefault();
          const tar = this.editor.GetNeighborEle(false, {
            block: false,
            inline: true,
          });
          if (tar) {
            this.editor.SetSelect(tar, true, this.editor.IsEditting);
          }
        } else if (e.key === "ArrowRight") {
          e.stopPropagation();
          e.preventDefault();
          const tar = this.editor.GetNeighborEle(true, {
            block: false,
            inline: true,
          });
          if (tar) {
            this.editor.SetSelect(tar, true, this.editor.IsEditting);
          }
        } else if (e.key === "Enter") {
          if (this.editor.IsEditting && this.editor.Block) {
            e.preventDefault();
            e.stopPropagation();
            const clone = domFuncs.SafeCloenEle(this.editor.Block.ele);
            clone.textContent = "";
            this.editor.Block.ele.after(clone);
            this.editor.SetSelect(clone, true, true);
          } else {
            if (this.editor.Block) {
              e.preventDefault();
              e.stopPropagation();
              this.editor.SetSelect(this.editor.Block.ele, true, true);
            }
          }
        } else if (e.key === "z") {
          this.editor.SaverHistory(-1);
        } else if (e.key === "Z") {
          this.editor.SaverHistory(1);
        }
      } else {
        if (e.key === "Escape") {
          if (this.editor.IsSelecting) {
            e.preventDefault();
            e.stopPropagation();
            this.editor.SetSelect(null);
          }
        } else if (e.key === "Backspace") {
          if (this.editor.IsSelecting) {
            if (this.editor.Block && !this.editor.Block.ele.textContent) {
              e.stopPropagation();
              e.preventDefault();
              const tar = this.editor.GetNeighborEle(true, {
                block: true,
                inline: false,
              });

              // const deleteCmd = new cmd.DeleteElement(this.editor.Block.ele);
              // this.editor.ExecCmd(deleteCmd);
              if (tar?.parentElement) {
                // this.editor.$UpdateElement.next(tar?.parentElement);
              }
            }
          }
        }
      }
    };
  }
}
