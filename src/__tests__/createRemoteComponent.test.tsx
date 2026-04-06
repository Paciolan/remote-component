/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { createRemoteComponent } from "../createRemoteComponent";
import { render } from "@testing-library/react";

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
    const { container } = render(<RemoteComponent url="http://valid.url" />);
    expect(container.textContent).toBe("");
  });

  test("when loading fallback is rendered", async () => {
    jest
      .spyOn(React, "useState")
      .mockImplementation((() => [{ loading: true }]) as any);
    jest.spyOn(React, "useEffect").mockImplementation(noop);
    const expected = "Loading...";
    const fallback = <div>{expected}</div>;
    const { container } = render(
      <RemoteComponent url="http://valid.url" fallback={fallback} />
    );
    expect(container.textContent).toBe(expected);
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
    const { container } = render(
      <RemoteComponent url="http://valid.url" render={mockRender} />
    );
    expect(container.textContent).toBe(expected);
  });

  test("when no Component error is rendered", async () => {
    jest
      .spyOn(React, "useState")
      .mockImplementation((() => [{ loading: false }]) as any);
    jest.spyOn(React, "useEffect").mockImplementation(noop);
    const expected = "Unknown Error: UNKNOWN";
    const { container } = render(<RemoteComponent url="http://valid.url" />);
    expect(container.textContent).toBe(expected);
  });

  test("when `err` error is rendered", async () => {
    jest
      .spyOn(React, "useState")
      .mockImplementation((() => [
        { loading: false, err: "Somethin aint right" }
      ]) as any);
    jest.spyOn(React, "useEffect").mockImplementation(noop);
    const expected = "Unknown Error: Somethin aint right";
    const { container } = render(<RemoteComponent url="http://valid.url" />);
    expect(container.textContent).toBe(expected);
  });

  test("RemoteComponent renders", async () => {
    jest
      .spyOn(React, "useState")
      .mockImplementation((() => [
        { loading: false, component: ({ msg }) => <div>Message: {msg}</div> }
      ]) as any);
    jest.spyOn(React, "useEffect").mockImplementation(noop);
    const expected = "Message: SUCCESS!";
    const { container } = render(
      <RemoteComponent url="http://valid.url" msg="SUCCESS!" />
    );
    expect(container.textContent).toBe(expected);
  });
});
