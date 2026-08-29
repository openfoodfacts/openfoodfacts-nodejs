// https://github.com/rolldown/tsdown/issues/1054
export function unwrapCjsDefault<T>(mod: T): T {
  return typeof mod === "function"
    ? mod
    : (mod as unknown as { default: T }).default;
}
