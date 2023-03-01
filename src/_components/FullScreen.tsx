import { useRef, useEffect, memo } from "react";
import screenfull from "screenfull";

interface IFullScreenProps {
  onChange(isFullScreen: boolean): void;
  onError(): void;
  forceFullScreen: boolean;
  children(x: any): any
}

const FullScreen = ({ children, onChange, onError, forceFullScreen }: IFullScreenProps) => {

  const ref = useRef<HTMLElement>();

  const changeHandler = () => {
    if (onChange) {
      onChange(screenfull.isFullscreen);
    }
  }

  const errorHandler = () => {
    if (onError) {
      onError();
    }
  }
  
  useEffect(() => {
    screenfull.onchange(changeHandler);
    screenfull.on("error", errorHandler);

    return () => {
      // unscubscribe on unmount
      screenfull.off("error", errorHandler);
      screenfull.off("change", changeHandler);
    }
  }, [screenfull]);

  useEffect(() => {
    if (forceFullScreen) {
      if (screenfull.isEnabled) {
        try {
          screenfull.request(ref.current);
        }
        catch (error) {
          console.log(error);
        }
      }
      return;
    }
  }, [forceFullScreen]);

  return children({
    ref,
    isEnabled: screenfull.isEnabled,
    onToggle: () => {
      screenfull.toggle(ref.current);
    },
    onRequest: () => {
      screenfull.request(ref.current);
    },
    onExit: () => {
      screenfull.exit();
    },
  });
};

export default memo(FullScreen);
