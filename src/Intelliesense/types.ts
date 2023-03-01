import { ITechDataLexicon } from "../Model/iTechRestApi/ITechDataLexicon";

export interface ICaretPos {
  left: number;
  top: number;
}

export interface ISelectedText {
  text: string;
  part: IPart;
  caretPos?: ICaretPos; // only set when mouseover a term
}

export interface IPart {
  phrase: string;
  alternatives?: ILexicon[];
}

export interface ILexicon extends ITechDataLexicon {
  // actually only interested in rowId / phrase
  selected: boolean; // meaning is included / active alternative
}

export interface IIntelliValue {
  rawText: string;
  terms: ITerm[];
  currentTerm: ITerm | undefined;
  autocompleteIndex: number;
  caret: number;
}

export interface ITerm {
  term: string;
  group: string[];
  i: number;
  selected: boolean;
  offset: number;
  selectedParts?: IPart[];
}

export const _queryId = "query";
export const _separator = " ";

export const operators = [
  { text: "FB", description: "Followed by" },
  { text: "NFB", description: "Not followed by" },
  { text: "PB", description: "Preceded by" },
  { text: "NPB", description: "Not preceded by" },
];
