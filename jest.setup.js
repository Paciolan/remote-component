/* eslint-disable @typescript-eslint/no-var-requires */
const Enzyme = require("enzyme");
const Adapter = require("enzyme-adapter-react-16");
require("regenerator-runtime/runtime");

Enzyme.configure({ adapter: new Adapter() });
