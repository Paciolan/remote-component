export const createRequires = dependencies => name => {
  if (!(name in (dependencies || {}))) {
    throw new Error(
      `Could not require '${name}'. '${name}' does not exist in dependencies.`
    );
  }

  return dependencies[name];
};
