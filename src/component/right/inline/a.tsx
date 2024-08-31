import React, { useContext, useEffect, useRef, useState } from "react";
import { EditorContext } from "../../../App";
import styles from "../style.module.scss";

interface IAProp {
  anchor: HTMLAnchorElement;
}

interface TargetAttrs {
  href: string;
  target: string;
  rel: string;
}

export const AProp = (props: IAProp) => {
  const editor = useContext(EditorContext);
  const form = useRef<HTMLFormElement>(null);
  const item = useRef<HTMLAnchorElement>(props.anchor);
  const extractVals = (tar: HTMLAnchorElement): TargetAttrs => {
    return {
      href: tar.href,
      target: tar.target,
      rel: tar.rel,
    };
  };

  const [attrs, setAttrs] = useState<TargetAttrs>(extractVals(props.anchor));

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
    item.current = props.anchor;
    setAttrs(extractVals(props.anchor));
  }, [props.anchor]);

  const muteSet = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tar = e.target as HTMLInputElement;
    editor.SaverSetCharge();
    props.anchor.setAttribute(tar.name, tar.value);
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
        props.anchor.setAttribute(tar.name, tar.value);
      } else {
        props.anchor.removeAttribute(tar.name);
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
      <div className={styles.item}>
        <div className={styles.head}>
          <label>href</label>
        </div>
        <div className={styles.body}>
          <input
            type="text"
            name="href"
            onChange={muteSet}
            onBlur={pushSet}
            value={attrs.href}
          />
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.head}>
          <label htmlFor="select_target">target</label>
        </div>
        <div className={styles.body}>
          <select
            name="target"
            id="select_target"
            onChange={onChangeSelect}
            value={attrs.target}>
            <option value="">_self(default)</option>
            <option value="_blank">_blank</option>
            <option value="_parent">_parent</option>
            <option value="_top">_top</option>
          </select>
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.head}>
          <label>rel</label>
        </div>
        <div className={styles.body}>
          <input
            type="text"
            name="rel"
            onChange={muteSet}
            onBlur={pushSet}
            value={attrs.rel}
          />
        </div>
      </div>
    </form>
  );
};
