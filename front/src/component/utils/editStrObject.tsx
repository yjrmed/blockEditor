import React, { useRef, useEffect } from "react";
import styles from "./style.module.scss";

export interface IEditStrObj {
  key: string;
  value: string;
}

interface IEditStrObjectProps {
  items: IEditStrObj[];
  update: Function;
}

export const EditStrObject = (props: IEditStrObjectProps) => {
  const add_area = useRef<HTMLDivElement>(null);

  useEffect(() => {
    add_area.current?.querySelectorAll("input").forEach((input) => {
      input.value = "";
    });
  }, [props]);

  const onClickDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    debugger;
    const btn = e.target as HTMLButtonElement;
    const copy = Array.from(props.items);
    copy.splice(parseInt(btn.value), 1);
    props.update(copy);
  };

  const onClickAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const btn = e.target as HTMLButtonElement;
    const iKey = btn.parentElement?.querySelector(
      "input.key"
    ) as HTMLInputElement;
    const iValue = btn.parentElement?.querySelector(
      "input.value"
    ) as HTMLInputElement;
    const add = { key: iKey.value, value: iValue.value } as IEditStrObj;
    props.update(props.items.concat(add));
  };

  return (
    <form
      onSubmit={(e) => {
        return false;
      }}
      className={styles.eoForm}>
      {props.items.map((item, idx) => (
        <div key={idx} className={styles.item}>
          <button type="button" value={idx} onClick={onClickDelete}>
            -
          </button>
          <input
            type="text"
            className="key"
            onChange={(e) => {}}
            defaultValue={item.key}
            placeholder="key"
          />
          <input
            type="text"
            className="value"
            onChange={(e) => {}}
            defaultValue={item.value}
            placeholder="value"
          />
        </div>
      ))}
      <div className={styles.item} ref={add_area}>
        <button type="button" onClick={onClickAdd}>
          +
        </button>
        <input
          className="key"
          onChange={(e) => {}}
          type="text"
          placeholder="key"
        />
        <input
          className="value"
          onChange={(e) => {}}
          type="text"
          placeholder="value"
        />
      </div>
    </form>
  );
};
