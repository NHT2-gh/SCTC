import { useState, useLayoutEffect } from "react";

// ----------------------------------------------------------------------

interface WindowSize {
  width: number;
  height: number;
}

const useWindowSize = (): WindowSize => {
  const [size, setSize] = useState<WindowSize>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    function updateSize(): void {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  return size;
};

export default useWindowSize;
