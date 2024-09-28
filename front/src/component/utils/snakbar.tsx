import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import styles from "./style.module.scss";

interface SnackbarHandles {
  show: (message: string, duration: number) => void;
}

export const useSnackbar = () => {
  const snackbarRef = useRef<SnackbarHandles>(null);
  const showSnackbar = useCallback((message: string, duration = 2000) => {
    snackbarRef.current && snackbarRef.current.show(message, duration);
  }, []);
  return {
    snackbarRef,
    showSnackbar,
  };
};

interface IMmessage {
  message: string;
  duration: number;
}

export const Snackbar = forwardRef<SnackbarHandles, {}>((_, ref) => {
  const [messages, setMessages] = useState<IMmessage[]>([]);

  useImperativeHandle(
    ref,
    () => ({
      show: (_message, _duration) => {
        setMessages((prevItems) => [
          ...prevItems,
          { message: _message, duration: _duration },
        ]);
      },
    }),
    []
  );

  useEffect(() => {
    if (messages.length) {
      const timer = setTimeout(() => {
        setMessages((prevItems) => prevItems.slice(1));
      }, messages[0].duration);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [messages]);

  return (
    <>
      {messages.length !== 0 && (
        <div className={styles.snackbar}>
          <p>{messages[0].message}</p>
        </div>
      )}
    </>
  );
});

Snackbar.displayName = "Snackbar";
