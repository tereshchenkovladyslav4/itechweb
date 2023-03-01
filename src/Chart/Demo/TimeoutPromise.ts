export  const setTimeoutAsync = (cb:()=>void, delay:number):Promise<void> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(cb());
    }, delay);
  });