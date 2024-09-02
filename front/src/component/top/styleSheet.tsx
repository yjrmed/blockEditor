import styles from "./style.module.scss";
import { useState, useContext } from "react";
import { FilerContext } from "../../App";

export const FormStyleSheet = () => {
  const filer = useContext(FilerContext);

  const [links, setLinks] = useState<{ href: string; disabled: boolean }[]>(
    filer.GetCurrentStyles()
  );

  const onClickAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    const path = prompt("path to stylesheet")?.trim();
    if (path) {
      const found = links.find((link) => link.href === path);
      if (!found) {
        filer.ImportStyle(path);
      }
    }
  };

  const onChangeCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cb = e.target as HTMLInputElement;
    const strLink = cb.parentElement?.querySelector("label")?.textContent;
    if (strLink) {
      const found = document.head.querySelector(
        `link[rel="stylesheet"][data-wcms][href="${strLink}"]`
      );
      if (found instanceof HTMLLinkElement) {
        found.disabled = !(e.target as HTMLInputElement).checked;
        setLinks(filer.GetCurrentStyles());
      }
    }
  };

  const onClickDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.target as HTMLButtonElement;
    const strLink = btn.parentElement?.querySelector("label")?.textContent;
    if (strLink) {
      const found = document.head.querySelector(
        `link[rel="stylesheet"][data-wcms][href="${strLink}"]`
      );
      if (found) {
        found.remove();
        setLinks(filer.GetCurrentStyles());
      }
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.stopPropagation();
        e.preventDefault();
        return false;
      }}
      className={styles.formStyleSheet}>
      {links.length > 0 && (
        <ul>
          {links.map((link, idx) => {
            return (
              <li key={idx}>
                <input
                  checked={!link.disabled}
                  onChange={onChangeCheck}
                  id={`id_${idx}`}
                  type="checkBox"
                />
                <label htmlFor={`id_${idx}`}>{link.href}</label>
                <button onClick={onClickDelete}>&times;</button>
              </li>
            );
          })}
        </ul>
      )}
      <button onClick={onClickAdd}>add</button>
    </form>
  );
};
