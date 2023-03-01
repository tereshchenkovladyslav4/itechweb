import React from "react";
import { LinearLoading } from "../LinearLoading";
import { act } from "react-dom/test-utils";
// import { render } from "@testing-library/react";
import { render} from '../../Test.helpers/test-utils'; // custom render that wraps with themeprovider
import { trackPromise } from "react-promise-tracker";

function promiseDelay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("<LinearLoading/> component", () => {

  it("renders nothing when no promise in progress", () => {
    act(() => {
      const container = render(
            <LinearLoading width={{ width: "90%" }} area="area" />
      );
      expect(container.container).toBeEmptyDOMElement();
    });
  });

  it("renders when promise in progress", async () => {
    jest.useFakeTimers();
    const spy = jest.fn();

    // pass a promise that remained in progress
    trackPromise(promiseDelay(100).then(spy), "area");

    let container;
    await act(async () => {
      container = render(
            <LinearLoading width={{ width: "90%" }} area="area" />
      );
      await Promise.resolve();
    });
    // container.debug();
    expect(container.container).not.toBeEmptyDOMElement();

    expect(spy).not.toBeCalled(); // demonstrate the promise was not completed.
    jest.useRealTimers();
  });
});
