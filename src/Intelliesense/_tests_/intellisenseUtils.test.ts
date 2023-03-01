import { getCurrentTermIndex, getCurrentWordIndex } from "../intellisenseUtils";
import { IIntelliValue } from "../types";

describe("intellisenseUtils helpers", () => {
  describe("calculate wordIndex in single phrase", () => {
    const val: IIntelliValue = {
      //       012345678901234567
      rawText: '"able to reach" ',
      terms: [{ term: '"able to reach"', offset: 0, selected: false, i: 0, group: [] }],
      autocompleteIndex: 0,
      caret: 0,
      currentTerm: undefined,
    };

    it.each([
      [0, 0],
      [1, 1], // single quote
      [2, 1],
      [3, 1],
      [4, 1],
      [5, 2],
      [6, 2],
      [7, 2],
      [8, 3],
      [9, 3],
      [10, 3],
      [15, 5], // 3 words + 2 quotes
      [16, 5], 
    ])("caretpos %p expecting index %p", (pos, result) => {
      expect(getCurrentWordIndex(pos, val)).toEqual(result);
    });
  });

  describe("calculate wordIndex in two phrase", () => {
    const val: IIntelliValue = {
      //       0123456789012345678901234567890123456
      rawText: '"able to reach" "at the expense of"',
      terms: [
        { term: '"able to reach"', offset: 0, selected: false, i: 0, group: [] },
        { term: '"at the expense of"', offset: 16, selected: false, i: 3, group: [] },
      ],
      autocompleteIndex: 0,
      caret: 0,
      currentTerm: undefined,
    };

    it.each([
      [16, 5], // 3 words + 2 quotes
      [17, 6],
      [18, 6],
      [20, 7],
      [23, 8],
      [24, 8],
      [31, 9],
      [32, 9],
      [35, 11],
      [36, 11],
    ])("caretpos %p expecting index %p", (pos, result) => {
      expect(getCurrentWordIndex(pos, val)).toEqual(result);
    });
  });

  describe("calculate wordIndex in three phrase", () => {
    const val: IIntelliValue = {
      //       0123456789012345678901234567890123456789012345678
      rawText: '"able to reach" "at the expense of" "do no harm"',
      terms: [
        { term: '"able to reach"', offset: 0, selected: false, i: 0, group: [] },
        { term: '"at the expense of"', offset: 16, selected: false, i: 3, group: [] },
        { term: '"do no harm"', offset: 36, selected: false, i: 7, group: [] },
      ],
      autocompleteIndex: 0,
      caret: 0,
      currentTerm: undefined,
    };

    it.each([
      [36, 11],
      [37, 12],
      [38, 12],
      [47, 15],
      [48, 16],
    ])("caretpos %p expecting index %p", (pos, result) => {
      expect(getCurrentWordIndex(pos, val)).toEqual(result);
    });
  });


  describe("calculate termIndex in three phrase", () => {
    const val: IIntelliValue = {
      //       0123456789012345678901234567890123456789012345678
      rawText: '"able to reach" "at the expense of" "do no harm"',
      terms: [
        { term: '"able to reach"', offset: 0, selected: false, i: 0, group: [] },
        { term: '"at the expense of"', offset: 16, selected: false, i: 3, group: [] },
        { term: '"do no harm"', offset: 36, selected: false, i: 7, group: [] },
      ],
      autocompleteIndex: 0,
      caret: 0,
      currentTerm: undefined,
    };

    it.each([
      [0, 0],
      [1, 0],
      [2, 0],
      [15, 0],
      [16, 0],
      [17, 1],
      [24, 1],
      [36, 1],
      [37, 2],
      [38, 2],
      [48, 2],
    ])("caretpos %p expecting index %p", (pos, result) => {
      expect(getCurrentTermIndex(pos, val)).toEqual(result);
    });
  });
});
