import { getCanvasFont, getCssStyle, getTextWidth } from "../_helpers/measureText";
import { IIntelliValue, IPart, ITerm, _separator } from "./types";

// return the actual term in value.terms... use cursor pos to identify this & string
export const findTermFromSelection = (
  sel: string,
  pos: number,
  value: IIntelliValue
): { term: ITerm; part: IPart } | undefined => {
  const val = value;

  if (val.terms.length == 0) return;

  const txt = sel.trim();
  // if (txt) {
  //   console.log("sel txt: ", txt);
  // }
  const termIndex = getCurrentTermForSelection(pos, txt, value);
  if (termIndex === undefined) {
    return;
  }

  const index = Math.min(termIndex, val.terms.length - 1);
  // console.log(`index ${index} terms.length ${value.terms?.length}}`);
  const term = val.terms[index];

  if (!term.selectedParts) {
    term.selectedParts = [];
  }

  let part = term.selectedParts.find((x) => x.phrase === txt);
  if (!part) {
    part = { phrase: txt, alternatives: [] };
    term.selectedParts.push(part);
  }

  return { term, part };
};

export const getPosX = (query: HTMLElement, charOffset: number, value: IIntelliValue): number => {
  const padding = parseFloat(getCssStyle(query, "padding"));
  const textWidth = getTextWidth(value.rawText.slice(0, charOffset), getCanvasFont(query));
  const termIndex = getCurrentTermIndex(charOffset, value);
  const wordIndex = getCurrentWordIndex(charOffset, value);

  const inTerm = (offset: number, index: number) => {
    if (offset === undefined || (value.terms?.length || 0) === 0 || index > value.terms.length - 1)
      return false;
    // console.log(
    //   `in term: offset ${offset} > ${value.terms[index].offset} && < ${
    //     value.terms[index].offset + value.terms[index].term.length
    //   }`
    // );
    return (
      offset > value.terms[index].offset &&
      offset < value.terms[index].offset + value.terms[index].term.length
    );
  };

  // console.log(
  //   `charOffset ${charOffset} termindex ${termIndex} padding ${padding} wordIndex ${wordIndex}`
  // );
  const spanPadding = 2;
  const wordPadding = wordIndex > 0 ? (wordIndex - 1) * spanPadding + 1 : 1;
  const isInTerm = inTerm(charOffset, termIndex);
  const termPadding = (termIndex + 1 - (isInTerm ? 0 : 1)) * spanPadding;
  // const termPadding =
  //   termIndex > 0
  //     ? (termIndex - (isInTerm ? 0 : 1)) * spanPadding + 1
  //     : 1;

  // console.log(
  //   `isInTerm ${isInTerm} textWidth ${textWidth} termpadding ${termPadding} wordPadding ${wordPadding} scrollLeft ${query.scrollLeft}`
  // );

  // console.log(`posx ${textWidth + termPadding + padding + wordPadding - query.scrollLeft}`);

  return textWidth + termPadding + padding + wordPadding - query.scrollLeft; // multiply span padding by index of current term in all terms
};

// exported for unit test only
// return 0 indexed term
export const getCurrentTermIndex = (pos: number, value: IIntelliValue): number => {
  let length = 0;
  let i = 0;
  for (let index = 0; index < value.terms.length; index++) {
    const element = value.terms[index];
    length += element.term.length + 1; // add space at end of term
    if (length < pos) {
      i++;
    } else {
      return i;
    }
    // length++; // add space between terms
  }
  return i;
};

// a word is quote mark or actual word
// exported just for unit testing... ( could use rewire package instead )
// pos is 0 based
export const getCurrentWordIndex = (pos: number, value: IIntelliValue): number => {
  let length = 0;
  let i = 0;
  
  for (let index = 0; index < value.terms.length; index++) {
    const element = value.terms[index];
    length += element.term.length;
    
    if (index > 0) length++; // space between terms
    const words = element.term?.split(/ |"/); // space ( _separator) or quote

    if (length <= pos) {
      i += words.length;
    } else {
      let wordCount = 0;
      length -= element.term.length;
  
      for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
        const word = words[wordIndex];
        length += word.length === 0 ? 1 : word.length; // length is 0 where quote so add 1
        if (wordIndex > 0 && words[wordIndex - 1].length > 0) {
          // add space
          length += 1;
        }
        if (length <= pos) {
          wordCount++;
        } else {
          break;
        }
      }
      return i + wordCount;
    }
  }
  return i;
};

// checks the selection string is within the found term and returns undefined if not
const getCurrentTermForSelection = (
  pos: number,
  selection: string,
  value: IIntelliValue
): number | undefined => {
  const val = value;
  if (val.terms.length === 0 || !selection) {
    return;
  }

  let length = 0;
  let i = 0;
  for (let index = 0; index < val.terms.length; index++) {
    const element = val.terms[index];
    length += element.term.length;
    if (length < pos) {
      i++;
      length++; // add for the space between terms
    } else {
      if (val.terms[i] && val.terms[i].term.indexOf(selection) !== -1) {
        // ensure only return the index if whole word(s) selected
        const termWords = val.terms[i].term.replaceAll('"', "").split(_separator);
        const selectionWords = selection.split(_separator);

        let found = 0;
        selectionWords.forEach((s) => {
          for (let wi = 0; wi < termWords.length; wi++) {
            const element = termWords[wi];
            if (element === s) {
              found++;
              break;
            }
          }
        });
        if (selectionWords.length === found) return i;
      }
      return;
    }
  }
  return;
};
