import styles from "./style.module.scss";
import React, { useRef } from "react";

interface IFoldableBoxProps {
  title: string;
  maxHeight?: string;
  hidable?: boolean;
  children: React.ReactNode;
}

export const FoldableBox = (props: IFoldableBoxProps) => {
  const fb = useRef<HTMLDivElement>(null);

  const conStyle: React.CSSProperties = {
    maxHeight: "",
    overflowY: "auto",
  };

  if (props.maxHeight) {
    conStyle.maxHeight = props.maxHeight;
    conStyle.overflowY = "scroll";
  }

  return (
    <div ref={fb} className={styles.fbWrap}>
      <div className={styles.title}>
        <b>{props.title}</b>
        <div>
          <button
            className={styles.fold}
            onClick={(e) => {
              fb.current?.classList.toggle(styles.close);
            }}></button>
          {props.hidable && (
            <button
              className={styles.hide}
              onClick={(e) => {
                fb.current?.classList.toggle(styles.hide);
              }}></button>
          )}
        </div>
      </div>
      <div style={conStyle} className={styles.fbContent}>
        {props.children}
      </div>
    </div>
  );
};
