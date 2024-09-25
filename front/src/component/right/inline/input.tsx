import React, { useContext, useEffect, useState, useRef } from "react";
import { EditorContext } from "../../../App";
import styles from "../style.module.scss";

interface IInputProp {
  input: HTMLInputElement;
}



export const IInputProp = (props: IInputProp) => {
  const editor = useContext(EditorContext);
  const form = useRef<HTMLFormElement>(null);
  const item = useRef<HTMLInputElement>(props.input);

  // type value name

  // disabeld

  // checked

  // min max


  return (
    <form
      ref={form}
      className={styles.attrForm}
      onSubmit={(e) => {
        e.stopPropagation();
        e.preventDefault();
        return false;
      }}>
     
    </form>
  );
};
