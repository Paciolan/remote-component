export interface DependencyFunction {
  (name: string): unknown;
}

export interface DependencyTable {
  [props: string]: unknown;
}

export interface CreateRequires {
  (dependencies?: () => DependencyTable): (name: string) => unknown;
}

const sanitizeDependencies = (
  dependencies: (() => DependencyTable) | DependencyTable | undefined
) => (typeof dependencies === "function" ? dependencies() : dependencies || {});

export const createRequires: CreateRequires = dependencies => {
  let isSanitized = false;
  let resolved: DependencyTable;

  return name => {
    if (!isSanitized) {
      // note: needs to happen inside the inner function for the laziness to work.
      resolved = sanitizeDependencies(dependencies) as DependencyTable;
      isSanitized = true;
    }

    if (!(name in resolved)) {
      throw new Error(
        `Could not require '${name}'. '${name}' does not exist in dependencies.`
      );
    }

    return resolved[name];
  };
};
