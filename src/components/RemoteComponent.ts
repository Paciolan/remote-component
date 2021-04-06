import { createRemoteComponent } from "../createRemoteComponent";
import { createRequires } from "../createRequires";
import { getDependencies } from "../getDependencies";

const requires = createRequires(getDependencies);

export const RemoteComponent = createRemoteComponent({ requires });
