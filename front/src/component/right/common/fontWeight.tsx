import React, { useContext, useEffect, useState, useRef } from "react";
import { EditorContext } from "../../../App";
import styles from "../style.module.scss";
import { utilis } from "../../../funcs/utlis";
import { Subscription } from "rxjs";

interface IFontWeightProp {
  tar: HTMLElement;
}

const fontWeights: { val: string; ex: string }[] = [
  { val: "100", ex: "Thin" },
  { val: "200", ex: "Extra Light" },
  { val: "300", ex: "Light" },
  { val: "400", ex: "Normal" },
  { val: "500", ex: "Medium" },
  { val: "600", ex: "Semi Bold" },
  { val: "700", ex: "Bold" },
  { val: "800", ex: "Extra Bold" },
  { val: "900", ex: "Black" },
  { val: "normal", ex: "" },
  { val: "bolder", ex: "" },
  { val: "lighter", ex: "" },
  { val: "inherit", ex: "" },
];

export const FontWeight = (props: IFontWeightProp) => {
  const editor = useContext(EditorContext);
  const form = useRef<HTMLFormElement>(null);
  const sbsc = useRef<Subscription>(new Subscription());
  const item = useRef<HTMLElement>(props.tar);
  const [fontWeight, setFontWeight] = useState<string | undefined>(
    utilis.GetStyleVal(item.current, "font-weight")
  );

  useEffect(() => {
    item.current = props.tar;
    setFontWeight(utilis.GetStyleVal(props.tar, "font-weight"));
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
      setFontWeight(utilis.GetStyleVal(item.current, "font-weight"));
    }
  });

  const onChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tar = e.target as HTMLSelectElement;
    const cs = new utilis.CreateStyle(item.current);
    editor.SaverCommand(() => {
      cs.Add(tar.name, tar.value);
      cs.SetToElement();
    }, `change font-weight${tar.value ? "(" + tar.value + ")" : ""}`);
  };

  return (
    <form
      ref={form}
      className={styles.attrForm}
      onSubmit={(e) => {
        e.stopPropagation();
        e.preventDefault();
        return false;
      }}>
      <div className={`${styles.item} ${styles.inline}`}>
        <label className={styles.bf}>font-weight</label>
        <select
          name="font-weight"
          value={fontWeight ? fontWeight : ""}
          onChange={onChangeSelect}>
          {fontWeights.map((item, idx) => {
            return (
              <option key={idx} value={item.val}>
                {`${item.val}` + (item.ex ? ` (${item.ex})` : "")}
              </option>
            );
          })}
          <option value="">(unset)</option>
        </select>
      </div>
    </form>
  );
};
