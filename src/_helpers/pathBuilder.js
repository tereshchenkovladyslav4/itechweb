export function pathBuilder(names) {
  let paths = names.map((x) => {
    if (x.startsWith("/")) {
      return x = `${x.toLowerCase().replace(/ /g, "_")}`;
    } else {
      return x = `/${x.toLowerCase().replace(/ /g, "_")}`;
    }
  });

  return encodeURI(paths.join(""));
}
