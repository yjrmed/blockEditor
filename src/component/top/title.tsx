import { useContext, useState } from "react";
import { FilerContext } from "../../App";
import styles from "./style.module.scss";

export const ArticleTitle = () => {
  const filer = useContext(FilerContext);
  const [title, setTitle] = useState<string>(
    filer.Post ? filer.Post.title : ""
  );

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (filer.Post) {
      filer.Post.title = e.target.value;
      setTitle(filer.Post.title);
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
