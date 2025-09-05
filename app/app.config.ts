export default defineAppConfig({
  ui: {
    colors: {
      primary: "cyan",
    },
    input: {
      slots: {
        root: "w-full",
      },
    },
    select: {
      slots: {
        base: "w-full",
      },
    },
    selectMenu: {
      slots: {
        base: "w-full",
        placeholder: "min-h-5",
      },
    },
    textarea: {
      slots: {
        root: "w-full",
      },
    },
  },
});
