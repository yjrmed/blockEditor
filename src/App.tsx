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
  const [article, setArticle] = useState<controller.IPostItem | null>(null);
  const wrapLayer = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    new appEvents.AppKeyEvent(editor);
    if (layer.current) {
      editor.Initialization(layer.current);
    }
  }, []);

  useEffect(() => {
    if (layer.current && article) {
      editor.SetArticle(article.article);
    }
  }, [article]);

  return (
    <div className={styles.App}>
      <EditorContext.Provider value={editor}>
        <FilerContext.Provider value={filer}>
          <Header setPost={setArticle} />
        </FilerContext.Provider>
        <div className={styles.containerFlex}>
          <Nav />
          <div ref={wrapLayer} className={styles.containerEdit}>
            <div ref={layer}></div>
            <PopEditorWrap RelativeWrap={wrapLayer} />
          </div>
          <Aside />
        </div>
      </EditorContext.Provider>
    </div>
  );
}

export default App;
