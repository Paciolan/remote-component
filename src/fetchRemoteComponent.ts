import createLoadRemoteModule from "@paciolan/remote-module-loader";
import { RemoteComponent } from "./createRemoteComponent";
import { Fetcher } from "@paciolan/remote-module-loader/dist/models";
interface FetchRemoteComponentOptions {
  requires: (string) => unknown;
  fetcher?: Fetcher;
  url: string;
  imports?: string;
}

interface FetchRemoteComponent {
  (options: FetchRemoteComponentOptions): Promise<RemoteComponent>;
}

export const fetchRemoteComponent: FetchRemoteComponent = ({
  requires,
  fetcher,
  url,
  imports = "default"
}) => {
  const loadRemoteModule = createLoadRemoteModule({ requires, fetcher });

  return loadRemoteModule(url).then(module => {
    const Component = module && module[imports];
    if (!Component) {
      throw new Error(`Could not load '${imports}' from '${url}'.`);
    }
    return Component;
  });
  // suppressHydrationWarning={true}
};
