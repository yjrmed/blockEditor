import { useContext, useRef, useState, useEffect } from "react";
import { EditorContext } from "../../../App";
import styles from "./style.module.scss";
import { utilis } from "../../../funcs/utlis";

interface IEleStyle {
  item: HTMLElement;
}

export const EleStyle = (props: IEleStyle) => {
  const editor = useContext(EditorContext);
  const form = useRef<HTMLFormElement>(null);
  const item = useRef<HTMLElement>(props.item);
  const [styleValue, setStyleValue] = useState<
    { key: string; value: string }[]
  >(utilis.CreateStyle.GetListFromValue(item.current.getAttribute("style")));

  useEffect(() => {
    const sbsc = editor.$ObserverSubject.subscribe((ml) => {
      const found = ml.reverse().find((m) => {
        return (
          m.target === item.current &&
          m.type === "attributes" &&
          m.attributeName === "style"
        );
      });
      if (found) {
        setStyleValue(
          utilis.CreateStyle.GetListFromValue(
            item.current.getAttribute("style")
          )
        );
      }
    });
    return () => {
      sbsc.unsubscribe();
    };
  }, []);

  useEffect(() => {
    item.current = props.item;
    setStyleValue(
      utilis.CreateStyle.GetListFromValue(props.item.getAttribute("style"))
    );
  }, [props.item]);

  const getCurrentList = (): { key: string; value: string }[] => {
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

  const changeSet = (e: React.ChangeEvent<HTMLInputElement>) => {
    editor.SaverSetCharge();
    const current = getCurrentList();
    item.current.setAttribute(
      "style",
      utilis.CreateStyle.GetValueString(current)
    );
    setStyleValue(current);
  };

  const changeSetNew = (e: React.ChangeEvent<HTMLInputElement>) => {
    editor.SaverSetCharge();
    if (form.current) {
      const _form = form.current;
      if (_form.new_key.value && _form.new_value.value) {
        const current = getCurrentList();
        current.push({
          key: _form.new_key.value,
          value: _form.new_value.value,
        });
        item.current.setAttribute(
          "style",
          utilis.CreateStyle.GetValueString(current)
        );
      }
    }
  };

  const clearNewInputs = () => {
    if (form.current) {
      form.current.new_key.value = "";
      form.current.new_value.value = "";
    }
  };

  const onBlurForm = (e: React.FocusEvent) => {
    if (form.current?.contains(e.relatedTarget)) {
      const _form = form.current;
      if (e.target.classList.contains("new")) {
        if (_form.new_key.value && _form.new_value.value) {
          setStyleValue((pre) => {
            const copy = [...pre];
            copy.push({
              key: _form.new_key.value,
              value: _form.new_value.value,
            });
            editor.SaverFlash(`add style ${_form.new_key.value}`);
            clearNewInputs();
            return copy;
          });
        }
      }
    } else {
      editor.SaverFlash("change style");
      clearNewInputs();
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
              onChange={changeSet}
              placeholder="key"
            />
            <input
              type="text"
              name={`${idx}_${style.key}`}
              value={style.value}
              onChange={changeSet}
              placeholder="value"
            />
          </div>
        );
      })}
      <div className={styles.wi}>
        <input
          className="new"
          type="text"
          name="new_key"
          defaultValue=""
          onChange={changeSetNew}
          placeholder="new key"
        />
        <input
          className="new"
          type="text"
          name="new_value"
          defaultValue=""
          onChange={changeSetNew}
          placeholder="new value"
        />
      </div>
    </form>
  );
};
