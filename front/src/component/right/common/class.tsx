import { useContext, useState, useEffect, useRef } from "react";
import { EditorContext } from "../../../App";
import styles from "./style.module.scss";
import { Subscription } from "rxjs";

interface IEleClass {
  item: HTMLElement;
}

export const EleClass = (props: IEleClass) => {
  const editor = useContext(EditorContext);
  const form = useRef<HTMLFormElement>(null);
  const sbsc = useRef<Subscription>(new Subscription());
  const item = useRef<HTMLElement>(props.item);
  const [classes, setClasses] = useState<string[]>([]);

  useEffect(() => {
    item.current = props.item;
    setClasses(getClassStrs());
  }, [props.item]);

  sbsc.current.unsubscribe();
  sbsc.current = editor.$ObserverSubject.subscribe((ml) => {
    const found = ml.reverse().find((m) => {
      return (
        m.target === item.current &&
        m.type === "attributes" &&
        m.attributeName === "class"
      );
    });
    if (found) {
      setClasses(getClassStrs());
    }
  });

  const getClassStrs = (): string[] => {
    const classVals = item.current.getAttribute("class");
    if (classVals) {
      return classVals.split(" ").map((val) => {
        return val.trim();
      });
    } else {
      return [];
    }
  };

  const onBlur = (e: React.FocusEvent) => {
    const tar = e.relatedTarget as HTMLElement;
    if (tar && form.current?.contains(tar)) {
      return;
    }
    if (form.current) {
      form.current.addItem.value = "";
    }
  };

  const addClass = () => {
    if (form.current) {
      const inputAdd = form.current.addItem;
      if (inputAdd.value) {
        const setVals = new Set(classes);
        const inputVals = (inputAdd.value as string)
          .split(" ")
          .map((val) => {
            return val.trim();
          })
          .filter((val) => {
            return val && !setVals.has(val);
          });

        if (inputVals.length) {
          const newVals = classes.concat(inputVals);
          item.current.setAttribute("class", newVals.join(" "));
        }
        inputAdd.value = "";
      }
    }
  };

  const deleteClass = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const btn = e.target as HTMLButtonElement;
    const newVals = classes.filter((cls) => {
      return cls !== btn.value;
    });
    item.current.setAttribute("class", newVals.join(" "));
  };

  return (
    <form
      ref={form}
      onBlur={onBlur}
      onSubmit={(e) => {
        e.stopPropagation();
        e.preventDefault();
        return false;
      }}
      className={styles.formClass}>
      <div className={styles.labels}>
        {classes.map((item, idx) => {
          return (
            <label htmlFor={`item_${idx}`} key={idx}>
              <button
                type="button"
                id={`item_${idx}`}
                value={item}
                onClick={deleteClass}>
                x
              </button>
              {item}
            </label>
          );
        })}
      </div>

      <div className={styles.new}>
        <input type="text" name="addItem" placeholder="new" />
        <button type="button" onClick={addClass}>
          +
        </button>
      </div>
    </form>
  );
};
