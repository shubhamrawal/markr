const {
  MYSQL_HOSTNAME,
  MYSQL_USERNAME,
  MYSQL_PASSWORD,
  MYSQL_DB,
} = process.env;

module.exports = {
  // test: {
  //   client: "mysql2",
  //   connection: {
  //     host: MYSQL_HOSTNAME,
  //     user: MYSQL_USERNAME,
  //     password: MYSQL_PASSWORD,
  //     database: MYSQL_DB,
  //   },
  // },
  // development: {
  //   client: "mysql2",
  //   connection: {
  //     host: MYSQL_HOSTNAME,
  //     user: MYSQL_USERNAME,
  //     password: MYSQL_PASSWORD,
  //     database: MYSQL_DB,
  //   },
  // },

  test: {
    client: "mysql2",
    connection: {
      host: "localhost",
      user: "root",
      password: "zeppelin56",
      database: "markr_test",
    },
  },
  development: {
    client: "mysql2",
    connection: {
      host: "localhost",
      user: "root",
      password: "zeppelin56",
      database: "markr",
    },
  },

  // staging: {},
  // production: {},
};
