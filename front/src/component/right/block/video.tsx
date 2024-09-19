import React, { useContext, useEffect, useRef, useState } from "react";
import { EditorContext } from "../../../App";
import styles from "../style.module.scss";

interface IVIDEOProp {
  video: HTMLVideoElement;
}

interface TargetAttrs {
  src: string;
  poster: string;
  controls: boolean;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  playsinline: boolean;
  preload: string;
  size: { width: number; height: number };
}

export const VideoProp = (props: IVIDEOProp) => {
  const editor = useContext(EditorContext);
  const form = useRef<HTMLFormElement>(null);
  const item = useRef<HTMLVideoElement>(props.video);
  const extractAttrs = (tar: HTMLVideoElement): TargetAttrs => {
    return {
      src: tar.src,
      poster: tar.poster,
      controls: tar.controls,
      autoplay: tar.autoplay,
      loop: tar.loop,
      muted: tar.muted,
      playsinline: tar.playsInline,
      preload: tar.preload,
      size: { width: tar.width, height: tar.height },
    };
  };

  const [attrs, setAttrs] = useState(extractAttrs(props.video));

  useEffect(() => {
    const sbsc = editor.$ObserverSubject.subscribe((ml) => {
      const found = ml.reverse().find((m) => {
        return m.target === item.current && m.type === "attributes";
      });
      if (found) {
        setAttrs(extractAttrs(item.current));
      }
    });
    return () => {
      sbsc.unsubscribe();
    };
  }, []);

  useEffect(() => {
    item.current = props.video;
    setAttrs(extractAttrs(item.current));
  }, [props.video]);

  const charge = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tar = e.target as HTMLInputElement;
    editor.SaverSetCharge();
    if (tar.type === "checkbox") {
      if (tar.checked) {
        item.current.setAttribute(tar.name, "");
      } else {
        item.current.removeAttribute(tar.name);
      }
    } else {
      item.current.setAttribute(tar.name, tar.value);
    }
    setAttrs(extractAttrs(item.current));
  };

  const flash = (e: React.FocusEvent) => {
    const tar = e.target as HTMLInputElement;
    editor.SaverFlash(`change ${tar.name}`);
  };

  const changeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tar = e.target as HTMLSelectElement;
    editor.SaverCommand(() => {
      if (tar.value) {
        item.current.setAttribute(tar.name, tar.value);
      } else {
        item.current.removeAttribute(tar.name);
      }
    }, `change ${tar.name}`);
    setAttrs(extractAttrs(item.current));
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
          value={item.current.src}
          onChange={charge}
          onBlur={flash}
        />
      </div>

      <div className={`${styles.item} ${styles.inline}`}>
        <label className={styles.bf}>poster</label>
        <input
          type="text"
          name="poster"
          value={attrs.poster}
          onChange={charge}
          onBlur={flash}
        />
      </div>

      <div className={`${styles.item} ${styles.inline}`}>
        <input
          id="_controls"
          type="checkbox"
          name="controls"
          checked={item.current.controls}
          onChange={charge}
          onBlur={flash}
        />
        <label htmlFor="_controls">controls</label>
      </div>

      <div className={`${styles.item} ${styles.inline}`}>
        <input
          id="_autoplay"
          type="checkbox"
          name="autoplay"
          checked={item.current.autoplay}
          onChange={charge}
          onBlur={flash}
        />
        <label htmlFor="_autoplay">autoplay</label>
      </div>

      <div className={`${styles.item} ${styles.inline}`}>
        <input
          id="_loop"
          type="checkbox"
          name="loop"
          checked={item.current.loop}
          onChange={charge}
          onBlur={flash}
        />
        <label htmlFor="_loop">loop</label>
      </div>

      <div className={`${styles.item} ${styles.inline}`}>
        <input
          id="_muted"
          type="checkbox"
          name="muted"
          checked={item.current.muted}
          onChange={charge}
          onBlur={flash}
        />
        <label htmlFor="_muted">muted</label>
      </div>

      <div className={`${styles.item} ${styles.inline}`}>
        <input
          id="_playsinline"
          type="checkbox"
          name="playsinline"
          checked={item.current.playsInline}
          onChange={charge}
          onBlur={flash}
        />
        <label htmlFor="_playsinline">playsinline</label>
      </div>

      <div className={`${styles.item} ${styles.inline}`}>
        <label className={styles.bf}>preload</label>
        <select
          onChange={changeSelect}
          name="preload"
          value={item.current.preload}
          id="_preload">
          <option value="none">none</option>
          <option value="metadata">metadata</option>
          <option value="auto">auto(default)</option>
        </select>
      </div>

      <div className={`${styles.item} ${styles.inline}`}>
        <label className={styles.bf}>width</label>
        <input
          id="_width"
          type="number"
          name="width"
          value={item.current.width}
          onChange={charge}
          onBlur={flash}
        />
        <label>px</label>
      </div>

      <div className={`${styles.item} ${styles.inline}`}>
        <label className={styles.bf}>height</label>
        <input
          id="_height"
          type="number"
          name="height"
          value={item.current.height}
          onChange={charge}
          onBlur={flash}
        />
        <label>px</label>
      </div>
    </form>
  );
};
