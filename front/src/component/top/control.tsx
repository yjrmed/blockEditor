import styles from "./style.module.scss";
import { useContext, useEffect, useState } from "react";
import { EditorContext, FilerContext } from "../../App";

import { StyleSheet } from "./styleSheet";
import { ArticleTitle } from "./title";
import { controller } from "../../funcs/controller";

interface IHeader {
  post: controller.IPostItem | null;
}

export const Header = (props: IHeader) => {
  const editor = useContext(EditorContext);
  const filer = useContext(FilerContext);
  const [post, setPost] = useState<controller.IPostItem | null>(null);

  useEffect(() => {
    setPost(props.post);
  }, [props]);

  const importLayer = () => {
    const path = prompt(
      "path to post",
      "https://directforce.image-w2.jp/DF2022/member/essay/2024/e419.html"
    )?.trim();
    if (path) {
      filer.ImportDoc(path);
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
        <StyleSheet styles={post ? post.styles : []} />
        <div className={styles.title}>{filer.Post && <ArticleTitle />}</div>
        <button onClick={exportLayer}>Export</button>
      </div>
    </header>
  );
};
