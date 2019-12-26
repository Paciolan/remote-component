import { createRemoteComponent, createRequires, getDependencies } from "..";

const requires = createRequires(getDependencies);

export const RemoteComponent = createRemoteComponent({ requires });
