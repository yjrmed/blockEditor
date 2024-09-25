import { useState, useEffect, useRef, createContext, useContext } from "react";
import styles from "./App.module.scss";
import { controller } from "./funcs/controller";
import { Header } from "./component/top/control";
import { Nav } from "./component/left/nav";
import { Aside } from "./component/right/aside";
import { PopEditorWrap } from "./component/float/floatEditor";
import { Snackbar, useSnackbar } from "./component/utils/snakbar";
import { appEvents } from "./funcs/appEvents";
import { Subscription } from "rxjs";

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

  const { snackbarRef, showSnackbar } = useSnackbar();

  useEffect(() => {
    new appEvents.AppEvent(editor);
    if (layer.current) {
      editor.Initialization(layer.current);
      showSnackbar("initialization");
    }

    const sbsc = new Subscription();
    sbsc.add(
      filer.$PostChange.subscribe((res) => {
        setPost(res);
        if (res?.article) {
          editor.SetArticle(res.article);
        }
      })
    );
    sbsc.add(
      filer.$FilerMessage.subscribe((res) => {
        showSnackbar(res);
      })
    );

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
            <div id={filer.ScopeID} className={styles.layer} ref={layer}></div>
            <PopEditorWrap />
          </div>
          <Aside />
        </div>
        <Snackbar ref={snackbarRef} />
      </EditorContext.Provider>
    </div>
  );
}

export default App;
