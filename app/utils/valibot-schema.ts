import * as v from "valibot";

const requiredMsg = "This field is required.";
export const vRequired = (message = requiredMsg) => v.pipe(v.string(), v.nonEmpty(message));
export const vRequiredSelect = (message = requiredMsg) => (
  v.pipe(
    v.union([v.number(), v.nullish(v.number())]),
    v.number(message)
  )
);
export const vRequiredStringSelect = (message = requiredMsg) => (
  v.pipe(
    v.union([v.string(), v.nullish(v.string())]),
    v.string(message)
  )
);
