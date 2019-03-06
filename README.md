# Remote Component

Dynamically load a React Component at runtime.

# Algorithms

`RemoteComponent` is a `React` component that takes a `remoteUrl` as a `prop`. The `remoteUrl` is loaded and parsed for a valid `React` component.

While the `remoteUrl` is loading, a `fallback` will be rendered. This is a similar pattern to [`React.Suspense`](https://reactjs.org/blog/2018/10/23/react-v-16-6.html). If no `fallback` is provided, then nothing will be rendered during loading.

Once loaded, there will either be an `err` or a `Component`. The rendering will first be handled by the `render` callback function. If there is no `render` callback and `err` exists, a generic message will be shown.

The `Component` will be rendered either to the `render` callback if one exists, otherwise it will be rendered as a standard component. See documentation for examples.

# Install

```bash
npm install @paciolan/remote-component
```

# Code

Create `src/externals.js` to expose your dependencies and `src/components/RemoteComponent.js` to link the dependencies to `RemoteComponent`.

## src/externals.js

Include any dependencies your web application will expose to the `RemoteComponents`. Expose a function called `requires`.

```javascript
const globalDependencies = {
  react: require("react"),
  "styled-components": require("styled-components")
};

export const requires = name => globalDependencies[name];
```

## src/components/RemoteComponent

Export `RemoteComponent` with the `requires` available from your Web Application.

```javascript
import { createRemoteComponent } from "@paciolan/remote-component";
import { requires } from "../external";

export default createRemoteComponent({ requires });
```

## Basic Usage

For 99% of use-cases, the Basic Usage is recommmended.

```javascript
import React from "react";
import ReactDOM from "react-dom";
import RemoteComponent from "./components/RemoteComponent";

const node = document.getElementById("app");
const remoteUrl =
  "https://s3-us-west-2.amazonaws.com/paciolan-public-development/components/hello-world.js";

const HelloWorld = props => (
  <RemoteComponent remoteUrl={remoteUrl} {...props} />
);

ReactDOM.render(<HelloWorld name="Paciolan" />, node);
```

## Render Props Usage

In the case you need more control over the error or rendering, you can use a `render` `prop`.

```javascript
import React from "react";
import ReactDOM from "react-dom";
import RemoteComponent from "./components/RemoteComponent";

const node = document.getElementById("app");
const remoteUrl =
  "https://s3-us-west-2.amazonaws.com/paciolan-public-development/components/hello-world.js";

const HelloWorld = props => (
  <RemoteComponent remoteUrl={remoteUrl} {...props} />
);

ReactDOM.render(
  <HelloWorld
    name="Paciolan"
    render={({ err, Component }) =>
      err ? <div>{err.toString()}</div> : <Component {...props} />
    }
  />,
  node
);
```

# Creating Remote Components

## webpack.config.js

The `output.libraryTarget` of the `RemoteComponent` must be set to `commonjs`.

Any dependencies that will not be bundled with the library must be added as an `external`.

It is recommended to add `react` as an `external`.

```javascript
module.exports = {
  output: {
    libraryTarget: "commonjs"
  },
  externals: {
    react: "react"
  }
};
```

# package.json

Set `main` to the webpacked entrypoint. This will probably be `dist/main.js`.

Any dependencies you have marked as `external` should be removed from `dependencies` and added to both `devDependencies` and `peerDependencies`.

```javascript
{
  "main": "dist/main.js",
  "devDependencies": {
    "react": "^16.8.2"
  },
  "peerDependencies": {
    "react": "^16.8.2"
  }
}
```

# src/index.js

Create `src/index.js` and expose your component as the `default`.

```javascript
import React from "react";

const RemoteComponent = () => {
  return <div>Hello Remote World!</div>;
};

export default RemoteComponent;
```

# Deployment

The `@paciolan/remote-component` library will be automatically deployed to `npm` when code is merged into `master` during the `ci/cd` process.

# Debugging

Create unit tests to debug `RemoteComponent`.

# Contributors

Joel Thoms (jthoms@paciolan.com)

Icons made by [Freepik](https://www.freepik.com) from [www.flaticon.com](https://www.flaticon.com) is licensed by [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0)
