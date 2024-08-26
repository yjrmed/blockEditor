import { useState, useEffect, useRef, createContext, useContext } from "react";
import styles from "./App.module.scss";
import { controller } from "./funcs/controller";
import { Header } from "./component/top/control";
import { Nav } from "./component/left/nav";
import { Aside } from "./component/right/aside";
import { PopEditorWrap } from "./component/float/floatEditor";
import { appEvents } from "./funcs/appEvents";

export const FilerContext = createContext<controller.FileController>(
  new controller.FileController()
);

export const EditorContext = createContext<controller.EditController>(
  new controller.EditController()
);

function App() {
  const editor = useContext(EditorContext);
  const filer = useContext(FilerContext);
  const [post, setPost] = useState();
  const [article, setArticle] = useState<controller.IPostItem | null>(null);

  const wrapLayer = useRef(null);
  const layer = useRef(null);

  useEffect(() => {
    new appEvents.AppKeyEvent(editor);
    async function loadPosts() {
      const response = await fetch("test.data");
      if (!response.ok) {
        return;
      }
      const post = await response.json();
      setPost(post);
    }
    loadPosts();
  }, []);

  useEffect(() => {
    const article = document.querySelector("article");
    if (article) {
      editor.Initialization(article);
    }
  });

  return (
    <div className={styles.App}>
      <EditorContext.Provider value={editor}>
        <FilerContext.Provider value={filer}>
          <Header setPost={setArticle} />
        </FilerContext.Provider>
        <div className={styles.containerFlex}>
          <Nav />
          {post && (
            <div ref={wrapLayer} className={styles.containerEdit}>
              <article ref={layer}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: post["title"]["rendered"],
                  }}></div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: post["content"]["rendered"],
                  }}></div>
              </article>
              <PopEditorWrap RelativeWrap={wrapLayer} />
            </div>
          )}
          <Aside />
        </div>
      </EditorContext.Provider>
    </div>
  );
}

export default App;
