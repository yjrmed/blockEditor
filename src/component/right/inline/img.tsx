import React, { useContext, useEffect, useState, useRef } from "react";
import { EditorContext } from "../../../App";
import styles from "../style.module.scss";
import { Subscription } from "rxjs";

interface IImg {
  img: HTMLImageElement;
}

interface Attrs {
  src: string;
  alt: string;
  width: number;
  height: number;
  loading: string;
}

export const ImgProp = (props: IImg) => {
  const editor = useContext(EditorContext);
  const form = useRef<HTMLFormElement>(null);
  const sbsc = useRef<Subscription>(new Subscription());
  const item = useRef<HTMLImageElement>(props.img);
  const extractVals = (tar: HTMLImageElement): Attrs => {
    return {
      src: tar.src,
      alt: tar.alt,
      width: tar.width,
      height: tar.height,
      loading: tar.loading,
    };
  };
  const [attrs, setAttrs] = useState<Attrs>(extractVals(item.current));

  useEffect(() => {
    item.current = props.img;
    setAttrs(extractVals(props.img));
  }, [props.img]);

  sbsc.current.unsubscribe();
  sbsc.current = editor.$ObserverSubject.subscribe((ml) => {
    const found = ml.reverse().find((m) => {
      return m.target === item.current && m.type === "attributes";
    });
    if (found) {
      setAttrs(extractVals(item.current));
    }
  });

  const muteSet = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tar = e.target as HTMLInputElement;
    editor.ExecMuteCommand(() => {
      props.img.setAttribute(tar.name, tar.value);
    });
  };

  const pushSet = (e: React.FocusEvent) => {
    const tar = e.target as HTMLInputElement;
    const initVal = (attrs as any)[tar.name];
    const currentVal: any =
      tar.type === "number" ? parseFloat(tar.value) : tar.value;
    if (initVal !== currentVal) {
      editor.ExecMuteCommand(() => {
        props.img.setAttribute(tar.name, initVal);
      });
      props.img.setAttribute(tar.name, currentVal);
    }
  };

  const onChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tar = e.target as HTMLSelectElement;
    if (tar.value) {
      props.img.setAttribute(tar.name, tar.value);
    } else {
      props.img.removeAttribute(tar.name);
    }
  };

  return (
    <form
      ref={form}
      className={`${styles.attrForm} ${styles.img}`}
      onSubmit={(e) => {
        e.stopPropagation();
        e.preventDefault();
        return false;
      }}>
      <div className={styles.item}>
        <div className={styles.head}>
          <label>src</label>
        </div>
        <div className={styles.body}>
          <input
            type="text"
            name="src"
            onChange={muteSet}
            onBlur={pushSet}
            defaultValue={attrs.src}
          />
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.head}>
          <label>alt</label>
        </div>
        <div className={styles.body}>
          <input
            type="text"
            name="alt"
            onChange={muteSet}
            onBlur={pushSet}
            defaultValue={attrs.alt}
          />
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.head}>
          <label>size</label>
        </div>
        <div className={`${styles.body} ${styles.subs}`}>
          <div className={styles.subitem}>
            <label>w:</label>
            <input
              type="number"
              name="width"
              onChange={muteSet}
              onBlur={pushSet}
              defaultValue={attrs.width}
            />
          </div>
          <div className={styles.subitem}>
            <label>h:</label>
            <input
              type="number"
              name="height"
              onChange={muteSet}
              onBlur={pushSet}
              defaultValue={attrs.height}
            />
          </div>
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.head}>
          <label htmlFor="select_loading">loading</label>
        </div>
        <div className={styles.body}>
          <select
            name="loading"
            id="select_loading"
            onChange={onChangeSelect}
            defaultValue={attrs.loading}>
            <option value="">eager(default)</option>
            <option value="lazy">lazy</option>
          </select>
        </div>
      </div>
    </form>
  );
};
