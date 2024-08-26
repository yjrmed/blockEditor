import React, { useRef, createContext, useState, useContext } from "react";
import styles from "./style.module.scss";

interface DropDownProps {
  className?: string;
  children: React.ReactNode;
}

interface DropButtonProps {
  txt: string;
  className?: string;
  disabled?: boolean;
}

interface DropBodyProps {
  children: React.ReactNode;
}

// children 要素からDropDownを閉じたい場合は、context を参照させる。

export const DropdownContext = createContext<{
  isOpen: boolean;
  setStateOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isOpen: false,
  setStateOpen: () => {},
});

export const DropDown = (props: DropDownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const tar = event.relatedTarget as HTMLElement;
    if (tar && dropdownRef.current?.contains(tar)) {
      return;
    }
    setIsOpen(false);
  };
  return (
    <DropdownContext.Provider
      value={{
        isOpen: isOpen,
        setStateOpen: setIsOpen,
      }}>
      <div
        className={`${props.className} ${styles.dropDown}`}
        ref={dropdownRef}
        onBlur={handleBlur}
        tabIndex={0}>
        {props.children}
      </div>
    </DropdownContext.Provider>
  );
};

const DropButton = (props: DropButtonProps) => {
  const context = useContext(DropdownContext);
  return (
    <button
      className={`${props.className} ${styles.dropButton}`}
      disabled={props.disabled}
      onClick={() => {
        context.setStateOpen(!context.isOpen);
      }}>
      {props.txt}
    </button>
  );
};

const DropBody = (props: DropBodyProps) => {
  const context = useContext(DropdownContext);
  return <>{context.isOpen && props.children}</>;
};

DropDown.Button = DropButton;
DropDown.Body = DropBody;
export default DropDown;
