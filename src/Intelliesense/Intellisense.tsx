import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import React, { useEffect, useRef, useState, KeyboardEvent } from "react";
import Cursor from "../_helpers/cursor";
import { getCanvasFont, getTextWidth } from "../_helpers/measureText";
import { useStyles } from "./Intellisense.style";
import { lexiconService } from "../_services/lexiconService";
import {
  ICaretPos,
  IIntelliValue,
  ILexicon,
  IPart,
  ISelectedText,
  ITerm,
  _queryId,
  _separator,
} from "./types";
import AlternativePhrase from "./AlternativePhrase";
import { findTermFromSelection, getPosX } from "./intellisenseUtils";
import IntelliText from "./IntelliText";
import Operators from "./Operators";

interface IIntelliSenseProps {
  autocompleteService: typeof lexiconService;
  json?: string;
  setJson(val: string): void;
  setName(val: string): void;
}

const Intellisense: React.FC<IIntelliSenseProps> = ({
  autocompleteService,
  json,
  setJson,
  setName,
}) => {
  const classes = useStyles();
  const _caretId = "caret";

  const _defaultValue = (): IIntelliValue => {
    return {
      rawText: "",
      terms: [],
      currentTerm: undefined,
      autocompleteIndex: -1,
      caret: -1,
    };
  };

  const getValue = (val?: string) => {
    return val ? (JSON.parse(val) as IIntelliValue) : undefined;
  };

  const [autocomplete, setAutocomplete] = useState<string[]>([]);
  const [value, setValue] = useState<IIntelliValue>(getValue(json) ?? _defaultValue());
  const valueRef = useRef({ value: value }); // we must store in ref to pass stored state on special key change
  const [caretPosition, setCaretPosition] = useState<ICaretPos | undefined>(undefined);
  const autocompleteRef = useRef<string[]>([]);
  const [selectedText, setSelectedText] = useState<ISelectedText | undefined>(undefined); // TODO - not sure this needs part & text.. part.phrase should be same

  function getCaretPosition(): { left: number; top: number } | undefined {
    const selection = document?.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }

    const r = selection.getRangeAt(0);
    let node = r.startContainer;

    const offset = r.startOffset || r.endOffset; // offset in this node - selection direction can be either way
    const pageOffset = { x: window.pageXOffset, y: window.pageYOffset };
    // console.log("pageoffset ", pageOffset);
    let rect, r2;
    // console.log(r);
    if (offset > 0) {
      const queryChild = [...node.childNodes].find((x: any) => x.id === "query");
      if (queryChild) {
        let elements: any = [...queryChild.childNodes].find(
          (x) => x.nodeName === "PRE"
        )?.childNodes;

        elements = [...elements].filter((x) => x.nodeType === Node.ELEMENT_NODE);
        if (elements && elements.length) {
          node = elements[elements.length - 1];
        }
      }
      r2 = document.createRange();
      r2.selectNode(node);

      rect = r2.getBoundingClientRect();
      const pos = { left: rect.right + pageOffset.x, top: rect.bottom + pageOffset.y };
      // console.log("getCaretPosition: ", pos);
      return pos;
    }

    // check if the node is the pre
    if (selection?.anchorNode?.nodeName === "PRE") {
      const children = [...selection.anchorNode.childNodes].filter(
        (x) => x.nodeType === Node.ELEMENT_NODE
      );
      const child = children[children.length - 1];
      if (child) {
        //N.B. if just hit delete - textcontent is still the pre-deleted text, which seems to cause setEnd on range to fail
        // const left = child.textContent?.length ? child.textContent.length : 0;
        const r3 = document.createRange();
        const selectNode = child;
        if (selectNode) {
          r3.selectNode(selectNode);
          const childRect = r3.getBoundingClientRect();
          // console.log("childrect ", childRect);
          return { left: childRect.right + pageOffset.x, top: childRect.bottom + pageOffset.y };
        }
      }
    }
    // console.log("getCaretPosition: offset 0");
  }

  // function getText(node: ChildNode) {
  //   function recursor(n: ChildNode) {
  //     let i,
  //       a: ChildNode[] = [];
  //     if (n.nodeType !== Node.TEXT_NODE) {
  //       if (n.childNodes)
  //         for (i = 0; i < n.childNodes.length; ++i) a = a.concat(recursor(n.childNodes[i]));
  //     } else a.push(n);
  //     return a;
  //   }
  //   return recursor(node);
  // }
  const preventKey = (e: any) => {
    // we have to handle "ctrl A" here as by time it gets to the keyup all page elements already selected
    if (e.ctrlKey && (e.key === "a" || e.key === "A")) {
      const node = document.getElementById(_queryId);
      if (node) {
        document.getSelection()?.selectAllChildren(node);
      }
      e.preventDefault();
      return false;
    }
    return true;
  };

  useEffect(() => {
    document.addEventListener("keydown", preventKey);

    return () => {
      document.removeEventListener("keydown", preventKey);
    };
  }, []);

  useEffect(() => {
    const val = getValue(json) ?? _defaultValue();
    if (value.rawText !== val.rawText) {
      setValue(val);
      valueRef.current.value = val;
      // console.log("json: ", json);
    }
  }, [json]);

  // Detect autocomplete terms as value updates
  useEffect(() => {
    valueRef.current.value.autocompleteIndex = value.autocompleteIndex;

    // dont call service if current term is an operator / already a quoted ( selected ) term
    if (
      value.currentTerm &&
      value.currentTerm.term.length > 0 &&
      value.currentTerm.term.indexOf("~") === -1 &&
      value.currentTerm.term.charAt(0) !== '"'
    ) {
      getAutocompleteTerms(value.currentTerm.term);
    }
  }, [value]);

  const getAutocompleteTerms = (term: string) => {
    autocompleteService
      ?.search(term)
      .then((results) => setAutocomplete(results.results?.map((t) => t.phrase) ?? []));
  };

  const getAlternativePhrases = (part: IPart) => {
    autocompleteService?.getAlternatives(part.phrase).then((results) => {
      const alternatives = results.results as ILexicon[];

      setSelectedText((prev) => {
        const val = { ...prev };
        if (val.part) {
          if (!val.part.alternatives) val.part.alternatives = [];

          if (val.part.alternatives.length !== alternatives.length) {
            // merge if alternatives already has values
            alternatives.forEach((element) => {
              if (!val.part?.alternatives?.find((x) => x.phrase === element.phrase)) {
                val.part?.alternatives?.push(element);
              }
            });
            return val as ISelectedText;
          }
        }
        return prev;
      });
    });
  };

  // Set autocomplete display position as value changes
  useEffect(() => {
    if (value.caret < 0) return;

    const element = document.getElementById(_queryId);
    Cursor.setCurrentCursorPosition(value.caret, element);
  }, [value]);

  // Update autocomplete selection highlight as index changed
  useEffect(() => {
    if (value.autocompleteIndex < 0) return;
    document.getElementById("selected")?.scrollIntoView();
  }, [value.autocompleteIndex]);

  // Set autocomplete ref as state updates
  useEffect(() => {
    autocompleteRef.current = autocomplete;
  }, [autocomplete]);

  const _handleChange = () => {
    console.log("_handleChange");
    const innerText = valueRef.current.value.rawText;
    const parts: string[] = innerText.split(_separator).filter((t: string) => t.trim().length > 0);
    const newTerms = [...value.terms];
    let offset = 0;
    // TODO - handle phrases in quotes properly
    const termsText = _rawText(value.terms)
      .split(_separator)
      .filter((t: string) => t.trim().length > 0);

    for (let index = 0; index < parts.length; index++) {
      // if (index >= value.terms.length){
      if (index >= termsText.length) {
        // new word added => add term
        newTerms.push({
          term: parts[index],
          group: [],
          i: termsText.length, // i has to be the index across all words in all previous terms
          selected: true,
          offset: offset,
        } as ITerm);
      } else {
        // t.i is the index across all words so far
        const current = newTerms.find((t) => t.i === index);
        const currentParts = current?.term.split(_separator) ?? []; // terms can be phrases of more than one word
        if (
          current &&
          !currentParts.every((termPart, i) => termPart.trim() === parts[index + i]?.trim())
        ) {
          // term does not match current part
          const termIndex = newTerms.indexOf(current);
          newTerms.splice(
            // current.i, // this needs to be the terms index i.e. newTerms.indexOf(current)
            termIndex, // this needs to be the terms index i.e. newTerms.indexOf(current)
            1,
            ...currentParts.map(
              // There could be more currentParts than parts if deleted word(s)
              (p, i) =>
                ({
                  term: parts[index + i]?.trim(), // todo
                  group: [],
                  i: index + i,
                  selected: true,
                  offset: (offset = innerText.indexOf(parts[index], offset)),
                } as ITerm)
            )
          );
        } else if (current) {
          current.selected = false; // stale term => not selected anymore
          offset = current.offset = innerText.indexOf(parts[index], offset);
        }

        index += currentParts.length > 0 ? currentParts.length - 1 : 0; // more than one part means we shift the current index up
      }
    }

    newTerms.map((t, i) => ({ ...t, i: i }));

    // TODO - this section needs reworking - issues with autocomplete / term when added 2 phrases already
    while (_rawText(newTerms).split(_separator).length > parts.length && newTerms.length)
      newTerms.pop(); // term(s) removed

    // todo - attempt for now to restitch quoted terms back together
    let inTerm = false;
    const actualTerms = [];
    for (let i = 0; i < newTerms.length; i++) {
      const t = newTerms[i];
      if (!inTerm) {
        actualTerms.push(t);
      } else {
        actualTerms[actualTerms.length - 1].term += _separator + t.term;
        if (t.term.endsWith('"')) {
          inTerm = false;
        }
      }
      if (t.term.startsWith('"') && !t.term.endsWith('"')) {
        inTerm = true;
      }
    }

    // copy over any selectedParts if we recreated an existing term
    for (let i = 0; i < actualTerms.length; i++) {
      const newTerm = actualTerms[i];
      const prevTerm = value.terms.find((x) => x.term === newTerm.term && x !== newTerm);

      if (prevTerm && prevTerm.selectedParts !== newTerm.selectedParts) {
        newTerm.selectedParts = prevTerm?.selectedParts;
      }
    }

    // ensure offsets still correct.
    offset = 0;
    for (let i = 0; i < actualTerms.length; i++) {
      const t = actualTerms[i];
      if (i > 0) {
        offset++; // add the separator length
      }
      t.offset = offset;
      offset += t.term.length;
    }

    const currentTerm = actualTerms.find((t) => t.selected);

    // console.log("setting currentterm ", currentTerm);
    const pos = getCaretPosition();
    // console.log("setcaretpos: ", pos);
    setCaretPosition(pos);

    const newValue = {
      rawText: innerText,
      terms: actualTerms,
      //currentTermIndex: currentTermIndex >= 0 ? currentTermIndex : 0,
      currentTerm: currentTerm,
      autocompleteIndex: valueRef.current.value.autocompleteIndex,
      caret: valueRef.current.value.caret || 1, // if current is zero - use 1 as just typed a character
    };

    valueRef.current.value = newValue; // whole new instance
    setValue(newValue);
  };

  const _rawText = (terms: ITerm[]) => terms.map((t) => t.term).join(_separator);

  const _select = (e: any) => {
    if (valueRef.current.value.autocompleteIndex < 0 || autocompleteRef.current.length === 0)
      return;
    _setCurrentTerm(
      autocompleteRef.current[valueRef.current.value.autocompleteIndex],
      valueRef.current.value
    );
  };

  const copyToClipboard = (txt: string) => navigator.clipboard.writeText(txt);
  const getClipboardText = async () => await navigator.clipboard.readText();

  const getSelectionOffset = (selection: Selection) => {
    let offset = 0;

    if (selection.anchorNode?.nodeType === Node.TEXT_NODE) {
      // get any prior parent siblings & total length of their text... or substring rawText
      const str = selection.anchorNode.nodeValue;
      if (str) {
        // get preceeding nodes text from parent -> siblings....
        const currentNode = selection.anchorNode.parentNode;
        let priorSibling = currentNode?.previousSibling || currentNode?.parentNode?.previousSibling;
        // ignore the offset if from the empty span
        if (currentNode?.textContent !== "\u200b") {
          offset += selection.anchorOffset;
        }
        while (priorSibling !== null) {
          offset += priorSibling?.textContent?.length ?? 0;
          priorSibling = priorSibling?.previousSibling || priorSibling?.parentNode?.previousSibling;
        }
      }
    }
    return offset;
  };

  const _onKeyUp = async (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey) {
      switch (e.key) {
        // select all is handled at document level keydown handler
        case "a":
        case "A":
          return;
        // COPY
        case "C":
        case "c":
          {
            const sel = getSelection();
            if (sel && sel.toString()) {
              copyToClipboard(sel.toString());
            }
          }
          return;
        // PASTE
        case "v":
        case "V":
          {
            const clipboardTxt = await getClipboardText();
            const text = valueRef.current.value.rawText;
            const index =
              valueRef.current.value.caret ??
              document.getElementById(_queryId)?.innerText.length ??
              0;
            const newText = text.slice(0, index) + clipboardTxt + text.slice(index);
            // setValue((prev) => ({
            //   ...prev,
            //   rawText: newText,
            // }));
            valueRef.current.value.rawText = newText;

            _handleChange();
          }
          return;
        // CUT
        case "x":
        case "X":
          {
            const sel = getSelection();
            const selText = sel?.toString();
            if (selText && sel) {
              const text = valueRef.current.value.rawText;
              const i = getSelectionOffset(sel);

              let start = 0;
              let end = 0;
              // depending on which direction selection made.
              if (sel.focusOffset < sel.anchorOffset) {
                start = i - selText.length;
                end = i;
              } else {
                start = i;
                end = i + selText.length;
              }
              copyToClipboard(selText);

              const newText = text.slice(0, start) + text.slice(end);
              valueRef.current.value.rawText = newText;
              // TODO - change caret pos ?
              valueRef.current.value.caret = start;
              _setCaret(start);
              _handleChange();
            }
          }
          return;
        // UNDO
        // do we want this? will need a stack of "value"s (rawtext) for all changes
        case "z":
        case "Z":
          console.log("ctrl+z");
          return;
      }
    }
    switch (e.key) {
      case "Home":
        if (e.shiftKey) {
          const sel = getSelection();
          if (sel?.focusNode) {
            sel?.extend(sel.focusNode);
          }
        } else {
          _setCaret(0);
        }
        return;
      case "End":
        if (e.shiftKey) {
          const sel = getSelection();
          if (sel?.focusNode) {
            sel?.extend(sel.focusNode, sel.focusNode.nodeValue?.length);
          }
        } else {
          _setCaret(valueRef.current.value.rawText.length);
        }
        return;
      case "ArrowUp": {
        setValue((prev) => ({
          ...prev,
          autocompleteIndex:
            prev.autocompleteIndex > -1 ? prev.autocompleteIndex - 1 : prev.autocompleteIndex,
        }));
        if (autocomplete.length <= 0) _setCaret(0);
        e.preventDefault();
        break;
      }
      case "ArrowDown": {
        e.preventDefault();
        setValue((prev) => ({
          ...prev,
          autocompleteIndex:
            prev.autocompleteIndex < autocompleteRef.current.length - 1
              ? prev.autocompleteIndex + 1
              : prev.autocompleteIndex,
        }));
        if (autocomplete.length <= 0)
          _setCaret(document.getElementById(_queryId)?.innerText.length ?? -1);
        break;
      }
      case "Enter": {
        e.preventDefault();
        _select(e);
        break;
      }
    }
  };

  const _ignoreChars: number[] = [
    16, 17, 18, 20, 27, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123,
  ];

  const _onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey && !(e.key === "ArrowLeft" || e.key === "ArrowRight")) return;
    if (_ignoreChars.indexOf(e.keyCode) >= 0) return;

    switch (e.key) {
      case 'Enter':
        if (valueRef.current.value.autocompleteIndex >= 0) e.preventDefault();
        break;
      case 'ArrowUp':
        if (valueRef.current.value.autocompleteIndex >= 0) e.preventDefault();
        break;
      case 'ArrowDown':
        //if (autocompleteRef.current.length > 0)
        e.preventDefault();
        break;
      // LEFT
      case 'ArrowLeft': {
        const sel = getSelection();
        if (e.shiftKey) {
          if (sel) {
            if (sel.anchorNode && sel.focusNode) {
              e.preventDefault(); // stop the double selection
              let end = sel.focusOffset - 1;
              if (e.ctrlKey) {
                let wordEnd = sel.focusNode.nodeValue?.substring(0, end).lastIndexOf(_separator);
                if (wordEnd == -1) wordEnd = 0;
                if (wordEnd !== undefined) end = wordEnd;
              }
              if (sel.focusOffset > 0)
                sel.setBaseAndExtent(sel.anchorNode, sel.anchorOffset, sel.focusNode, end);
            }
          }
        } else {
          let index = valueRef.current.value.caret > 0 ? valueRef.current.value.caret - 1 : 0;
          if (sel?.toString()?.length) {
            // cursor positioned at the start of the selection
            if (sel.anchorOffset > sel.focusOffset) {
              index = index > 0 ? index - (sel.toString().length - 1) : index;
            } else {
              index++;
            }
          }
          if (e.ctrlKey) {
            // go to start of word
            const wordStart = sel?.anchorOffset || 0;
            if (wordStart !== undefined) index = valueRef.current.value.caret - wordStart;
          }
          _setCaret(index);
        }
        break;
      }
      case 'ArrowRight': {
        const sel = getSelection();
        if (e.shiftKey) {
          if (sel) {
            if (sel.anchorNode && sel.focusNode) {
              let node: Node | null | undefined = sel.anchorNode;
              let offset = sel.anchorOffset;
              if (sel.anchorNode.nodeValue === " " || sel.anchorNode.nodeValue === '"') {
                node = sel.anchorNode?.parentNode?.nextSibling?.childNodes[0]; // set node as the next text node
                offset = 0;
              }
              e.preventDefault(); // stop the double selection
              let end = Math.min(sel.focusOffset + 1, sel.anchorNode.nodeValue?.length || 0);
              if (e.ctrlKey) {
                const wordEnd = node?.nodeValue?.length;
                if (wordEnd !== undefined) end = wordEnd;
              }
              if (node) {
                sel.setBaseAndExtent(node, offset, node, end);
              }
            }
          }
        } else {
          let index =
            valueRef.current.value.caret < valueRef.current.value.rawText?.length || 0
              ? valueRef.current.value.caret + 1
              : valueRef.current.value.rawText?.length || 0;
          if (sel?.toString()?.length) {
            // cursor positioned at end of the selection if selection is to the right
            if (sel.anchorOffset < sel.focusOffset) {
              index = index > 0 ? index + sel.toString().length - 1 : index;
            } else {
              index--;
            }
          }
          if (e.ctrlKey) {
            // go to end of word
            const wordEnd = sel?.anchorNode?.nodeValue?.length;
            if (wordEnd !== undefined) {
              index = valueRef.current.value.caret + wordEnd - (sel?.anchorOffset || 0);
            }
            if (index === valueRef.current.value.caret) {
              // go to next sibling end
              let nextNode =
                sel?.anchorNode?.parentNode?.nextSibling?.childNodes[0] ||
                sel?.anchorNode?.parentNode?.parentNode?.nextSibling?.childNodes[0]; // set node as the next text node
              if (nextNode?.nodeType !== Node.TEXT_NODE) {
                nextNode = nextNode?.childNodes[0];
              }
              console.log(`nextnode ${nextNode}`);
              index += nextNode?.nodeValue?.length || 0;
            }
          }
          _setCaret(index);
        }
        break;
      }
      case 'Backspace':
      case 'Delete':
        {
          const sel = getSelection();
          if (sel && sel.toString()) {
            const text = valueRef.current.value.rawText;
            const selText = sel.toString();
            if (text === selText) {
              // all selected - so clear text
              valueRef.current.value.rawText = "";
              _setCaret(0);
            } else if (sel.anchorNode === sel.focusNode) {
              const i = getSelectionOffset(sel);
              let start = 0;
              let end = 0;
              // depending on which direction selection made.
              if (sel.focusOffset < sel.anchorOffset) {
                start = i - selText.length;
                end = i;
              } else {
                start = i;
                end = i + selText.length;
              }

              const newText = text.slice(0, start) + text.slice(end);
              valueRef.current.value.rawText = newText;
              // change caret pos
              valueRef.current.value.caret = start;
              _setCaret(start);
            } else {
              valueRef.current.value.rawText = text.substring(0, sel.anchorOffset);
              _setCaret(sel.anchorOffset);
            }
          } else {
            _removeChar(e.keyCode === 8);
          }
          _handleChange();
        }
        break;
      default:
        _addChar(e.key);
        _handleChange();
        break;
    }
  };

  const _removeChar = (back = true) => {
    let index =
      valueRef.current.value.caret ?? document.getElementById(_queryId)?.innerText.length ?? 0;
    if (!back) index += 1;
    const text = valueRef.current.value.rawText;
    const newText = text.slice(0, index - 1) + text.slice(index);

    // if this is an operator delete it all
    // const sel = getSelection();
    // if (sel?.anchorNode?.nodeValue) {
    //   const term = findTermFromSelection(sel.anchorNode.nodeValue, index, valueRef.current.value);
    //   if (term?.term?.term && term.term.term.indexOf("~") >= 0) {
    //     deleteTerm(term.term);
    //     return;
    //   }
    // }
    // setValue((prev) => ({
    //   ...prev,
    //   rawText: newText,
    // }));
    valueRef.current.value.rawText = newText;
    if (back) _setCaret(index - 1);
  };

  const _addChar = (char: string) => {
    if (!char.match(/(\w|\s|[{}<>,.?~'\-!"£$%&^&*():=\\/;#\\|@`¬\\[\]])/g) || char.length > 2)
      return;

    let index =
      valueRef.current.value.caret ?? document.getElementById(_queryId)?.innerText.length ?? 0;
    const text = valueRef.current.value.rawText;

    const sel = getSelection();
    let moveChars = 1;
    if (sel && sel.toString()) {
      // const text = valueRef.current.value.rawText;

      if (sel.anchorNode === sel.focusNode) {
        const i = getSelectionOffset(sel);
        let start = 0,
          end = 0;
        const len = sel.toString().length;
        if (sel.anchorOffset > sel.focusOffset) {
          start = i - len;
          end = i;
        } else {
          start = i;
          end = i + len;
        }
        const newText = text.slice(0, start) + char + text.slice(end);

        // ensure no multiple spaces.
        valueRef.current.value.rawText = newText.replace(/  +/g, ' ');
        
        index = start;
      } else {
        valueRef.current.value.rawText = text.substring(0, sel.anchorOffset) + char;
      }
    } else {
      // prevent multiple consecutive spaces at the end
      if(valueRef.current.value.rawText.endsWith(' ') && char === ' ') return;

      const newText = text.slice(0, index) + char + text.slice(index);
      // setValue((prev) => ({
      //   ...prev,
      //   rawText: newText,
      // }));
      valueRef.current.value.rawText =  newText.replace(/ {2,}/g, ' ');
      if(newText.length !== valueRef.current.value.rawText.length){
        moveChars = 0;
      }
    }
    _setCaret(index + moveChars);
  };

  const _setCurrentTerm = (newTerm: string, intelliValue: IIntelliValue) => {
    console.log("_SetCurrentTerm", newTerm);
    if (newTerm === undefined || newTerm?.length === 0) {
      return;
    }

    const current = intelliValue.terms.find((t) => t.selected);
    let index = intelliValue.terms.findIndex((t) => t.selected);
    if (index < 0) index = 0;
    // console.log("intelliValue START", intelliValue, index);
    // let offset = current?.offset ?? 0;
    // const splitTerms = newTerm.split(_separator).map(
    //   (t, i) =>
    //     ({
    //       term: t,
    //       group: [],
    //       i: current?.i ?? 0,
    //       selected: false,
    //       offset: i > 0 ? (offset += t.length + 1) : offset,
    //     } as ITerm)
    // );

    const term = {
      term: newTerm,
      group: [],
      i: current?.i ?? 0,
      // selected: true,
      selected: false,
      offset: current?.offset ?? 0,
    } as ITerm;

    intelliValue.terms.splice(index, 1, term);
    intelliValue.terms.map((t, i) => ({ ...t, i: i }));

    const caret = intelliValue.terms
      .filter((_, i) => i <= index)
      .map((x) => x.term)
      .join(_separator).length;

    const newValue = {
      ...intelliValue,
      currentTerm: undefined,
      rawText: _rawText(intelliValue.terms),
      autocompleteIndex: -1,
      caret: caret,
    };
    setValue(newValue);
    valueRef.current.value = newValue;
    setAutocomplete([]);
    //console.log("_setCurrentTerm", intelliValue, caret, index);
    _setCaret(caret);
  };

  // const _renderAutoComplete = (props: { caretPos?: any }) => {
  const _renderAutoComplete = () => {
    if (!caretPosition || value.currentTerm === undefined || autocomplete.length === 0) {
      // console.log("render autocomplete null");
      // console.log(caretPosition);
      // console.log(value.currentTerm);
      // console.log(autocomplete.length);
      return null;
    }
    const query = document.getElementById(_queryId);
    const textWidth =
      value.currentTerm?.term && query
        ? getTextWidth(value.currentTerm?.term, getCanvasFont(query))
        : 0;

    if (textWidth === 0) return null;

    const max =
      value.autocompleteIndex >= autocomplete.length - 1
        ? autocomplete.length - 1
        : value.autocompleteIndex;

    return (
      <List
        component="nav"
        id="autocomplete"
        dense={true}
        className={classes.autocomplete}
        style={{ top: caretPosition.top, left: caretPosition.left - textWidth }}
      >
        {autocomplete
          .sort((a, b) => a.localeCompare(b))
          .map((t, i) => (
            <ListItem
              button
              selected={max === i}
              onClick={() => {
                _setCurrentTerm(t, value);
                const query = document.getElementById(_queryId);
                query?.focus();
              }}
              key={i}
              className={classes.autoItem}
              id={max === i ? "selected" : undefined}
            >
              <ListItemText primary={t} />
            </ListItem>
          ))}
      </List>
    );
  };

  const _onBlur = (e: React.FocusEvent<HTMLElement>) => {
    // TODO - removed this as if have the alternative text list as a component it causes the react render loop error
    // should really not show the cursor when not in focus... but perhaps do this without a state change ??

    // check the next focus element & if a child of id="intellisense" then dont set to -1
    const nextFocus = e.relatedTarget;
    const intellisenseELement = document.getElementById("intellisense");
    if (!intellisenseELement?.contains(nextFocus)) {
      console.log("onblur set caret to -1");
      setValue((prev) => ({ ...prev, caret: -1 }));
      valueRef.current.value.caret = -1;
    }

    if (value.rawText?.length) {
      setJson(JSON.stringify(value));
    } else {
      setJson("");
    }
    setName(value.rawText);
  };

  const _onMouseUp = () => {
    // console.log("mouseup");
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      _caretSelection(); // set value.caret to where selection now is
      const selText = selection.toString().trim();
      // set the caretpos to where the mouse selection is
      const pos = getCaretPosition();
      console.log("mouseup pos: ", pos);
      if (pos) {
        setCaretPosition(pos);
      }
      // dont process when making a selection range with mouse
      // todo - show autocomplete for alternatives here ?
      console.log("TODO - show terms autocomplete, value: ", valueRef.current.value);
      //todo - set current phrase
      // todo - selection could be across terms?! how do model / store this ?
      const selectedTerm = findTermFromSelection(selText, valueRef.current.value.caret, value);

      if (selectedTerm) {
        const selectedPart = selectedTerm.part;
        setSelectedText({ text: selText, part: selectedPart });

        // N.B. setting state here will re-draw, losing the selection! - TODO
        // store the selection as (start: , end: ) ?
        // const newValue = {
        //   ...value,
        //   currentTerm: selectedTerm,
        //   autocompleteIndex: -1,
        // };
        // setValue(newValue);
        // valueRef.current.value = newValue;

        if (selectedPart) {
          getAlternativePhrases(selectedPart);
        }
      }
      return;
    }
    setSelectedText(undefined);
    _caretSelection();
    // to clear current term...when click while autocomplete shown
    _handleChange();
  };

  const _caretSelection = () => {
    const selection = window.getSelection();
    const query = document.getElementById(_queryId);
    query?.focus();
    if (!selection || !query) return;
    console.log(selection);
    console.log(selection.getRangeAt(0));

    let offset = 0;
    // now have multiple elements with the original pre
    if (selection.anchorNode?.nodeType === Node.TEXT_NODE) {
      // get any prior parent siblings & total length of their text... or substring rawText
      const str = selection.anchorNode.nodeValue;
      if (str) {
        // get preceeding nodes text from parent -> siblings....
        const currentNode = selection.anchorNode.parentNode;
        let priorSibling = currentNode?.previousSibling || currentNode?.parentNode?.previousSibling;
        // ignore the offset if from the empty span
        if (currentNode?.textContent !== "\u200b") {
          offset += selection.anchorOffset;
        }
        while (priorSibling !== null) {
          offset += priorSibling?.textContent?.length ?? 0;
          priorSibling = priorSibling?.previousSibling || priorSibling?.parentNode?.previousSibling;
        }
        // TODO
      }
    }

    // no actual selection so move caret
    if (selection.isCollapsed) {
      _setCaret(offset);
    } else {
      setAutocomplete([]);
      autocompleteRef.current = [];
      console.log(
        `_caretSelection setting caret to: ${selection.focusOffset} calc offset is ${offset}`
      );
      // _setCaret(selection.focusOffset);
      _setCaret(offset);
    }
    // if (selection.isCollapsed) {
    //   _setCaret(selection.anchorOffset);
    // } else {
    //   setAutocomplete([]);
    //   autocompleteRef.current = [];
    //   // const offsets = [selection.anchorOffset, selection.focusOffset];
    //   // const range = { start: Math.min(...offsets), end: Math.max(...offsets) };
    //   _setCaret(selection.focusOffset);
    // }
  };

  const _setCaret = (charOffset: number) => {
    const query = document.getElementById(_queryId);
    const caret = document.getElementById(_caretId);
    if (!caret || !query) return;

    setValue((prev) => ({ ...prev, caret: charOffset }));
    valueRef.current.value.caret = charOffset;
    // console.log("set caret: ", charOffset);

    const pos = getPosX(query, charOffset, valueRef.current.value);
    caret.style.left = `${pos}px`;
  };

  const closeAlternativeDropdown = () => {
    setSelectedText(undefined);
    const query = document.getElementById(_queryId);
    query?.focus();
  };

  const setOperator = (val: string) => {
    // insert the operator text
    let index = value.caret;
    // if caret pos is in a term - go to the start of this term
    let prevTermStart = 0;
    for (let i = 0; i < value.terms.length; i++) {
      const element = value.terms[i];
      // >= offset -1 so that if at end of term or the space between terms it inserts there. else go to beginning of term
      if (index >= element.offset-1) {
        prevTermStart = element.offset;
      }
    }
    if (index !== value.rawText.length) {
      index = prevTermStart;
    } else {
      val = " " + val;
    }
    const text = value.rawText;
    // add operator into raw text
    const newText = (text.slice(0, index) + val + " " + text.slice(index)).trim();

    valueRef.current.value.rawText = newText;
    valueRef.current.value.currentTerm = undefined;
    setValue((prev) => ({
      ...prev,
      rawText: newText,
      currentTerm: undefined,
    }));

    if (valueRef.current.value.caret >= index) {
      valueRef.current.value.caret += val.length + 1;
      _setCaret(valueRef.current.value.caret);
    }

    _handleChange();
  };

  const deleteTerm = (term: ITerm) => {
    const termStartIndex = term.offset;
    const newText = (
      value.rawText.slice(0, termStartIndex) +
      value.rawText.slice(termStartIndex + term.term.length + 1)
    ).trim();

    valueRef.current.value.rawText = newText;
    if (valueRef.current.value.caret > termStartIndex) {
      // console.log(`caret current: ${valueRef.current.value.caret} new:${valueRef.current.value.caret- (term.term.length+1)}`);
      valueRef.current.value.caret -= term.term.length + 1;
      _setCaret(valueRef.current.value.caret);
    }

    setValue((prev) => ({
      ...prev,
      rawText: newText,
      caret: valueRef.current.value.caret,
    }));

    _handleChange();
  };

  return (
    <div className={classes.root} id="intellisense">
      <div
        className={classes.caret}
        id={_caretId}
        style={{ visibility: valueRef.current.value.caret >= 0 ? "visible" : "hidden" }}
      />
      <Operators setValue={setOperator} />
      <div
        className={classes.editable}
        onKeyUp={_onKeyUp}
        onKeyDown={_onKeyDown}
        onMouseUp={_onMouseUp}
        onBlur={_onBlur}
        id={_queryId}
        tabIndex={0}
      >
        <pre>
          <IntelliText
            value={value}
            selectedText={selectedText}
            setSelectedText={setSelectedText}
            getAlternativePhrases={getAlternativePhrases}
            removeTerm={deleteTerm}
          />
        </pre>
      </div>
      {_renderAutoComplete()}
      {/* <RenderAutoComplete /> */}
      <AlternativePhrase
        caretPos={caretPosition}
        selectedText={selectedText}
        setSelectedText={setSelectedText}
        autocompleteService={autocompleteService}
        onMouseLeave={closeAlternativeDropdown}
      />
    </div>
  );
};

Intellisense.displayName = "Intellisense";

export default Intellisense;
