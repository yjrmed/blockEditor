import styles from "./style.module.scss";
import { useState, useEffect, useContext } from "react";
import DropDown from "../utils/dropdown";
import { FilerContext } from "../../App";
import { fromEvent } from "rxjs";

interface IStyleSheet {
  styles: string[];
}

interface ILinks {
  link: string;
  org: string;
  disabled: boolean;
}

export const StyleSheet = (props: IStyleSheet) => {
  const filer = useContext(FilerContext);
  const [defaults, setDefaults] = useState<string[]>(props.styles);
  useEffect(() => {
    setDefaults(props.styles);
  }, [props.styles]);
  const getCurrent = (): ILinks[] => {
    return Array.from(document.head.querySelectorAll("link[data-org]")).map(
      (link) => {
        const _link = link as HTMLLinkElement;
        return {
          link: _link.href,
          org: _link.getAttribute("data-org"),
          disabled: _link.disabled,
        } as ILinks;
      }
    );
  };
  const [currents, setCurrents] = useState<ILinks[]>(getCurrent());

  useEffect(() => {
    const sbsc = fromEvent(document.head, "change").subscribe((e) => {
      console.log(e);
    });
    return () => {
      sbsc.unsubscribe();
    };
  }, []);

  const onClickImport = (e: React.MouseEvent<HTMLInputElement>) => {
    const tar = e.target as HTMLInputElement;
    filer.ImportStyle(tar.value, () => {
      setCurrents(getCurrent());
    });
  };

  const onChangeCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cb = e.target as HTMLInputElement;
    const strLink = cb.parentElement?.querySelector("label")?.textContent;
    if (strLink) {
      const found = document.head.querySelector(
        `link[rel="stylesheet"][data-org="${strLink}"]`
      );
      if (found instanceof HTMLLinkElement) {
        found.disabled = !(e.target as HTMLInputElement).checked;
        setCurrents(getCurrent());
      }
    }
  };

  const onClickDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.target as HTMLButtonElement;
    const strLink = btn.parentElement?.querySelector("label")?.textContent;
    if (strLink) {
      const found = document.head.querySelector(
        `link[rel="stylesheet"][data-org="${strLink}"]`
      );
      if (found) {
        found.remove();
        setCurrents(getCurrent());
      }
    }
  };

  return (
    <DropDown className="test">
      <DropDown.Button txt="StyleSeet" className={styles.dropButton} />
      <DropDown.Body>
        <form
          className={styles.formStyleSheet}
          onSubmit={(e) => {
            e.stopPropagation();
            e.preventDefault();
            return false;
          }}>
          {currents.length > 0 && (
            <div className={styles.currents}>
              <label>imported</label>
              <ul>
                {currents.map((link, idx) => {
                  return (
                    <li key={idx}>
                      <input
                        checked={!link.disabled}
                        onChange={onChangeCheck}
                        id={`id_${idx}`}
                        type="checkBox"
                      />
                      <label htmlFor={`id_${idx}`}>{link.org}</label>
                      <button onClick={onClickDelete}>&times;</button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {defaults.length > 0 && (
            <div className={styles.origins}>
              <label>import origins</label>
              <ul>
                {defaults.map((link, idx) => {
                  return (
                    <li key={idx}>
                      <input
                        id={`id_${idx}`}
                        type="button"
                        value={link}
                        disabled={Boolean(
                          currents.find((_link) => {
                            return _link.org === link;
                          })
                        )}
                        onClick={onClickImport}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </form>
      </DropDown.Body>
    </DropDown>
  );
};
