import React, { useContext, useEffect, useState, useRef } from "react";
import { EditorContext } from "../../../App";
import styles from "../style.module.scss";
import { utilis } from "../../../funcs/utlis";
import { Subscription } from "rxjs";

interface ITextAlign {
  block: HTMLElement;
}

// Typography を 一つにして tagInfo も持ってきて、
// 必要に応じて表示を切り替える。Attr要素が多いと処理が大きくなる。できるだけまとめる。

const textAligns: string[] = ["start", "center", "justify", "end", "inherit"];

export const TextAlign = (props: ITextAlign) => {
  const editor = useContext(EditorContext);
  const form = useRef<HTMLFormElement>(null);
  const item = useRef<HTMLElement>(props.block);
  const sbsc = useRef<Subscription>(new Subscription());
  const [textAlign, setTextAlign] = useState<string | undefined>("");

  useEffect(() => {
    item.current = props.block;
    setTextAlign(utilis.GetStyleVal(props.block, "text-align"));
  }, [props]);

  sbsc.current.unsubscribe();
  sbsc.current = editor.$ObserverSubject.subscribe((ml) => {
    const found = ml.reverse().find((m) => {
      return (
        m.target === item.current &&
        m.type === "attributes" &&
        m.attributeName === "style"
      );
    });
    if (found) {
      setTextAlign(utilis.GetStyleVal(item.current, "text-align"));
    }
  });

  const onChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tar = e.target as HTMLSelectElement;
    const cs = new utilis.CreateStyle(item.current);
    editor.SaverCommand(() => {
      cs.Add(tar.name, tar.value);
      cs.SetToElement();
    }, `change text-aling${tar.value ? "(" + tar.value + ")" : ""}`);
  };

  return (
    <form
      ref={form}
      className={`${styles.attrForm} ${styles.text_align}`}
      onSubmit={(e) => {
        e.stopPropagation();
        e.preventDefault();
        return false;
      }}>
      <div className={`${styles.item}`}>
        <div className={styles.head}>
          <label>text-align</label>
        </div>
        <div className={styles.body}>
          <select
            name="text-align"
            value={textAlign ? textAlign : ""}
            onChange={onChangeSelect}>
            {textAligns.map((item, idx) => {
              return (
                <option key={idx} value={item}>
                  {item}
                </option>
              );
            })}
            <option value="">(unset)</option>
          </select>
        </div>
      </div>
    </form>
  );
};
