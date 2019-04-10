import { createRemoteComponent, createRequires, getDependencies } from "..";

const dependencies = getDependencies();
const requires = createRequires(dependencies);

export const RemoteComponent = createRemoteComponent({ requires });
