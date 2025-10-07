import * as v from "valibot";

const requiredMsg = "This field is required.";
export const vImage = () => (
  v.pipe(
    v.union([v.file(), v.nullish(v.file()), v.string()]),
    v.check((input) => !!input, "Please select an image file."),
    v.check(
      (input) => typeof input === "string" || ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(input?.type || ""),
      "Please select a JPG, JPEG, PNG or WebP file."
    ),
  )
);
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
