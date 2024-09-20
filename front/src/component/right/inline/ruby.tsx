import React, { useContext, useEffect, useState, useRef } from "react";
import { EditorContext } from "../../../App";
import styles from "../style.module.scss";

interface IRuby {
  ruby: HTMLElement;
}

interface RubyProperty {
  rt: boolean;
  rpTxt: string;
}

export const RubyProp = (props: IRuby) => {
  const editor = useContext(EditorContext);
  const form = useRef<HTMLFormElement>(null);
  const item = useRef<HTMLElement>(props.ruby);
  const parseRuby = (ruby: HTMLElement): RubyProperty => {
    if (ruby.tagName === "RUBY") {
      const rt = ruby.querySelector("rt");
      const rp = ruby.querySelector("rp");

      return {
        rt: Boolean(rp),
        rpTxt: rt?.textContent ? rt.textContent : "",
      };
    } else {
      return {
        rt: false,
        rpTxt: "",
      };
    }
  };
  const [rubyProp, setRubyProp] = useState<RubyProperty>(parseRuby(props.ruby));

  useEffect(() => {
    const sbsc = editor.$ObserverSubject.subscribe((ml) => {
      const found = ml.reverse().find((m) => {
        return m.target === item.current && m.type === "attributes";
      });
      if (found) {
        setRubyProp(parseRuby(props.ruby));
      }
    });
    return () => {
      sbsc.unsubscribe();
    };
  }, []);

  useEffect(() => {
    item.current = props.ruby;
    setRubyProp(parseRuby(props.ruby));
  }, [props.ruby]);

  const rtTxtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const txt = e.target.value;
    editor.SaverSetCharge();
    let rt = item.current.querySelector("rt");
    if (!rt) {
      rt = document.createElement("rt");
      item.current.appendChild(rt);

      let temp = document.createElement("rp");
      temp.textContent = "(";
      rt.before(temp);

      temp = document.createElement("rp");
      temp.textContent = ")";
      rt.after(temp);
    }
    rt.textContent = txt;
    setRubyProp(parseRuby(props.ruby));
  };

  const flash = (e: React.FocusEvent) => {
    const tar = e.target as HTMLInputElement;
    editor.SaverFlash(`change ${tar.name}`);
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
        <label className={styles.bf}>RP text</label>
        <input
          type="text"
          name="RPtxt"
          value={rubyProp.rpTxt}
          onChange={rtTxtChange}
          onBlur={flash}
        />
      </div>
    </form>
  );
};
