import React, { useContext, useEffect, useState, useRef } from "react";
import { EditorContext } from "../../../App";
import styles from "../style.module.scss";

interface IImg {
  img: HTMLImageElement;
}

interface TargetAttrs {
  src: string;
  alt: string;
  width: number;
  height: number;
  loading: string;
}

export const ImgProp = (props: IImg) => {
  const editor = useContext(EditorContext);
  const form = useRef<HTMLFormElement>(null);
  const item = useRef<HTMLImageElement>(props.img);
  const extractVals = (tar: HTMLImageElement): TargetAttrs => {
    return {
      src: tar.src,
      alt: tar.alt,
      width: tar.width,
      height: tar.height,
      loading: tar.loading,
    };
  };
  const [attrs, setAttrs] = useState<TargetAttrs>(extractVals(props.img));

  useEffect(() => {
    const sbsc = editor.$ObserverSubject.subscribe((ml) => {
      const found = ml.reverse().find((m) => {
        return m.target === item.current && m.type === "attributes";
      });
      if (found) {
        setAttrs(extractVals(item.current));
      }
    });
    return () => {
      sbsc.unsubscribe();
    };
  }, []);

  useEffect(() => {
    item.current = props.img;
    setAttrs(extractVals(props.img));
  }, [props.img]);

  const muteSet = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tar = e.target as HTMLInputElement;
    editor.SaverSetCharge();
    props.img.setAttribute(tar.name, tar.value);
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
        props.img.setAttribute(tar.name, tar.value);
      } else {
        props.img.removeAttribute(tar.name);
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
        <input
          type="text"
          name="src"
          onChange={muteSet}
          onBlur={pushSet}
          value={attrs.src}
        />
      </div>

      <div className={`${styles.item} ${styles.inline}`}>
        <label className={styles.bf}>alt</label>
        <input
          type="text"
          name="alt"
          onChange={muteSet}
          onBlur={pushSet}
          value={attrs.alt}
        />
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

      <div className={`${styles.item} ${styles.inline}`}>
        <label className={styles.bf}>loading</label>
        <select
          name="loading"
          id="select_loading"
          onChange={onChangeSelect}
          value={attrs.loading}>
          <option value="">eager(default)</option>
          <option value="lazy">lazy</option>
        </select>
      </div>
    </form>
  );
};
