/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { createRemoteComponent } from "../createRemoteComponent";
import { render } from "enzyme";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

describe("createRemoteComponent", () => {
  const RemoteComponent = createRemoteComponent();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("when loading and no fallback nothing is rendered", async () => {
    jest
      .spyOn(React, "useState")
      .mockImplementation((() => [{ loading: true }]) as any);
    jest.spyOn(React, "useEffect").mockImplementation(noop);
    const expected = "";
    const actual = render(<RemoteComponent url="http://valid.url" />);
    expect(actual.text()).toBe(expected);
  });

  test("when loading fallback is rendered", async () => {
    jest
      .spyOn(React, "useState")
      .mockImplementation((() => [{ loading: true }]) as any);
    jest.spyOn(React, "useEffect").mockImplementation(noop);
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
      .mockImplementation((() => [
        { loading: false, err: "my-err", component: "my-component" }
      ]) as any);
    jest.spyOn(React, "useEffect").mockImplementation(noop);
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
      .mockImplementation((() => [{ loading: false }]) as any);
    jest.spyOn(React, "useEffect").mockImplementation(noop);
    const expected = "Unknown Error: UNKNOWN";
    const actual = render(<RemoteComponent url="http://valid.url" />);
    expect(actual.text()).toBe(expected);
  });

  test("when `err` error is rendered", async () => {
    jest
      .spyOn(React, "useState")
      .mockImplementation((() => [
        { loading: false, err: "Somethin aint right" }
      ]) as any);
    jest.spyOn(React, "useEffect").mockImplementation(noop);
    const expected = "Unknown Error: Somethin aint right";
    const actual = render(<RemoteComponent url="http://valid.url" />);
    expect(actual.text()).toBe(expected);
  });

  test("RemoteComponent renders", async () => {
    jest.spyOn(React, "useState").mockImplementation((() => [
      { loading: false, component: ({ msg }) => <div>Message: {msg}</div> } // eslint-disable-line
    ]) as any);
    jest.spyOn(React, "useEffect").mockImplementation(noop);
    const expected = "Message: SUCCESS!";
    const actual = render(
      <RemoteComponent url="http://valid.url" msg="SUCCESS!" />
    );
    expect(actual.text()).toBe(expected);
  });
});
