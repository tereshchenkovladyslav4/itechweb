import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import SearchBoxOptions from "../SearchBoxOptions";
import { iTechControlSearchEnum } from "../../Model/iTechRestApi/iTechControlSearchEnum";
import { render} from '../../Test.helpers/test-utils'; // custom render that wraps with themeprovider

describe("<SearchBoxOptions/> component", () => {
  it("renders the search box button", () => {
    const options = [{ label: "one", enabled: true, searchType: iTechControlSearchEnum.summary }];
    const setSearchOption = () => {};
    render(<SearchBoxOptions values={options} setValue={setSearchOption} iconProps={{color:'primary'}} />);
    expect(screen.getByLabelText("Search options")).toBeTruthy();
  });

  it("renders the search box options on click", async () => {
    const options = [{ label: "one", enabled: true, searchType: iTechControlSearchEnum.summary }];
    const setSearchOption = () => {};
    render(<SearchBoxOptions values={options} setValue={setSearchOption} iconProps={{color:'primary'}}/>);
    fireEvent.click(screen.getByLabelText("Search options"));
    expect(screen.getByLabelText("one")).toBeTruthy();
  });
});
