import { Outline } from "./outline";
import { Timeline } from "./timeline";
import { FoldableBox } from "../utils/foldableBox";
import styles from "./style.module.scss";

// 複数ページ（faile）などができれば、

export const Nav = () => {
  return (
    <nav className={styles.leftNav}>
      <div className={styles.inner}>
        <FoldableBox title="outline">
          <Outline />
        </FoldableBox>
        <FoldableBox title="timeline">
          <Timeline />
        </FoldableBox>
      </div>
    </nav>
  );
};
