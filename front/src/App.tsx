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
  const [post, setPost] = useState<controller.IPostItem | null>(null);
  const editor = useContext(EditorContext);
  const filer = useContext(FilerContext);
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    new appEvents.AppKeyEvent(editor);
    if (layer.current) {
      editor.Initialization(layer.current);
    }

    const sbsc = filer.$PostChange.subscribe((res) => {
      setPost(res);
      if (res?.article) {
        editor.SetArticle(res.article);
      }
    });

    return () => {
      sbsc.unsubscribe();
    };
  }, []);

  return (
    <div className={styles.App}>
      <EditorContext.Provider value={editor}>
        <FilerContext.Provider value={filer}>
          <Header post={post} />
        </FilerContext.Provider>
        <div className={styles.containerFlex}>
          <Nav />
          <div className={styles.containerEdit}>
            <div ref={layer}></div>
            <PopEditorWrap />
          </div>
          <Aside />
        </div>
      </EditorContext.Provider>
    </div>
  );
}

export default App;
