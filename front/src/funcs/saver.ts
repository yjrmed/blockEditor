import { Subject } from "rxjs";
import { utilis } from "./utlis";

export namespace saver {
  export interface CommandRecord {
    id: string;
    timestamp?: number;
    description?: string;
    mrs: MutationRecord[];
  }

  export class Saver {
    public Initialization(_layer: HTMLElement) {
      this.observer.observe(_layer, {
        childList: true,
        attributes: true,
        attributeOldValue: true,
        subtree: true,
        characterData: true,
        characterDataOldValue: true,
      });
      this.back = [];
      this.forward = [];
      this.$ObserverSubject.next([]);
    }

    private back: CommandRecord[] = [];
    private forward: CommandRecord[] = [];
    private charging: boolean = false;

    private observer: MutationObserver = new MutationObserver(
      (ml, observer) => {
        console.log(ml);
        this.forward.length = 0;
        if (this.charging) {
          if (this.back.length) {
            const lastCmd = this.back[this.back.length - 1];
            lastCmd.mrs = lastCmd.mrs.concat(ml);
          } else {
            this.back.push({ id: utilis.GenRandomString(), mrs: ml });
          }
        } else {
          this.back.push({ id: utilis.GenRandomString(), mrs: ml });
          this.$ObserverSubject.next(ml);
        }
      }
    );

    public $ObserverSubject: Subject<MutationRecord[]> = new Subject();
    public get CommnadList(): {
      back: CommandRecord[];
      forward: CommandRecord[];
    } {
      return { back: this.back, forward: this.forward };
    }

    public get IsDirty(): boolean {
      return this.back.length > 0 || this.forward.length > 0;
    }

    public Command(command: Function, _description?: string): boolean {
      try {
        command();
        const recs = this.observer.takeRecords();
        if (recs.length) {
          this.back.push({
            id: utilis.GenRandomString(),
            timestamp: Date.now(),
            description: _description,
            mrs: recs,
          });
          this.forward.length = 0;
          this.$ObserverSubject.next(recs);
        }
      } catch (e) {
        console.warn(e);
        return false;
      }
      return true;
    }

    public Mute(command: Function): MutationRecord[] | undefined {
      try {
        command();
        return this.observer.takeRecords();
      } catch (e) {
        console.warn(e);
      }
    }

    public SetCharge(_description?: string) {
      if (!this.charging) {
        this.back.push({
          id: utilis.GenRandomString(),
          description: _description,
          mrs: [],
        });
        this.charging = true;
      }
    }

    public Flash(_description?: string) {
      if (this.charging) {
        if (this.back.length) {
          const lastCmd = this.back[this.back.length - 1];
          if (lastCmd.mrs.length) {
            lastCmd.description = _description;
            this.$ObserverSubject.next(lastCmd.mrs);
          } else {
            this.back.pop();
          }
        }
        this.charging = false;
      }
    }

    public Back(): Node | null {
      try {
        const rec = this.back.pop();
        if (rec) {
          const rrec = Array.from(rec.mrs).reverse();
          rrec.forEach((m) => {
            this.backMutation(m);
          });
          const recs = this.observer.takeRecords();
          this.forward.push({
            id: rec.id,
            description: rec.description,
            mrs: recs,
          });
          this.$ObserverSubject.next(recs);
          return recs[0].target;
        }
      } catch (e) {
        console.warn(e);
      }
      return null;
    }

    public Forward(): Node | null {
      try {
        const rec = this.forward.pop();
        if (rec) {
          rec.mrs.forEach((m) => {
            this.backMutation(m);
          });
          const recs = this.observer.takeRecords();
          this.back.push({
            id: rec.id,
            description: rec.description,
            mrs: recs,
          });
          this.$ObserverSubject.next(recs);
          return recs[0].target;
        }
      } catch (e) {
        console.warn(e);
      }
      return null;
    }

    private backMutation(m: MutationRecord) {
      switch (m.type) {
        case "characterData":
          m.target.nodeValue = m.oldValue;
          break;
        case "attributes":
          if (m.target instanceof HTMLElement && m.attributeName) {
            if (m.oldValue) {
              m.target.setAttribute(m.attributeName, m.oldValue);
            } else {
              m.target.removeAttribute(m.attributeName);
            }
          }
          break;
        case "childList":
          if (m.addedNodes.length > 0) {
            m.addedNodes.forEach((node) => {
              if (node.parentNode) {
                node.parentNode.removeChild(node);
              }
            });
          }

          if (m.removedNodes.length > 0) {
            m.removedNodes.forEach((node) => {
              if (m.previousSibling) {
                m.previousSibling?.parentNode?.insertBefore(
                  node,
                  m.previousSibling.nextSibling
                );
              } else if (m.nextSibling) {
                m.nextSibling?.parentNode?.insertBefore(node, m.nextSibling);
              } else {
                m.target.appendChild(node);
              }
            });
          }

          break;
      }
    }
  }
}
