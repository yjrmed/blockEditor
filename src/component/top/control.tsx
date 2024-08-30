import styles from "./style.module.scss";
import { useContext } from "react";
import { EditorContext, FilerContext } from "../../App";
import { controller } from "../../funcs/controller";
import DropDown from "../utils/dropdown";
import { FormStyleSheet } from "./styleSheet";
import { ArticleTitle } from "./title";

interface ISetter {
  setPost: React.Dispatch<React.SetStateAction<controller.IPostItem | null>>;
}

export const Header = (props: ISetter) => {
  const editor = useContext(EditorContext);
  const filer = useContext(FilerContext);
  const importLayer = () => {
    // サーバー側で取りにいかないと cors エラー
    const path = prompt(
      "path to post",
      "http://localhost:3000/testHtml/e420.html"
    )?.trim();
    if (path) {
      filer.ImportDoc(path, (post: controller.IPostItem | null) => {
        if (post) {
          props.setPost(post);
        }
      });
    }
  };

  const exportLayer = () => {
    if (editor.Layer) {
      editor.SetSelect(null);
      filer.ExportHtml(editor.Layer);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <button onClick={importLayer}>Import</button>
        <DropDown className="test">
          <DropDown.Button txt="StyleSeet" className={styles.dropButton} />
          <DropDown.Body>
            <FormStyleSheet />
          </DropDown.Body>
        </DropDown>

        <div className={styles.title}>{filer.Post && <ArticleTitle />}</div>

        <button onClick={exportLayer}>Export</button>
      </div>
    </header>
  );
};
