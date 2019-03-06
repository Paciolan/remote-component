import propTypes from "prop-types";
import React from "react";
import { createRemoteComponent } from "../index";
import { render } from "enzyme";

describe("createRemoteComponent", () => {
  const RemoteComponent = createRemoteComponent();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("RemoteComponent has propTypes", () => {
    const expected = {
      url: propTypes.string.isRequired,
      fallback: propTypes.object,
      render: propTypes.func
    };
    const actual = RemoteComponent.propTypes;
    expect(actual).toMatchObject(expected);
  });

  test("when loading and no fallback nothing is rendered", async () => {
    jest.spyOn(React, "useState").mockImplementation(() => [{ loading: true }]);
    jest.spyOn(React, "useEffect").mockImplementation(() => {});
    const expected = "";
    const actual = render(<RemoteComponent url="http://valid.url" />);
    expect(actual.text()).toBe(expected);
  });

  test("when loading fallback is rendered", async () => {
    jest.spyOn(React, "useState").mockImplementation(() => [{ loading: true }]);
    jest.spyOn(React, "useEffect").mockImplementation(() => {});
    const expected = "Loading...";
    const fallback = <div>{expected}</div>;
    const actual = render(
      <RemoteComponent url="http://valid.url" fallback={fallback} />
    );
    expect(actual.text()).toBe(expected);
  });

  test("when prop render exists it is called", async () => {
    jest
      .spyOn(React, "useState")
      .mockImplementation(() => [
        { loading: false, err: "my-err", component: "my-component" }
      ]);
    jest.spyOn(React, "useEffect").mockImplementation(() => {});
    const expected = "SUCCESS!";
    const mockRender = jest
      .fn()
      .mockImplementation(({ err, Component }) => (
        <div>
          {err === "my-err" && Component === "my-component"
            ? "SUCCESS!"
            : "FAIL"}
        </div>
      ));
    const actual = render(
      <RemoteComponent url="http://valid.url" render={mockRender} />
    );
    expect(actual.text()).toBe(expected);
  });

  test("when no Component error is rendered", async () => {
    jest
      .spyOn(React, "useState")
      .mockImplementation(() => [{ loading: false }]);
    jest.spyOn(React, "useEffect").mockImplementation(() => {});
    const expected = "Unknown Error: UNKNOWN";
    const actual = render(<RemoteComponent url="http://valid.url" />);
    expect(actual.text()).toBe(expected);
  });

  test("when `err` error is rendered", async () => {
    jest
      .spyOn(React, "useState")
      .mockImplementation(() => [
        { loading: false, err: "Somethin aint right" }
      ]);
    jest.spyOn(React, "useEffect").mockImplementation(() => {});
    const expected = "Unknown Error: Somethin aint right";
    const actual = render(<RemoteComponent url="http://valid.url" />);
    expect(actual.text()).toBe(expected);
  });

  test("RemoteComponent renders", async () => {
    jest.spyOn(React, "useState").mockImplementation(() => [
      { loading: false, component: ({ msg }) => <div>Message: {msg}</div> } // eslint-disable-line
    ]);
    jest.spyOn(React, "useEffect").mockImplementation(() => {});
    const expected = "Message: SUCCESS!";
    const actual = render(
      <RemoteComponent url="http://valid.url" msg="SUCCESS!" />
    );
    expect(actual.text()).toBe(expected);
  });
});
