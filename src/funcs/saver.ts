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
      this.$ObserverSubject.next([]);
    }

    private back: CommandRecord[] = [];
    private forward: CommandRecord[] = [];

    private _charge: boolean = false;
    private chargeMRs: MutationRecord[][] = [];
    get IsChanged(): boolean {
      return this.chargeMRs.length > 0;
    }

    private observer: MutationObserver = new MutationObserver(
      (ml, observer) => {
        if (!this._charge) {
          this.stackBack(ml);
        } else {
          this.chargeMRs.push(ml);
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

    private stackBack(ml: MutationRecord[]) {
      this.back.push({ id: utilis.GenRandomString(), mrs: ml });
      this.forward.length = 0;
      this.$ObserverSubject.next(ml);
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

    public SetCharge() {
      this._charge = true;
    }

    public Flash(_description?: string) {
      if (this.chargeMRs.length) {
        const merged = this.chargeMRs.reduce((accumulator, currentArray) => {
          return accumulator.concat(currentArray);
        }, []);
        this.back.push({
          id: utilis.GenRandomString(),
          timestamp: Date.now(),
          description: _description,
          mrs: merged,
        });
        this.chargeMRs = [];
        this.$ObserverSubject.next(merged);
      }
      this._charge = false;
    }

    public Back(): Node | null {
      try {
        const rec = this.back.pop();
        if (rec) {
          rec.mrs.forEach((m) => {
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
          if (m.target instanceof HTMLElement) {
            if (m.attributeName) {
              if (m.oldValue) {
                m.target.setAttribute(m.attributeName, m.oldValue);
              } else {
                m.target.removeAttribute(m.attributeName);
              }
            }
          }
          break;
        case "childList":
          if (m.addedNodes.length) {
            m.addedNodes.forEach((node) => {
              m.target.removeChild(node);
            });
          }
          if (m.removedNodes.length) {
            m.removedNodes.forEach((node) => {
              m.target.insertBefore(node, m.nextSibling);
            });
          }
          break;
      }
    }
  }
}
