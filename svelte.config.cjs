const preprocess = require("svelte-preprocess");

const config = {
  preprocess: [
    preprocess({
      typescript: true,
      postcss: true,
      scss: {
        prependData: '@use "src/variables.scss" as *;',
      },
    }),
  ],
};

module.exports = config;
