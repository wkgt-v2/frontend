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
    navigationMenu: {
      slots: {
        link: "text-base",
      },
      variants: {
        active: {
          false: {
            link: "text-tone",
          },
        },
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
