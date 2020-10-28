# Remote Component ![coverage:100%](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)

![Planet with transmitter](https://raw.githubusercontent.com/Paciolan/remote-component/master/media/logo-small.png)

Dynamically load a React Component from a URL.

## Quick Look

Use Remote Components the same way you use a local React Component.

```javascript
// Local
const HelloWorld = ({ name }) => <div>Hello {name}!</div>;

// Remote
const RemoteHelloWorld = ({ name }) => (
  <RemoteComponent
    url="https://raw.githubusercontent.com/Paciolan/remote-component/master/examples/remote-components/HelloWorld.js"
    name={name}
  />
);

// Same Same but Different
const Container = (
  <>
    <HelloWorld name="Local" />
    <RemoteHelloWorld name="Remote" />
  </>
);
```

## Requirements

React 16.8 is required because this component uses React Hooks.

## Install

```bash
npm install @paciolan/remote-component
```

## Webpack

Using Webpack is the recommended and easiest way to use `RemoteComponent`.

Create a file in the root of your web application called `remote-component.config.js`.

```javascript
/**
 * remote-component.config.js
 *
 * Dependencies for Remote Components
 */

module.exports = {
  resolve: {
    react: require("react")
  }
};
```

Add a Webpack `alias` so the RemoteComponent can load this file.

```javascript
/**
 * webpack.config.js
 */

module.exports = {
  resolve: {
    alias: {
      "remote-component.config.js": __dirname + "/remote-component.config.js"
    }
  }
};
```

Now you are ready to use `RemoteComponent`!

```javascript
import React from "react";
import ReactDOM from "react-dom";
import { RemoteComponent } from "@paciolan/remote-component";

const element = document.getElementById("app");
const url = "https://raw.githubusercontent.com/Paciolan/remote-component/master/examples/remote-components/HelloWorld.js"; // prettier-ignore

const HelloWorld = props => <RemoteComponent url={url} {...props} />;

ReactDOM.render(<HelloWorld name="Paciolan" />, element);
```

## Manual Configuration

Remote Components will require some dependencies to be injected into them. At the minimum, we'll be injecting the React dependency.

### `remote-component.config.js`

The web application can include dependencies and inject them into the `RemoteComponent`. At a minimum, you will probably need the `react` dependency.

Create a the file `remote-component.config.js` in the root of the web application.

```javascript
/**
 * remote-component.config.js
 *
 * Dependencies for Remote Components
 */

module.exports = {
  resolve: {
    react: require("react")
  }
};
```

### `src/components/RemoteComponent.js`

Export `RemoteComponent` with the `requires` from `remote-component.config.js`. This will inject the dependencies into the `RemoteComponent`.

```javascript
/*
 * src/components/RemoteComponent.js
 */

import {
  createRemoteComponent,
  createRequires
} from "@paciolan/remote-component";
import { resolve } from "../../remote-component.config.js";

const requires = createRequires(resolve);
export const RemoteComponent = createRemoteComponent({ requires });
```

### Basic Usage

For 99% of use-cases, the Basic Usage is enough.

```javascript
import React from "react";
import ReactDOM from "react-dom";
import { RemoteComponent } from "./components/RemoteComponent";

const element = document.getElementById("app");
const url = "https://raw.githubusercontent.com/Paciolan/remote-component/master/examples/remote-components/HelloWorld.js"; // prettier-ignore

const HelloWorld = props => <RemoteComponent url={url} {...props} />;

ReactDOM.render(<HelloWorld name="Paciolan" />, element);
```

### Render Props Usage

In the case you need more control over the error or rendering, you can use a `render` prop.

```javascript
import React from "react";
import ReactDOM from "react-dom";
import { RemoteComponent } from "./components/RemoteComponent";

const element = document.getElementById("app");
const url = "https://raw.githubusercontent.com/Paciolan/remote-component/master/examples/remote-components/HelloWorld.js"; // prettier-ignore

const HelloWorld = props =>
  <RemoteComponent
    url={url}
    render={({ err, Component }) =>
      err ? <div>{err.toString()}</div> : <Component {...props} />
    }
  />
);

ReactDOM.render(<HelloWorld name="Paciolan" />, element);
```

## React Hooks

If you need even more control, you can use `useRemoteComponent` React Hook.

```javascript
import {
  createRequires,
  createUseRemoteComponent
} from "@paciolan/remote-component";
import { resolve } from "../../remote-component.config.js";

const url = "https://raw.githubusercontent.com/Paciolan/remote-component/master/examples/remote-components/HelloWorld.js"; // prettier-ignore
const requires = createRequires(resolve);
const useRemoteComponent = createUseRemoteComponent({ requires });

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

## Create React App (CRA)

Create React App must be ejected to access the `webpack.config.js`.

The Roadmap includes better support for CRA.

## Prop Tables

### `RemoteComponent`

| Property   | Type        | Required | Description                                 |
| ---------- | ----------- | :------: | ------------------------------------------- |
| `url`      | `String`    |    ✔️    | Location of remote component bundle         |
| `fallback` | `Component` |          | Component to render while loading           |
| `render`   | `render`    |          | Render props function is called when exists |

## Creating Remote Components

### `src/index.js`

Create `src/index.js` and expose your component as the `default`.

```javascript
import React from "react";

const RemoteComponent = () => {
  return <div>Hello Remote World!</div>;
};

export default RemoteComponent;
```

### `webpack.config.js`

The `libraryTarget` of the `RemoteComponent` must be set to `commonjs`.

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

## `package.json`

Set `main` to the webpacked entrypoint. This will probably be `dist/main.js`.

Dependencies you have marked as `external` should be removed from `dependencies` and added to both `devDependencies` (so they are available during development) and `peerDependencies` (so the upstream package knows it is responsible for installation).

```javascript
{
  "main": "dist/main.js",
  "devDependencies": {
    "react": "^16.8"
  },
  "peerDependencies": {
    "react": "^16.8"
  }
}
```

## How it works

The `RemoteComponent` React Component takes a `url` as a prop. The `url` is loaded and processed. This file must be a valid CommonJS Module that exports the component as `default`.

While the `url` is loading, the `fallback` will be rendered. This is a similar pattern to [`React.Suspense`](https://reactjs.org/blog/2018/10/23/react-v-16-6.html). If no `fallback` is provided, then nothing will be rendered while loading.

Once loaded, there will either be an `err` or a `Component`. The rendering will first be handled by the `render` callback function. If there is no `render` callback and `err` exists, a generic message will be shown.

The `Component` will be rendered either to the `render` callback if one exists, otherwise it will be rendered as a standard component.

## Roadmap

- Add support for multiple components import from a single URL.
- Add TypeScript support
- Suppprt Create React App

## Caveats

There are a few things to be aware of when using `RemoteComponent`.

- Calls to a `RemoteComponent` add an additional HTTP call. Be aware of this and use wisely.
- Dependencies could be included twice. If a dependency is included in the library and also in the Web App, there could be unknown effects.
- The external dependencies of the library and Web Application must match. This makes upgrading 3rd party libraries that have breaking changes more complex.
- The `RemoteComponent` and web application's browser targets must match.
- Debugging could be more complicated as source map support does not (yet) exist.
- Nested `RemoteComponents` can get exponentially hard to manage (dependencies) and develop (running multiple repositories at the same time for localhost)

## Contributors

Joel Thoms (https://twitter.com/joelnet)

Icons made by [Freepik](https://www.freepik.com) from [www.flaticon.com](https://www.flaticon.com) is licensed by [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0)
