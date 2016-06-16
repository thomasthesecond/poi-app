import React from "react";
import { shallow } from "enzyme";
import Universal from "../../app/assets/universal/components/universal";
import { createStore } from "redux";
import { TestMode } from "radium";
import { expect } from "chai";

TestMode.enable();

const reducer = (state = {}) => {
  return state;
};

describe("<Universal />", () => {
  it("renders a top choice header with a bookmark and a link", () => {
    const wrapper = shallow(
      <Universal store={createStore(reducer)} />
    );

    const rendered = wrapper.html();

    expect(rendered.match(/Hello World/).length).to.equal(1);
  });
});
