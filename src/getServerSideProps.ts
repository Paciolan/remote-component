import createLoadRemoteModule from "@paciolan/remote-module-loader";

interface GetServerSidePropsOptions {
  url: string;
  requires: (string) => unknown;
  context: unknown;
  imports?: string;
}

interface GetServerSideProps {
  (options: GetServerSidePropsOptions): Promise<unknown>;
}

export const getServerSideProps: GetServerSideProps = ({
  url,
  requires,
  context,
  imports = "default"
}) => {
  const loadRemoteModule = createLoadRemoteModule({ requires });

  return loadRemoteModule(url).then(module => {
    const func =
      module && module[imports] && module[imports].getServerSideProps;

    return typeof func === "function" ? func(context) : {};
  });
};
