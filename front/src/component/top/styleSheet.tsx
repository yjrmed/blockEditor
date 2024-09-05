import styles from "./style.module.scss";
import { useState, useEffect, useContext } from "react";
import DropDown from "../utils/dropdown";
import { FilerContext } from "../../App";
import { controller } from "../../funcs/controller";

interface IStyleSheet {
  styles: string[];
}

export const StyleSheet = (props: IStyleSheet) => {
  const filer = useContext(FilerContext);
  const [defaults, setDefaults] = useState<
    { href: string; imported: boolean }[]
  >([]);

  // const [links, setLinks] = useState<{ href: string; disabled: boolean }[]>(
  //   filer.GetCurrentStyles()
  // );

  useEffect(() => {
    setDefaults((pre) => {
      return props.styles.map((style) => {
        return { href: style, imported: false };
      });
    });
  }, [props]);

  const onClickImport = (e: React.MouseEvent<HTMLInputElement>) => {
    const tar = e.target as HTMLInputElement;
    filer.ImportStyle(tar.value);
  };

  // const onClickAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   const path = prompt("path to stylesheet")?.trim();
  //   if (path) {
  //     const found = links.find((link) => link.href === path);
  //     if (!found) {
  //       filer.ImportStyle(path);
  //     }
  //   }
  // };

  // const onChangeCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const cb = e.target as HTMLInputElement;
  //   const strLink = cb.parentElement?.querySelector("label")?.textContent;
  //   if (strLink) {
  //     const found = document.head.querySelector(
  //       `link[rel="stylesheet"][data-wcms][href="${strLink}"]`
  //     );
  //     if (found instanceof HTMLLinkElement) {
  //       found.disabled = !(e.target as HTMLInputElement).checked;
  //       setLinks(filer.GetCurrentStyles());
  //     }
  //   }
  // };

  // const onClickDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   const btn = e.target as HTMLButtonElement;
  //   const strLink = btn.parentElement?.querySelector("label")?.textContent;
  //   if (strLink) {
  //     const found = document.head.querySelector(
  //       `link[rel="stylesheet"][data-wcms][href="${strLink}"]`
  //     );
  //     if (found) {
  //       found.remove();
  //       setLinks(filer.GetCurrentStyles());
  //     }
  //   }
  // };

  return (
    <DropDown className="test">
      <DropDown.Button txt="StyleSeet" className={styles.dropButton} />
      <DropDown.Body>
        <form className={styles.formStyleSheet}>
          {defaults.length > 0 && (
            <div className={styles.origins}>
              <label> import origins</label>
              <ul>
                {defaults.map((link, idx) => {
                  return (
                    <li key={idx}>
                      <input
                        id={`id_${idx}`}
                        type="button"
                        value={link.href}
                        disabled={link.imported}
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
    // <form
    //   onSubmit={(e) => {
    //     e.stopPropagation();
    //     e.preventDefault();
    //     return false;
    //   }}
    //   className={styles.formStyleSheet}>
    //   {links.length > 0 && (
    //     <ul>
    //       {links.map((link, idx) => {
    //         return (
    //           <li key={idx}>
    //             <input
    //               checked={!link.disabled}
    //               onChange={onChangeCheck}
    //               id={`id_${idx}`}
    //               type="checkBox"
    //             />
    //             <label htmlFor={`id_${idx}`}>{link.href}</label>
    //             <button onClick={onClickDelete}>&times;</button>
    //           </li>
    //         );
    //       })}
    //     </ul>
    //   )}
    //   <button onClick={onClickAdd}>add</button>

    //   {defaults.length > 0 && (
    //     <ul>
    //       {defaults.map((link, idx) => {
    //         return (
    //           <li key={idx}>
    //             <input
    //               onChange={onChangeCheck}
    //               id={`id_${idx}`}
    //               type="checkBox"
    //             />
    //             <label htmlFor={`id_${idx}`}>{link.href}</label>
    //             <button onClick={onClickDelete}>&times;</button>
    //           </li>
    //         );
    //       })}
    //     </ul>
    //   )}
    // </form>
  );
};
