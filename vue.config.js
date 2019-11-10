module.exports = {
  chainWebpack: config => {
    config.module
      .rule("worker")
      .test(/\.worker\.js$/)
      .use("worker-loader")
      .loader("worker-loader")
      .options({
        inline: true
      })
      .end();
  }
};
