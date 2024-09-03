export const resolve = {
    alias: {
        process: "process/browser",
    },
};
export const module = {
    rules: [
        {
            test: /\.m?js/,
            resolve: {
                fullySpecified: false,
            },
        },
    ],
};
  