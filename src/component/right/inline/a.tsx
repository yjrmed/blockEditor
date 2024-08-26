import React, { useContext, useEffect, useRef, useState } from "react";
import { EditorContext } from "../../../App";
import styles from "../style.module.scss";
import { Subscription } from "rxjs";

interface IAProp {
  anchor: HTMLAnchorElement;
}

interface Attrs {
  href: string;
  target: string;
  rel: string;
}

export const AProp = (props: IAProp) => {
  const editor = useContext(EditorContext);
  const form = useRef<HTMLFormElement>(null);
  const sbsc = useRef<Subscription>(new Subscription());
  const item = useRef<HTMLAnchorElement>(props.anchor);
  const extractVals = (tar: HTMLAnchorElement): Attrs => {
    return {
      href: tar.href,
      target: tar.target,
      rel: tar.rel,
    };
  };

  const [attrs, setAttrs] = useState<Attrs>(extractVals(item.current));

  useEffect(() => {
    item.current = props.anchor;
    setAttrs(extractVals(props.anchor));
  }, [props.anchor]);

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
      props.anchor.setAttribute(tar.name, tar.value);
    });
  };

  const pushSet = (e: React.FocusEvent) => {
    const tar = e.target as HTMLInputElement;
    const initVal = (attrs as any)[tar.name];
    if (initVal !== tar.value) {
      editor.ExecMuteCommand(() => {
        props.anchor.setAttribute(tar.name, initVal);
      });
      editor.ExecCommand(() => {
        props.anchor.setAttribute(tar.name, tar.value);
      }, `change A gag prop ${tar.name}`);
    }
  };

  const onChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tar = e.target as HTMLSelectElement;
    if (tar.value) {
      props.anchor.setAttribute(tar.name, tar.value);
    } else {
      props.anchor.removeAttribute(tar.name);
    }
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
            defaultValue={attrs.href}
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
            defaultValue={attrs.target}>
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
            defaultValue={attrs.rel}
          />
        </div>
      </div>
    </form>
  );
};
