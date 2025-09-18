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
    table: {
      slots: {
        th: "whitespace-nowrap",
      },
    },
    textarea: {
      slots: {
        root: "w-full",
      },
    },
  },
});
