import { useContext, useState } from "react";
import { FilerContext } from "../../App";
import styles from "./style.module.scss";

// 記事を再読み込みするとタイトルが変更されない。

export const ArticleTitle = () => {
  const filer = useContext(FilerContext);
  const [title, setTitle] = useState<string>(
    filer.Post?.head.title ? filer.Post.head.title : ""
  );

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (filer.Post?.head.title) {
      filer.Post.head.title = e.target.value;
      setTitle(filer.Post.head.title);
    }
  };

  return (
    <>
      {filer.Post && (
        <h1 className={styles.articleTitle}>
          <input type="text" onChange={onChangeTitle} value={title} />
        </h1>
      )}
    </>
  );
};
