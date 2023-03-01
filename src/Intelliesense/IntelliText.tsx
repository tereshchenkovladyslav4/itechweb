import React from "react";
import { useStyles } from "./Intellisense.style";
import {
  IIntelliValue,
  IPart,
  ISelectedText,
  ITerm,
  operators,
  _queryId,
  _separator,
} from "./types";
import clsx from "clsx";
import { findTermFromSelection, getPosX } from "./intellisenseUtils";
import { Tooltip, Typography } from "@mui/material";
import { TinyButton } from "../_components/TinyButton";

interface IIntelliTextProps {
  value: IIntelliValue;
  selectedText?: ISelectedText;
  setSelectedText: React.Dispatch<React.SetStateAction<ISelectedText | undefined>>;
  getAlternativePhrases: (part: IPart) => void;
  removeTerm: (term: ITerm) => void;
}

const IntelliText: React.FC<IIntelliTextProps> = ({
  value,
  selectedText,
  setSelectedText,
  getAlternativePhrases,
  removeTerm,
}) => {
  const lastTerm = value.terms.length ? value.terms[value.terms.length - 1] : undefined;
  let remainingText = undefined;
  if (lastTerm) {
    const index = value.rawText.lastIndexOf(lastTerm.term);
    if (index !== -1) {
      remainingText = value.rawText.substring(index + lastTerm.term.length);
    }
  } else {
    // return <span style={{display:"inline-block", height:"1em"}}></span>;
    return <span>&#8203;</span>;
  }
  return (
    <>
      {value.terms?.map((t, i) => (
        <React.Fragment key={i}>
          {/* will only show one space even if multiple typed */}
          {i > 0 ? <span> </span> : null}
          <RenderTerm
            term={t}
            value={value}
            selectedText={selectedText}
            setSelectedText={setSelectedText}
            getAlternativePhrases={getAlternativePhrases}
            removeTerm={removeTerm}
          />
        </React.Fragment>
      ))}
      {remainingText && <span>{remainingText}</span>}
    </>
  );
};

