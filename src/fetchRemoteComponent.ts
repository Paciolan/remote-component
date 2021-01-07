import createLoadRemoteModule from "@paciolan/remote-module-loader";
import { RemoteComponent } from "./createRemoteComponent";

interface FetchRemoteComponentOptions {
  requires: (string) => unknown;
  url: string;
  imports?: string;
}

interface FetchRemoteComponent {
  (options: FetchRemoteComponentOptions): Promise<RemoteComponent>;
}

export const fetchRemoteComponent: FetchRemoteComponent = ({
  requires,
  url,
  imports = "default"
}) => {
  const loadRemoteModule = createLoadRemoteModule({ requires });

  return loadRemoteModule(url).then(module => {
    const Component = module && module[imports];
    if (!Component) {
      throw new Error(`Could not load '${imports}' from '${url}'.`);
    }
    return Component;
  });
  // suppressHydrationWarning={true}
};
