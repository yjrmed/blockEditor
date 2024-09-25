import React, { useContext, useEffect, useState, useRef } from "react";
import { EditorContext } from "../../../App";
import styles from "../style.module.scss";

interface IIFrameProp {
  iframe: HTMLIFrameElement;
}

interface iframeAttrs {
  src: string;
  policy: string;
  width: number;
  height: number;
}

// const Loading = {
//   eager: "",
//   lazy: "lazy",
// } as const;
// type Loading = (typeof Loading)[keyof typeof Loading];

const Policy = {
  "no-referrer-when-downgrade": "",
  "no-referrer": "no-referrer",
  origin: "origin",
  "same-origin": "same-origin",
  "origin-when-cross-origin": "origin-when-cross-origin",
  "strict-origin": "strict-origin",
  "strict-origin-when-cross-origin": "strict-origin-when-cross-origin",
} as const;
type Policy = (typeof Policy)[keyof typeof Policy];

// const Sandbox = {
//   allow_downloads: "allow-downloads",
//   allow_downloads_without_user_activation:
//     "allow-downloads-without-user-activation",
//   allow_same_origin: "allow-same-origin",
//   allow_forms: "allow-forms",
//   allow_popups: "allow-popups",
//   allow_scripts: "allow-scripts",
//   allow_modals: "allow-modals",
//   allow_orientation_lock: "allow-orientation-lock",
//   allow_pointer_lock: "allow-pointer-lock",
//   allow_presentation: "allow-presentation",
// } as const;
// type Sandbox = (typeof Sandbox)[keyof typeof Sandbox];

export const IFrameProp = (props: IIFrameProp) => {
  const editor = useContext(EditorContext);
  const form = useRef<HTMLFormElement>(null);
  const item = useRef<HTMLIFrameElement>(props.iframe);
  const extractVals = (tar: HTMLIFrameElement): iframeAttrs => {
    return {
      src: tar.src,
      policy: tar.referrerPolicy,
      width: Number(tar.width),
      height: Number(tar.height),
    };
  };
  const [attrs, setAttrs] = useState<iframeAttrs>(extractVals(props.iframe));

  const muteSet = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tar = e.target as HTMLInputElement;
    editor.SaverSetCharge();
    if (tar.value) {
      props.iframe.setAttribute(tar.name, tar.value);
    } else {
      props.iframe.removeAttribute(tar.name);
    }
    setAttrs(extractVals(item.current));
  };

  const pushSet = (e: React.FocusEvent) => {
    const tar = e.target as HTMLInputElement;
    editor.SaverFlash(`change ${tar.name}`);
  };

  const onChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tar = e.target as HTMLSelectElement;
    editor.SaverCommand(() => {
      if (tar.value) {
        props.iframe.setAttribute(tar.name, tar.value);
      } else {
        props.iframe.removeAttribute(tar.name);
      }
    }, `change ${tar.name}`);
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
        <label className={styles.bf}>src</label>
        <input type="text" name="src" value={attrs.src} onChange={muteSet} />
      </div>
      <div className={`${styles.item} ${styles.inline}`}>
        <label className={styles.bf}>referrerpolicy</label>
        <select
          name="referrerpolicy"
          value={attrs.policy ? attrs.policy : ""}
          onChange={onChangeSelect}>
          {Object.entries(Policy).map(([_key, _value]) => {
            return (
              <option key={_key} value={_value}>
                {_key.replace(/_/g, "-")}
              </option>
            );
          })}
        </select>
      </div>
      <div className={`${styles.item} ${styles.inline}`}>
        <label className={styles.bf}>width</label>
        <input
          type="number"
          name="width"
          min="0"
          onChange={muteSet}
          onBlur={pushSet}
          value={attrs.width}
        />
        <label>px</label>
      </div>
      <div className={`${styles.item} ${styles.inline}`}>
        <label className={styles.bf}>height</label>
        <input
          type="number"
          name="height"
          min="0"
          onChange={muteSet}
          onBlur={pushSet}
          value={attrs.height}
        />
        <label>px</label>
      </div>
    </form>
  );
};
