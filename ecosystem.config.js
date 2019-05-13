module.exports = {
  apps: {
    name: "fc-guide",
    script: "./dist/server/index.js",
    watch: false,
    log_date_format: "YYYY-MM-DD HH:mm:ss.SSS (ZZ)",
    env: {
      NODE_ENV: "development"
    },
    env_testing: {
      NODE_ENV: "testing"
    },
    env_production: {
      NODE_ENV: "production"
    }
  },
  deploy: {
    production: {
      user: "www-data",
      host: [{ host: "stirad.com" }],
      ref: "origin/master",
      repo: "https://github.com/uicestone/fc-guide.git",
      path: "/var/www/fc-guide",
      "post-deploy": "yarn && yarn build && rm -r web && cp -r dist web"
    }
  }
};
