import { useContext, useRef, useState, useEffect } from "react";
import { EditorContext } from "../../../App";
import styles from "./style.module.scss";
import { utilis } from "../../../funcs/utlis";
import { Subscription } from "rxjs";

interface IEleStyle {
  item: HTMLElement;
}

export const EleStyle = (props: IEleStyle) => {
  const editor = useContext(EditorContext);
  const form = useRef<HTMLFormElement>(null);
  const sbsc = useRef<Subscription>(new Subscription());
  const item = useRef<HTMLElement>(props.item);
  const [styleValue, setStyleValue] = useState<
    { key: string; value: string }[]
  >(utilis.CreateStyle.GetListFromValue(item.current.getAttribute("style")));
  const isChangedWithMute = useRef<boolean>(false);

  useEffect(() => {
    item.current = props.item;
    isChangedWithMute.current = false;
    setStyleValue(
      utilis.CreateStyle.GetListFromValue(props.item.getAttribute("style"))
    );
  }, [props.item]);

  sbsc.current.unsubscribe();
  sbsc.current = editor.$ObserverSubject.subscribe((ml) => {
    const found = ml.reverse().find((m) => {
      return (
        m.target === item.current &&
        m.type === "attributes" &&
        m.attributeName === "style"
      );
    });
    if (found) {
      setStyleValue(
        utilis.CreateStyle.GetListFromValue(item.current.getAttribute("style"))
      );
    }
  });

  const getViewList = (): { key: string; value: string }[] => {
    if (form.current) {
      return Array.from(form.current.querySelectorAll(".item"))
        .map((wi) => {
          const key = wi.children[0] as HTMLInputElement;
          const value = wi.children[1] as HTMLInputElement;
          return { key: key.value, value: value.value };
        })
        .filter((item) => {
          return item.key && item.value;
        });
    }
    return [];
  };

  const getItemInputs = (
    tar: Element
  ): {
    isNew: boolean;
    key: HTMLInputElement;
    value: HTMLInputElement;
  } | null => {
    const wrap = tar.closest(".item") as HTMLDivElement;
    if (wrap) {
      return {
        isNew: wrap.classList.contains("new"),
        key: wrap.children[0] as HTMLInputElement,
        value: wrap.children[1] as HTMLInputElement,
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

  const muteSet = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ml = editor.ExecMuteCommand(() => {
      item.current.setAttribute(
        "style",
        utilis.CreateStyle.GetValueString(getViewList())
      );
    });
    if (ml?.length) {
      isChangedWithMute.current = true;
      const sitem = getItemInputs(e.target);
      if (sitem && !sitem.isNew) {
        setStyleValue(
          utilis.CreateStyle.GetListFromValue(
            item.current.getAttribute("style")
          )
        );
        if (!e.target.value) {
          saveSet(`delete style ${sitem.key.value}`);
          form.current?.new_key.focus();
        }
      }
    }
  };

  const saveSet = (description: string) => {
    editor.ExecCommand(() => {
      const strVal = utilis.CreateStyle.GetValueString(getViewList());
      if (strVal) {
        item.current.setAttribute("style", strVal);
      } else {
        item.current.removeAttribute("style");
      }
    }, description);
    setStyleValue(getViewList());
    isChangedWithMute.current = false;
  };

  const onBlurForm = (e: React.FocusEvent) => {
    if (isChangedWithMute.current) {
      if (form.current?.contains(e.relatedTarget)) {
        const sitem = getItemInputs(e.target);
        if (sitem) {
          if (sitem.isNew) {
            if (sitem.key.value && sitem.value.value) {
              saveSet(`add style ${sitem.key.value}`);
              clearNewInputs();
            }
          } else {
            saveSet(`change style ${sitem.key.value}`);
          }
        }
      } else {
        saveSet(`save style`);
        clearNewInputs();
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
      className={styles.formStyle}>
      {styleValue.map((style, idx) => {
        return (
          <div className={`item ${styles.wi}`} key={idx}>
            <input
              type="text"
              name={`${idx}_${style.key}`}
              value={style.key}
              onChange={muteSet}
              placeholder="key"
            />
            <input
              type="text"
              name={`${idx}_${style.key}`}
              value={style.value}
              onChange={muteSet}
              placeholder="value"
            />
          </div>
        );
      })}
      <div className={`new item ${styles.wi}`}>
        <input
          autoFocus
          type="text"
          name="new_key"
          defaultValue=""
          onChange={muteSet}
          placeholder="new key"
        />
        <input
          type="text"
          name="new_value"
          defaultValue=""
          onChange={muteSet}
          placeholder="new value"
        />
      </div>
    </form>
  );
};
