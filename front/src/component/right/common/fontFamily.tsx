import React, { useContext, useEffect, useState, useRef } from "react";
import { EditorContext } from "../../../App";
import styles from "../style.module.scss";
import { utilis } from "../../../funcs/utlis";
import { Subscription } from "rxjs";

interface IFontFamilyProp {
  tar: HTMLElement;
}

const fontFamilies: string[] = [
  "Arial",
  "Arial Black",
  "Comic Sans MS",
  "Courier New",
  "Georgia",
  "Impact",
  "Times New Roman",
  "Trebuchet MS",
  "Verdana",
  "inherit",
];

export const FontFamily = (props: IFontFamilyProp) => {
  const editor = useContext(EditorContext);
  const form = useRef<HTMLFormElement>(null);
  const sbsc = useRef<Subscription>(new Subscription());
  const item = useRef<HTMLElement>(props.tar);
  const [fontFamily, setFontFamily] = useState<string | undefined>(
    utilis.GetStyleVal(item.current, "font-family")
  );

  useEffect(() => {
    item.current = props.tar;
    setFontFamily(utilis.GetStyleVal(props.tar, "font-family"));
  }, [props.tar]);

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
      setFontFamily(utilis.GetStyleVal(item.current, "font-family"));
    }
  });

  const onChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tar = e.target as HTMLSelectElement;
    const cs = new utilis.CreateStyle(item.current);
    editor.SaverCommand(() => {
      cs.Add(tar.name, tar.value);
      cs.SetToElement();
    }, `change font-family${tar.value ? "(" + tar.value + ")" : ""}`);
  };

  if (fontFamily && !fontFamilies.includes(fontFamily)) {
    fontFamilies.push(fontFamily);
  }

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
          <label>font-family</label>
        </div>
        <div className={styles.body}>
          <select
            name="font-family"
            value={fontFamily ? fontFamily : ""}
            onChange={onChangeSelect}>
            {fontFamilies.map((item, idx) => {
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