// span per word in the term
const RenderTerm = (props: {
  term: ITerm;
  value: IIntelliValue;
  selectedText?: ISelectedText;
  setSelectedText: React.Dispatch<React.SetStateAction<ISelectedText | undefined>>;
  getAlternativePhrases: (part: IPart) => void;
  removeTerm:  (term: ITerm) => void;
}) => {
  const classes = useStyles();

  let phrase = props.term.term;
  if(phrase?.length > 1 && phrase?.startsWith('"') && phrase?.endsWith('"')){
    // a quoted term so remove the quotes as these a rendered separately
    phrase = props.term.term.slice(1, -1);
  }
  const words = phrase?.split(_separator);
  const colorClasses = [
    "", //classes.altColor0,
    classes.altColor1,
    classes.altColor2,
    classes.altColor3,
    classes.altColor4,
    classes.altColor5,
  ];

  const isQuoted = phrase?.length < props.term.term?.length;
  const isHighlighted = (word: string) => {
    if (props.selectedText?.text && selectionInCurrentTerm()) {
      const selection = props.selectedText.text.split(_separator);

      if (selection.length === 1) {
        return props.selectedText?.text === word;
      }
      return props.selectedText.text.indexOf(word) !== -1;
    }
    return false;
  };

  const getWordClassNames = (word: string): string => {
    const classNames = [classes.word];

    let colorIndex = 0;
    if (props.term.selectedParts) {
      for (let index = 0; index < props.term.selectedParts.length; index++) {
        const element = props.term.selectedParts[index];
        if (
          element?.phrase.indexOf(word) !== -1 &&
          (element?.alternatives?.length || 0) > 0 &&
          element.alternatives?.some((x) => x.selected)
        ) {
          colorIndex++;
        }
      }
    }
    classNames.push(colorClasses[Math.min(colorIndex, colorClasses.length - 1)]);
    if (isHighlighted(word)) classNames.push(classes.highlight);

    return clsx(classNames);
  };

  // for the space between words in multi word "phrase"
  const isMultiPartWithAlternatives = (word: string) => {
    if (props.term.selectedParts) {
      let colorIndex = 0;
      const currTermHasSelection = selectionInCurrentTerm();
      const isPhraseSelection =
        props.selectedText && props.selectedText.text.indexOf(_separator) !== -1;

      for (let index = 0; index < props.term.selectedParts.length; index++) {
        const element = props.term.selectedParts[index];
        const splitPhrase = element.phrase.split(_separator);
        // can be highlighted without having alternatives..
        if (splitPhrase[0] !== word) {
          if (
            isPhraseSelection &&
            currTermHasSelection &&
            props.selectedText &&
            props.selectedText.text.indexOf(word) > 0 // don't highlight space before 1st selected word
          ) {
            return classes.highlight;
          }
          if (
            element.phrase.indexOf(word) !== -1 &&
            (element.alternatives?.length || 0) > 0 &&
            element.alternatives?.some((x) => x.selected)
          ) {
            if (splitPhrase.length > 1) {
              colorIndex++;
              return colorClasses[Math.min(colorIndex, colorClasses.length - 1)];
            }
          }
        }
      }
    }
    // console.log(`no highlight word: ${word} sel: ${props?.selectedText?.text}`);

    return "";
  };

  const setAlternative = (word: string) => {
    // ignore if still typing / autocomplete not showing
    if (document.getElementById("autocomplete")) return;

    // console.log(`selectedText: ${props.selectedText?.text}`);

    // ignore if already displaying a phrase alternatives
    if (props.selectedText?.text && props.selectedText.text.indexOf(_separator) !== -1) return;

    const pos = getCaretPos(word);
    const selectedTerm = findTermFromSelection(word, pos, props.value);
    const element = document.getElementById(_queryId);
    const elementPos = element?.getBoundingClientRect();
    let caret;
    if (elementPos && element) {
      const textWidth = getPosX(element, pos, props.value);
      const pageOffset = { x: window.pageXOffset, y: window.pageYOffset };
      // console.log(`pos: ${pos} term: ${selectedTerm} textWidth: ${textWidth} text:${valueRef.current.value.rawText.slice(0, pos)}`);

      caret = {
        left: elementPos.left + textWidth + pageOffset.x,
        top: elementPos.bottom + pageOffset.y,
      };
    }
    if (selectedTerm) {
      props.setSelectedText({ text: word, part: selectedTerm.part, caretPos: caret });
      if (selectedTerm.part) {
        props.getAlternativePhrases(selectedTerm.part);
      }
    }
  };

  const getCaretPos = (word: string) => {
    let pos = 0;

    for (let index = 0; index < props.value.terms.length; index++) {
      const t = props.value.terms[index];
      if (props.term !== t) {
        pos += t.term.length + 1;
      } else {
        pos += t.term.indexOf(word);
        break;
      }
    }
    return pos;
  };

  const inRect = (rect: DOMRect, x: number, y: number) => {
    const padding = 4; // minimum of space between the div & top of alternative dropdown
    return (
      rect.x - padding <= x &&
      x <= rect.x + rect.width + padding &&
      rect.y - padding <= y &&
      y <= rect.y + rect.height + padding
    );
  };

  const closeAlternativeDropdown = () => {
    props.setSelectedText(undefined);
    const query = document.getElementById(_queryId);
    query?.focus();
  };

  const onLeave = (e?: React.MouseEvent<HTMLSpanElement>) => {
    if (document.activeElement) {
      const alternative = document.getElementById("alternativePhrases");
      if (alternative) {
        // ignore if already displaying a phrase alternatives, dropdown will still close when mouse leaves the dropdown though
        // this just makes it easier to interact with the phrase alternatives dropdown
        if (props.selectedText?.text && props.selectedText.text.indexOf(_separator) !== -1) return;

        const rect = alternative.getBoundingClientRect();
        if (e && !inRect(rect, e.clientX, e.clientY)) {
          closeAlternativeDropdown();
        }
      }
    }
  };

  const selectionInCurrentTerm = () => {
    if (!props.selectedText?.part || !props.term.selectedParts) return false;

    for (let index = 0; index < props.term.selectedParts.length; index++) {
      const part = props.term.selectedParts[index];

      if (props.selectedText.part === part) return true;
    }
  };

  const ops = operators.map((x) => x.text);

  // must have an operatorprefix then ~ then [1-10] i.e. NFB~7
  const isOperator = (word: string) => {
    const parts = word.split("~");
    if (parts.length === 2) {
      const proximity = Number(parts[1]);
      return ops.includes(parts[0]) && !isNaN( proximity) && proximity > 0 && proximity < 11 && parts[1].length > 0;
    }
    return false;
  };

  const description = (word: string) => {
    const parts = word.split("~");
    const description = operators.find((x) => x.text === parts[0])?.description;
    let context = "word";
    let proximity = 1;
    if (parts[1].endsWith("P")) {
      context = "paragraph";
      proximity = Number(parts[1].slice(0, parts[1].length - 1));
    } else {
      proximity = Number(parts[1]);
    }

    return `${description} ${proximity}  ${context}${proximity > 1 ? "s" : ""}`;
  };

  const deleteOperator = (term: ITerm) => {
    props.removeTerm(term);
  };

  if (isOperator(props.term.term)) {
    return (
      <Tooltip
        disableInteractive={false}
        title={
          <>
            <div
              style={{
                display: "inline-flex",
                flexDirection: "row-reverse",
                width: "100%",
              }}
            >
              <TinyButton
                icon="Delete"
                color="primary"
                onClick={() => deleteOperator(props.term)}
                className={classes.deleteOperator}
              />
              {/* delete {" "}  */}
            </div>
            <Typography variant="body1">{description(props.term.term)}</Typography>
          </>
        }
      >
        <span className={classes.operator}>{props.term.term}</span>
      </Tooltip>
    );
  }
  return (
    <>
      {isQuoted && <span className={classes.term}>{'"'}</span>}
      {words && (
        <span className={classes.term}>
          {words.map((x, i) => (
            <React.Fragment key={i}>
              {i > 0 ? <span className={isMultiPartWithAlternatives(x)}> </span> : null}
              <span
                className={getWordClassNames(x)}
                onMouseEnter={(e) => {
                  if (e.buttons === 0) setAlternative(x);
                }}
                onMouseLeave={onLeave}
              >
                {x}
              </span>
            </React.Fragment>
          ))}
        </span>
      )}
      {isQuoted && <span className={classes.term}>{'"'}</span>}
    </>
  );
};

export default IntelliText;
