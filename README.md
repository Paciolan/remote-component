# Remote Component ![coverage:100%](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)

![remote-component](https://replatform.s3-us-west-1.amazonaws.com/remote-component/remote-component.png)

Load a React Component from a URL at runtime.

## Table of Contents

- [What is a Remote Component?](#what-is-a-remote-component)
- [Install](#install)
- [Dependencies](#dependencies)
  - [Injecting Dependencies with Webpack](#injecting-dependencies-with-webpack)
  - [Injecting Dependencies without Webpack](#injecting-dependencies-without-webpack)
  - [Custom Fetcher](#custom-fetcher)
- [Adding a Remote Component to a React App](#adding-a-remote-component-to-a-react-app)
  - [Render Props](#render-props)
  - [React Hooks](#react-hooks)
- [Creating a Remote Component](#creating-a-remote-component)
  - [Remote Component Starter Kit](#remote-component-starter-kit)
  - [Creating a Remote Component with Webpack](#creating-a-remote-component-with-webpack)
- [Create React App (CRA)](<#create-react-app-cra>)
- [Server Side Rendering with Next.js](#server-side-rendering-with-nextjs)
  - [getServerSideProps](#getserversideprops)
  - [Calling getServerSideProps from Next.js](#calling-getserversideprops-from-nextjs)
- [How it works](#how-it-works)
- [Content Security Policy (CSP)](#content-security-policy-csp)
- [Alternatives](#alternatives)
- [Roadmap](#roadmap)
- [Caveats](#caveats)

## What is a Remote Component?

A Remote Components is loaded at runtime from a URL. It is used in the same way any other React Component is used.

```javascript
const url =
  "https://raw.githubusercontent.com/Paciolan/remote-component/master/examples/remote-components/HelloWorld.js";

const HelloWorld = ({ name }) => <RemoteComponent url={url} name={name} />;

const Container = (
  <>
    <HelloWorld name="Remote" />
  </>
);
```

## Install

```bash
npm install @paciolan/remote-component
```

## Dependencies

The React Application and Remote Component can share dependencies. The dependencies must be configured explicitly.

Shared dependencies in the Remote Component must be marked as `external` so they are not bundled in the output.

All shared dependencies must be provided by the React Application.

### Injecting Dependencies with Webpack

Create a file in the root of your React Application called `remote-component.config.js`. Some frameworks like Create React App (CRA) might need this file placed inside the `src` directory. The location can be changed inside of `webpack.config.js`.

This file will supply the Remote Components with their needed external dependencies.

```javascript
/**
 * Dependencies for Remote Components
 */
module.exports = {
  resolve: {
    react: require("react")
  }
};
```

Add a Webpack `alias` inside of `webpack.config.js` so the RemoteComponent can load this file.

```javascript
module.exports = {
  resolve: {
    alias: {
      "remote-component.config.js": __dirname + "/remote-component.config.js"
    }
  }
};
```

### Injecting Dependencies without Webpack

Projects without webpack can still use a Remote Component through a manual configuration.

Follow the directions in [Injecting Dependencies with Webpack](#injecting-dependencies-with-webpack) to create the `remote-component.config.js`.

Create `src/RemoteComponent.js` and import the dependencies from `remote-component.config.js`.

```javascript
import {
  createRemoteComponent,
  createRequires
} from "@paciolan/remote-component";
import { resolve } from "../remote-component.config.js";

const requires = createRequires(resolve);

export const RemoteComponent = createRemoteComponent({ requires });
```

Then you will change the `import` for `RemoteComponent` to point to this new file.

```
import { RemoteComponent } from "./RemoteComponent";
```

## Custom Fetcher

The Custom Fetcher is a feature for advanced users only. It exposes the `fetcher` from the underlying [@paciolan/remote-module-loader](https://github.com/Paciolan/remote-module-loader).

Refer to [@paciolan/remote-module-loader](https://github.com/Paciolan/remote-module-loader) documentation for more information about how to use the `fetcher`.

```javascript
const fetcher = url => axios.get(url).then(request => request.data);

fetchRemoteComponent({ url, requires, fetcher });
```

## Adding a Remote Component to a React App

Import `RemoteComponent` from either `@paciolan/remote-component` or your custom `./src/RemoteComponent.js` (depending on your setup).

It is recommended to wrap `<RemoteComponent />` in a component for better naming and separation. This is optional.

Pass the `url` to the `<RemoteComponent />`.

Use a `RemoteComponent` like a regular React Component.

```javascript
import React from "react";
import ReactDOM from "react-dom";
import { RemoteComponent } from "@paciolan/remote-component";

const element = document.getElementById("app");
const url = "https://raw.githubusercontent.com/Paciolan/remote-component/master/examples/remote-components/HelloWorld.js"; // prettier-ignore

const HelloWorld = props => <RemoteComponent url={url} {...props} />;

ReactDOM.render(<HelloWorld name="Paciolan" />, element);
```

### Render Props

In the case you need more control over the error or rendering, you can use a `render` prop.

```javascript
const HelloWorld = props =>
  <RemoteComponent
    url={url}
    render={({ err, Component }) =>
      err ? <div>{err.toString()}</div> : <Component {...props} />
    }
  />
);
```

### React Hooks

If you need even more control, you can create a custom `useRemoteComponent` React Hook.

Start by creating `src/useRemoteComponent.js`.

```javascript
import {
  createRequires,
  createUseRemoteComponent
} from "@paciolan/remote-component";
import { resolve } from "../../remote-component.config.js";

const requires = createRequires(resolve);

export const useRemoteComponent = createUseRemoteComponent({ requires });
```

Next, use the custom hook.

```javascript
import { useRemoteComponent } from "./useRemoteComponent";

const url = "https://raw.githubusercontent.com/Paciolan/remote-component/master/examples/remote-components/HelloWorld.js"; // prettier-ignore

const HelloWorld = props => {
  const [loading, err, Component] = useRemoteComponent(url);
  
  // To use a named import, pass the name in as the second argument.
  // const [loading, err, Component] = useRemoteComponent(url, "customImportName");

  if (loading) {
    return <div>Loading...</div>;
  }

  if (err != null) {
    return <div>Unknown Error: {err.toString()}</div>;
  }

  return <Component {...props} />;
};
```

## Creating a Remote Component

Creating a Remote Component involves creating a CommonJS module. That module should have `react` and other shared dependencies excluded from the bundle. It should also already be transpiled for browser support.

### Remote Component Starter Kit

Clone the [remote-component-starter](https://github.com/Paciolan/remote-component-starter) for a ready to go project.

### Creating a Remote Component with Webpack

The Remote Component must be exported.

```javascript
import React from "react";

const RemoteComponent = () => {
  return <div>Hello Remote World!</div>;
};

export default RemoteComponent;
```

Inside of the `webpack.config.js`, the `libraryTarget` must be set to `commonjs`.

Any shared dependencies must be added as an `external`. This will prevent them from being bundled in the library.

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

Inside of the `package.json`, set `main` to the webpack entrypoint. This will probably be `dist/main.js`.

Shared dependencies you have marked as `external` should be removed from `dependencies` and added to both `devDependencies` (so they are available during development) and `peerDependencies` (so the upstream package knows it is responsible for installation).

The dependency version should match the version inside the React Application.

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

## Create React App (CRA)

Start a new Create React App app or use an existing one. This is a React Application that will import Remote Components.

```bash
$ npx create-react-app my-react-app
$ cd my-react-app
```

Create `src/remote-component.config.js`. note: CRA requires this file to be placed inside of `src`.

```javascript
/**
 * These dependencies will be made available to the Remote Components.
 */
module.exports = {
  resolve: {
    react: require("react")
  }
};
```

Create `src/RemoteComponent.js`. The `RemoteComponent` must manually be created because CRA does not provide access to `webpack.config.js` without ejection.

```javascript
import {
  createRemoteComponent,
  createRequires
} from "@paciolan/remote-component";
import { resolve } from "./remote-component.config.js";

const requires = createRequires(resolve);

export const RemoteComponent = createRemoteComponent({ requires });
```

You may see the following warning. It is safe to ignore.

```
Compiled with warnings.

./node_modules/@paciolan/remote-component/dist/getDependencies.js
Module not found: Can't resolve 'remote-component.config.js' in '/et/repo/cra-remote-component/node_modules/@paciolan/remote-component/dist'
```

You can get rid of this warning by directly including the files. This is unsafe as these files paths could change.

```javascript
import { createRemoteComponent } from "@paciolan/remote-component/dist/createRemoteComponent";
import { createRequires } from "@paciolan/remote-component/dist/createRequires";
import { resolve } from "./remote-component.config.js";

const requires = createRequires(resolve);

export const RemoteComponent = createRemoteComponent({ requires });
```

## Server Side Rendering with Next.js

Server Side Rendering with Next.js is currently (EXPERIMENTAL).

Follow the steps in [Injecting Dependencies with Webpack](#injecting-dependencies-with-webpack) to create the `remote-component.config.js`.

### getServerSideProps

Add a `getServerSideProps` method to your Remote Component. This follows the Next.js pattern.

```javascript
import React from "react";

const Person = ({ data }) => {
  const entries = Object.entries(data);
  const rows = entries.map(([key, value], i) => (
    <tr>
      <th>{key}</th>
      <td>{value}</td>
    </tr>
  ));

  return <table>{rows}</table>;
};

const getServerSideProps = async ({ data }) => {
  const response = await fetch(`https://swapi.dev/api/people/${data.id}`);
  return await response.json();
};

Person.getServerSideProps = getServerSideProps;

export default Person;
```

## Calling getServerSideProps from Next.js

Modify the Next.js page that will contain the Remote Component.

Add these imports. Notice how `getServerSideProps` is renamed to `getProps` to prevent conflicts with the Next.js function of the same name.

```javascript
import {
  createRequires,
  fetchRemoteComponent,
  getServerSideProps as getProps
} from "@paciolan/remote-component";
import dynamic from "next/dynamic";
import config from "../remote-component.config";
```

Create the `requires` for shared dependencies that will be provided to the Remote Component. Then pass `url` and `requires` into `fetchRemoteComponent`. Wrap this inside of `dynamic`.

```javascript
const requires = createRequires(config.resolve);

const url = "http://localhost:5000/MyRemoteComponent.js";
const MyRemoteComponent = dynamic(() =>
  fetchRemoteComponent({ url, requires })
);
```

Create Next.js's `getServerSideProps` function. Pass the Next.js `context` (if the component needs the context) as well as any data in as `context` when calling `getProps`.

```javascript
export async function getServerSideProps(context) {
  const data = { id: 1 };
  const myData = await getProps({
    url,
    requires,
    context: { ...context, data }
  });
  return { props: { myData } };
}
```

The `props` returned from Next.js's `getServerSideProps` function will be passed into the `props`. You can then use those `props` to send the data into the Remote Component.

```javascript
export default function MyPage(props) {
  return (
    <div>
      <MyRemoteComponent data={props.myData} />
    </div>
  );
}
```

## How it works

The `RemoteComponent` React Component takes a `url` as a prop. The `url` is loaded and evaluated. This file must be a valid CommonJS Module that exports the component as `default`.

While the `url` is loading, the `fallback` will be rendered. This is a similar pattern to [`React.Suspense`](https://reactjs.org/blog/2018/10/23/react-v-16-6.html). If no `fallback` is provided, then nothing will be rendered while loading.

Once loaded, there will either be an `err` or a `Component`. The rendering will first be handled by the `render` callback function. If there is no `render` callback and `err` exists, a generic message will be shown.

The `Component` will be rendered either to the `render` callback if one exists, otherwise it will be rendered as a standard component.

## Content Security Policy (CSP)

Sites with a content_security_policy header set are likely to not work. CSP puts a restriction on using new Function, which remote-module-loader relies upon.

This library depends on [@paciolan/remote-module-loader](https://github.com/Paciolan/remote-module-loader), which does not support CSP. Until CSP is supported in [@paciolan/remote-module-loader](https://github.com/Paciolan/remote-module-loader), it cannot be supported.

[Read more on CSP](https://developer.chrome.com/extensions/contentSecurityPolicy)

## Alternatives

- [Webpack Module Federation](https://webpack.js.org/concepts/module-federation)

## Roadmap

- Add support for multiple components import from a single URL.
- Add TypeScript support

## Caveats

There are a few things to be aware of when using `RemoteComponent`.

- Calls to a `RemoteComponent` add an additional HTTP call.
- Dependencies could be included twice. If a dependency is included in the library and also in the Web App. This could have unknown effects.
- The external dependencies of the library and Web Application must match. This makes upgrading 3rd party libraries that have breaking changes more complex.
- The `RemoteComponent` and web application's browser targets must match. If your React App targets IE11, but the Remote Component does not, then it will not work in IE11.
- Debugging could be more complicated as source map support does not (yet) exist.
- Nested `RemoteComponents` can get exponentially hard to manage (dependencies) and develop (running multiple repositories at the same time for localhost)
- [Content Security Policy (CSP)](<#content-security-policy-(csp)>) is not supported.

## Contributors

Joel Thoms (https://twitter.com/joelnet)

Icons made by <a href="https://www.flaticon.com/authors/smalllikeart" title="smalllikeart">smalllikeart</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>

Icons made by <a href="https://www.flaticon.com/authors/turkkub" title="turkkub">turkkub</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>

Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
