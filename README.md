# Remote Component [![pipeline status](https://gitlabdev.paciolan.info/development/library/javascript/remote-component/badges/master/pipeline.svg)](https://gitlabdev.paciolan.info/development/library/javascript/remote-component/commits/master) [![coverage report](https://gitlabdev.paciolan.info/development/library/javascript/remote-component/badges/master/coverage.svg)](https://gitlabdev.paciolan.info/development/library/javascript/remote-component/commits/master)

Dynamically load a React Component at runtime.

# Algorithms

`RemoteComponent` is a `React` component that takes a `url` as a `prop`. The `url` is loaded and parsed for a valid `React` component.

While the `url` is loading, a `fallback` will be rendered. This is a similar pattern to [`React.Suspense`](https://reactjs.org/blog/2018/10/23/react-v-16-6.html). If no `fallback` is provided, then nothing will be rendered during loading.

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
const url =
  "https://s3-us-west-2.amazonaws.com/paciolan-public-development/components/hello-world.js";

const HelloWorld = props => <RemoteComponent url={url} {...props} />;

ReactDOM.render(<HelloWorld name="Paciolan" />, node);
```

## Render Props Usage

In the case you need more control over the error or rendering, you can use a `render` `prop`.

```javascript
import React from "react";
import ReactDOM from "react-dom";
import RemoteComponent from "./components/RemoteComponent";

const node = document.getElementById("app");

const HelloWorld = props => (
  <RemoteComponent
    url="https://s3-us-west-2.amazonaws.com/paciolan-public-development/components/hello-world.js"
    render={({ err, Component }) =>
      err ? <div>{err.toString()}</div> : <Component {...props} />
    }
  />
);

ReactDOM.render(<HelloWorld name="Paciolan" />, node);
```

# React Hooks

If you need more control, you can use `useRemoteComponent` React Hook.

```javascript
import { createUseRemoteComponent } from "@paciolan/remote-component";
import { require } from "../external";

const url =
  "https://s3-us-west-2.amazonaws.com/paciolan-public-development/components/hello-world.js";
const useRemoteComponent = createUseRemoteComponent({ require });

const HelloWorld = props => {
  const [loading, err, Component] = useRemoteComponent(url);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (err != null) {
    return <div>Unknown Error: {err.toString()}</div>;
  }

  return <Component {...props} />;
};
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

# Caveats

There are a few things to be aware of when using `RemoteComponent`.

- Calls to a `RemoteComponent` add an additional HTTP call. Be aware of this and use wisely.
- Dependencies could be included twice. If a dependency is included in the library and also in the Web App, there could be unknown effects.
- The external dependencies of the library and Web Application must match. This makes upgrading 3rd party libraries that have breaking changes more complex.
- The `RemoteComponent` and web application's browser targets must match.
- Debugging could be more complicated as source map support does not (yet) exist.

# Contributors

Joel Thoms (jthoms@paciolan.com)

Icons made by [Freepik](https://www.freepik.com) from [www.flaticon.com](https://www.flaticon.com) is licensed by [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0)
