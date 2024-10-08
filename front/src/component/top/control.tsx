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
  }, [props.post]);

  const importLayer = () => {
    const path = prompt(
      "path to post",
      "https://directforce.image-w2.jp/DF2022/member/essay/2024/__e419.html"
    )?.trim();
    if (path) {
      filer.ImportDoc(path, () => {
        // close dialog;
      });
    }
  };

  const exportLayer = () => {
    if (editor.Layer) {
      editor.SetSelect(null);
      filer.ExportHtml(editor.Layer);
    }
  };

  const uploadLayer = () => {
    if (filer.Post) {
      filer.UploadDoc(() => {
        console.log("upload callback");
      });
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <button onClick={importLayer}>Import</button>
        {post && (
          <>
            <StyleSheet styles={post.styles} />
            <div className={styles.title}>
              <ArticleTitle head={post.head} />
            </div>
            <button onClick={uploadLayer}>Upload</button>
            <button onClick={exportLayer}>Export</button>
          </>
        )}
      </div>
    </header>
  );
};
