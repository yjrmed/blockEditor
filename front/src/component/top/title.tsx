import { useContext, useState, useEffect } from "react";
import { FilerContext } from "../../App";
import styles from "./style.module.scss";
import { controller } from "../../funcs/controller";

interface IArticleTitle {
  head: controller.IPostHead;
}

export const ArticleTitle = (props: IArticleTitle) => {
  const filer = useContext(FilerContext);
  const [title, setTitle] = useState<string | null>(props.head.title);

  useEffect(() => {
    setTitle(props.head.title);
  }, [props]);

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (filer.Post) {
      filer.Post.head.title = e.target.value;
      setTitle(props.head.title);
    }
  };

  return (
    <h1 className={styles.articleTitle}>
      <input type="text" onChange={onChangeTitle} value={title ? title : ""} />
    </h1>
  );
};
