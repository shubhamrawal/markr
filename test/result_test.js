process.env.NODE_ENV = "test";

const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
const app = require("../app");
const { knex } = require("../models/index");
const { validMultiXML } = require("./test_xml");

chai.use(chaiHttp);

const importPath = "/import";
const type = "text/xml+markr";

const getPathForId = (id) => {
  return `/results/${id}/aggregate`;
};

describe("GET /results/:id/aggregate", async () => {
  beforeEach(async () => {
    await knex.migrate.rollback();
    await knex.migrate.latest();
  });

  it("should show valid results", async () => {
    await chai.request(app).post(importPath).type(type).send(validMultiXML);

    const { err, res } = await chai.request(app).get(getPathForId("1234"));

    res.should.have.status(200);
    res.should.be.json;
    console.log(res.body);

    // test db for changes
  });

  it("should not show invalid results", async () => {
    await chai.request(app).post(importPath).type(type).send(validMultiXML);

    const { err, res } = await chai.request(app).get(getPathForId("999"));

    res.should.have.status(404);

    // test db for changes
  });
});
