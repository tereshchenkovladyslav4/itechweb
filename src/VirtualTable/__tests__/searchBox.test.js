import React from "react";
import SearchBox from "../SearchBox";
import { render } from "@testing-library/react";

describe("<SearchBox/> component", () => {
  it("renders the search box", () => {
    const {container} = render(
      <SearchBox value="text" placeholder="labelText" isVisible={true} />
    );

    expect(container.querySelector("label").textContent).toBe("labelText");
    // expect(screen.getByLabelText('labelText')).toBeTruthy();
  });
});
