import propTypes from "prop-types";
import React from "react";
import { createUseRemoteComponent } from "./effects/useRemoteComponent";

export const createRemoteComponent = props => {
  const useRemoteComponent = createUseRemoteComponent(props);

  const RemoteComponent = ({ remoteUrl, fallback, render, ...props }) => {
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

    return <Component {...props} />;
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
