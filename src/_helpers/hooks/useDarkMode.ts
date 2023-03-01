import { useEffect, useState } from "react";

interface IUseDarkMode{
  setChanged?:(mode:string) => void;
}

export const useDarkMode = ({setChanged}:IUseDarkMode ={}): [string, ()=>void, boolean] => {
  const [theme, setTheme] = useState(window.localStorage.getItem("theme") || "dark");
  const [componentMounted, setComponentMounted] = useState(false);

  const setMode = (mode:string) => {
    window.localStorage.setItem("theme", mode);
    setTheme(mode);
    if(setChanged){
      // the function passed in would need to be a state function on App to cause a re-render
      setChanged(mode);
    }else{
      // refresh without a reload
      // eslint-disable-next-line no-self-assign
      window.location = window.location;
    }
  };

  const toggleTheme = () => { 
    if (theme === "light") {
      setMode("dark");
    } else {
      setMode("light");
    }
  };

  useEffect(() => {
    const localTheme = window.localStorage.getItem("theme");
    // ignore browser prefs - as want a default of "dark"
    // window.matchMedia &&
    // window.matchMedia("(prefers-color-scheme: light)").matches &&
    !localTheme
      ? setMode("dark")
      : localTheme
      ? setTheme(localTheme)
      : setMode("light");
    setComponentMounted(true);
  }, []);

  return [theme, toggleTheme, componentMounted];
};
