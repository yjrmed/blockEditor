export class BiDirectionalMap<K, V> {
  private keyToValue: Map<K, V> = new Map();
  private valueToKey: Map<V, K> = new Map();

  set(key: K, value: V): void {
    this.keyToValue.set(key, value);
    this.valueToKey.set(value, key);
  }

  getValueByKey(key: K): V | undefined {
    return this.keyToValue.get(key);
  }

  getKeyByValue(value: V): K | undefined {
    return this.valueToKey.get(value);
  }

  deleteByKey(key: K): void {
    const value = this.keyToValue.get(key);
    if (value !== undefined) {
      this.keyToValue.delete(key);
      this.valueToKey.delete(value);
    }
  }

  deleteByValue(value: V): void {
    const key = this.valueToKey.get(value);
    if (key !== undefined) {
      this.valueToKey.delete(value);
      this.keyToValue.delete(key);
    }
  }

  clear() {
    this.keyToValue = new Map();
    this.valueToKey = new Map();
  }
}

export namespace utilis {
  export interface ikv {
    key: string;
    value: string;
  }

  export function GetStyleObject(
    ele: HTMLElement
  ): { key: string; value: string }[] {
    const ret: { key: string; value: string }[] = [];
    const style = ele.getAttribute("style");
    style?.split(";").forEach((i) => {
      if (i) {
        const kv = i.split(":");
        ret.push({ key: kv[0].trim(), value: kv[1].trim() });
      }
    });
    return ret;
  }

  export function GetStyleVal(
    ele: HTMLElement,
    key: string
  ): string | undefined {
    const styles = GetStyleObject(ele);
    const found = styles.find((style) => {
      return style.key === key;
    });
    if (found) {
      return found.value;
    }
  }

  export function GenRandomString(length = 10): string {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  }

  export function IsAlphanumeric(input: string): boolean {
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    return alphanumericRegex.test(input);
  }

  export function toCamelCase(property: string): string {
    return property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  }

  export function isStyleProperty(property: string): boolean {
    const camelCaseProperty = toCamelCase(property);
    const style = document.createElement("div").style;
    return camelCaseProperty in style;
  }

  export function removeDuplicateKeys(arr: { key: any; value: any }[]) {
    const seenKeys = new Set();
    return arr.filter((item) => {
      const keys = Object.keys(item);
      if (keys.some((key) => seenKeys.has(key))) {
        return false;
      } else {
        keys.forEach((key) => seenKeys.add(key));
        return true;
      }
    });
  }

  export function SetViewNode(
    tar: Node,
    _behavior: ScrollBehavior = "auto",
    _block: ScrollLogicalPosition = "center",
    _inline: ScrollLogicalPosition = "nearest"
  ) {
    const ele = tar instanceof HTMLElement ? tar : tar.parentElement;
    if (ele) {
      ele.scrollIntoView({
        behavior: _behavior,
        block: _block,
        inline: _inline,
      });
    }
  }

  export class CreateStyle {
    constructor(private ele: HTMLElement) {
      this.styleObj = CreateStyle.GetListFromValue(ele.getAttribute("style"));
    }

    get Ele(): HTMLElement {
      return this.ele;
    }

    private styleObj: { key: string; value: string }[] = [];
    private initStyleObj: { key: string; value: string }[] = [];

    public SetToElement(): boolean {
      if (this.IsChanged) {
        const val = this.ToString();
        if (val) {
          this.ele.setAttribute("style", this.ToString());
        } else {
          this.ele.removeAttribute("style");
        }
        return true;
      } else {
        return false;
      }
    }

    public Add(_key: string, _value: string): void {
      _key = _key.trim();
      _value = _value.trim();
      const found = this.styleObj.find((kv) => {
        return kv.key === _key;
      });
      if (found) {
        found.value = _value;
      } else {
        this.styleObj.push({ key: _key, value: _value });
      }
    }

    public Remove(_key: string): void {
      this.styleObj = this.styleObj.filter((kv) => {
        return kv.key !== _key;
      });
    }

    public get IsChanged(): boolean {
      return (
        this.initStyleObj.length !== this.styleObj.length ||
        CreateStyle.GetValueString(this.initStyleObj) !==
          CreateStyle.GetValueString(this.styleObj)
      );
    }

    public ToString(): string {
      return CreateStyle.GetValueString(this.styleObj);
    }

    public static GetListFromValue(
      value: string | null
    ): { key: string; value: string }[] {
      const ret: { key: string; value: string }[] = [];
      if (value) {
        value.split(";").forEach((item) => {
          const kv = item.split(":");
          if (kv[0] && kv[1]) {
            ret.push({ key: kv[0].trim(), value: kv[1].trim() });
          }
        });
      }
      return ret;
    }

    public static GetValueString(
      obj: { key: string; value: string }[]
    ): string {
      const ret = obj
        .filter((kv) => {
          return kv.key && kv.value;
        })
        .map((kv) => {
          return `${kv.key}:${kv.value}`;
        })
        .join(";");
      return ret ? ret + ";" : ret;
    }
  }

  export function ConvertPathToHref(filePath: string) {
    const encodedPath = encodeURI(filePath.replace(/\\/g, "/"));
    return `file:///${encodedPath}`;
  }
}
