process.env.NODE_ENV = "test";

const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
const app = require("../app");
const { knex } = require("../models/index");
const {
  validXML,
  duplicateXMLAvailable,
  duplicateXMLObtained,
} = require("./test_xml");

chai.use(chaiHttp);

const importPath = "/import";
const validType = "text/xml+markr";
const invalidType = "text/json";

describe("POST /import", async () => {
  beforeEach(async () => {
    await knex.migrate.rollback();
    await knex.migrate.latest();
  });

  it("should accept valid xml", async () => {
    const { err, res } = await chai
      .request(app)
      .post(importPath)
      .type(validType)
      .send(validXML);

    res.should.have.status(204);
    should.not.exist(res.body);

    // test db for changes
  });

  it("should reject invalid xml", async () => {
    const { err, res } = await chai
      .request(app)
      .post(importPath)
      .type(invalidType)
      .send(validXML);

    res.should.have.status(400);
    should.not.exist(res.body);

    // test db
  });

  it("should update duplicate xml for available marks with highest", async () => {
    const { err, res } = await chai
      .request(app)
      .post(importPath)
      .type(validType)
      .send(duplicateXMLAvailable);

    res.should.have.status(204);

    // test db
  });

  it("should update duplicate xml for obtained marks with highest", async () => {
    const { err, res } = await chai
      .request(app)
      .post(importPath)
      .type(validType)
      .send(duplicateXMLObtained);

    res.should.have.status(204);

    // test db
  });
});
