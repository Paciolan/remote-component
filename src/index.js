import propTypes from "prop-types";
import React from "react";
import { createUseRemoteComponent } from "./effects/useRemoteComponent";

export const createRemoteComponent = args => {
  const useRemoteComponent = createUseRemoteComponent(args);

  const RemoteComponent = ({ remoteUrl, fallback, render, ...args }) => {
    const [loading, err, Component] = useRemoteComponent(remoteUrl);

    if (loading) {
      return fallback;
    }

    if (render) {
      return render({ err, Component });
    }

    if (err || !Component) {
      return <div>Unknown Error: {(err || "UNKNOWN").toString()}</div>;
    }

    return <Component {...args} />;
  };

  RemoteComponent.propTypes = {
    remoteUrl: propTypes.string.isRequired,
    fallback: propTypes.object,
    render: propTypes.func
  };

  RemoteComponent.defaultProps = {
    fallback: null
  };

  return RemoteComponent;
};
