import React, { useRef, useEffect } from "react";
import styles from "./style.module.scss";

interface IEditStrArrayProps {
  items: string[];
  update: (ret: string[]) => void;
}

export const EditStrArray = (props: IEditStrArrayProps) => {
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (input.current) {
      input.current.value = "";
    }
  }, [props]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (input.current?.value) {
      const _items = structuredClone(props.items);
      _items.push(input.current.value);
      props.update(_items);
    }
  };

  const onClickDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.target as HTMLButtonElement;
    props.update(props.items.filter((item) => item !== btn.value));
  };

  return (
    <form onSubmit={onSubmit} className={styles.eaForm}>
      {props.items.map((item, idx) => (
        <label key={idx}>
          <button onClick={onClickDelete} value={item}>
            -
          </button>
          {item}
        </label>
      ))}
      <input ref={input} type="text" placeholder="+"></input>
    </form>
  );
};
