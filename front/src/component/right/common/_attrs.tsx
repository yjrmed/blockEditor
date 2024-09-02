import React, { useContext, useRef, useState, useEffect } from "react";
import { EditorContext } from "../../../App";
import styles from "./style.module.scss";
import { Subscription } from "rxjs";
import { utilis } from "../../../funcs/utlis";

interface IEleAttrs {
  item: HTMLElement;
}

interface changeItem {
  tar: utilis.ikv;
  idx: number | null;
}

export const EleAttrs = (props: IEleAttrs) => {
  const editor = useContext(EditorContext);
  const form = useRef<HTMLFormElement>(null);
  const sbsc = useRef<Subscription>(new Subscription());
  const item = useRef<HTMLElement>(props.item);
  const getAttrList = (tar: HTMLElement): utilis.ikv[] => {
    return Array.from(tar.attributes)
      .filter((attr) => {
        return attr.name !== "contenteditable";
      })
      .map((attr) => {
        return { key: attr.name, value: attr.value } as utilis.ikv;
      });
  };
  const [attrs, setAttrs] = useState<utilis.ikv[]>(getAttrList(props.item));
  const isChangedWithMute = useRef<boolean>(false);

  useEffect(() => {
    item.current = props.item;
    isChangedWithMute.current = false;
    setAttrs(getAttrList(props.item));
  }, [props.item]);

  sbsc.current.unsubscribe();
  sbsc.current = editor.$ObserverSubject.subscribe((ml) => {
    const found = ml.reverse().find((m) => {
      return m.target === item.current && m.type === "attributes";
    });
    if (found) {
      setAttrs(getAttrList(item.current));
    }
  });

  const getEventItem = (tar: HTMLElement): changeItem | null => {
    const wrap = tar.closest(".item") as HTMLDivElement;
    if (wrap) {
      const idx = wrap.getAttribute("data-idx");
      return {
        tar: {
          key: (wrap.children[0] as HTMLInputElement).value,
          value: (wrap.children[1] as HTMLInputElement).value,
        },
        idx: idx !== null ? parseInt(idx) : null,
      };
    } else {
      return null;
    }
  };

  const clearNewInputs = () => {
    if (form.current) {
      form.current.new_key.value = "";
      form.current.new_value.value = "";
    }
  };

  const setSave = (
    list: utilis.ikv[],
    change: changeItem | null,
    description?: string
  ) => {
    editor.SaverCommand(() => {
      list.forEach((akv, idx) => {
        item.current.removeAttribute(akv.key);
        if (idx === change?.idx) {
          if (change.tar.key) {
            item.current.setAttribute(change.tar.key, change.tar.value);
          }
        } else {
          item.current.setAttribute(akv.key, akv.value ? akv.value : "");
        }
      });
      if (change?.idx === null && change.tar.key) {
        item.current.setAttribute(change.tar.key, change.tar.value);
      }
    }, description);
    setAttrs(getAttrList(item.current));
    isChangedWithMute.current = false;
  };

  const muteSet = (e: React.ChangeEvent<HTMLInputElement>) => {
    const change = getEventItem(e.target);
    if (change && change.idx !== null) {
      // const ml = editor.SaverMute(() => {
      //   attrs.forEach((akv, idx) => {
      //     item.current.removeAttribute(akv.key);
      //     if (idx === change.idx) {
      //       if (change.tar.key) {
      //         item.current.setAttribute(change.tar.key, change.tar.value);
      //       }
      //     } else {
      //       item.current.setAttribute(akv.key, akv.value ? akv.value : "");
      //     }
      //   });
      // });
      // isChangedWithMute.current = Boolean(ml?.length);
      // const newList = getAttrList(item.current);
      // if (!change.tar.key) {
      //   // 変更イベントが発生しない。
      //   setSave(newList, null, "remove attr");
      //   form.current?.new_key.focus();
      // } else {
      //   setAttrs(newList);
      // }
    }
  };

  const onBlurForm = (e: React.FocusEvent) => {
    const change = getEventItem(e.target as HTMLElement);
    if (change) {
      if (change.idx !== null) {
        if (isChangedWithMute.current) {
          setSave(attrs, change, `change attr (${change.tar.key})`);
        }
      } else {
        if (change.tar.key) {
          setSave(attrs, change, `add attr (${change.tar.key})`);
          clearNewInputs();
        }
      }
    }
  };

  return (
    <form
      ref={form}
      onSubmit={(e) => {
        e.stopPropagation();
        e.preventDefault();
        return false;
      }}
      onBlur={onBlurForm}
      className={styles.formAttrs}>
      {attrs.map((attr, idx) => {
        return (
          <div className={`item ${styles.wi}`} key={idx} data-idx={idx}>
            <input
              type="text"
              name={`${idx} ${attr.key}`}
              value={attr.key}
              onChange={muteSet}
              placeholder="key"
            />
            <input
              type="text"
              name={`${idx} ${attr.value}`}
              value={attr.value}
              placeholder="value"
              onChange={muteSet}
            />
          </div>
        );
      })}

      <div className={`item new ${styles.wi}`}>
        <input
          name="new_key"
          type="text"
          defaultValue=""
          onChange={muteSet}
          placeholder="new key"
        />
        <input
          name="new_value"
          type="text"
          defaultValue=""
          onChange={muteSet}
          placeholder="new value"
        />
      </div>
    </form>
  );
};
