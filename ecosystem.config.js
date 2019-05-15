module.exports = {
  apps: {
    name: "fc-guide",
    script: "./dist/server/index.js",
    watch: ["./dist/server"],
    log_date_format: "YYYY-MM-DD HH:mm:ss.SSS (ZZ)"
  }
};
