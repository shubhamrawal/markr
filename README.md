# Markr - A Marking as a Service Platform

Markr is a prototype created for Stile education that lets you make post requests with XML marks data to be stored into a [MySQL](https://www.mysql.com/) database. The app is built with [Express](https://expressjs.com/) a popular [Node.JS](https://nodejs.org/en/) framework. It also uses the [Objection.JS](https://vincit.github.io/objection.js/) ORM library built on top of the [knex](http://knexjs.org/) query builder.

## Installation Instructions

### Pre-requisites

You need an installation of [Docker](https://www.docker.com/) to build and run the application. Everything else is self contained inside the docker containers.

### Steps

1. Clone the github repository using the command -- `git clone https://github.com/shubhamrawal/markr.git`

2. In the root directory, run the command -- `docker-compose build`. This will build the containers for the express app and the mysql database.

3. Run the build using the command -- `docker-compose up`. It will also run the migrations to set up the initial database schema. The database is not seeded and will need to be populated.

### Usage

1. The express server will run on port **8080** in the container and bound to port **80** on the host. Access the server by navigating to the link <localhost:80/results/1/aggregate>

2. **POST** requests can be made to the server at <localhost:80/import>. The XML files need to have the _Content-Type_ as _text/xml+markr_. An example is given below [taken from the requirements document]:

```
curl -X POST -H 'Content-Type: text/xml+markr' http://localhost:80/import -d @- <<XML
    <mcq-test-results>
        <mcq-test-result scanned-on="2017-12-04T12:12:10+11:00">
            <first-name>Jane</first-name>
            <last-name>Austen</last-name>
            <student-number>521585128</student-number>
            <test-id>1234</test-id>
            <summary-marks available="20" obtained="13" />
        </mcq-test-result>
    </mcq-test-results>
XML
```

## Assumptions and Approach

1. The prototype is a microservice and will form part of a larger platform. No authentication/authorisation is provided - the service will eventually have access to an SSO server/auth server.

2. An SQL database was chosen over NoSQL because the data is well structured and perfectly suited for storing grades.

3. The simplest approach would have been to go through the marks in each **POST** request and insert/update them in the database. When a user needed to **GET** the aggregate, they would be computed then and the result returned back to the user.

4. The approach I decided to go with (something the final service could be built on top of) was to design a database schema with an aggregate table for keeping track of test aggregates (warehouse db style architecture). My assumption was that the number of reads to the database will be much greater than the number of writes - which will help mitigate the higher costs of keeping the aggregate table updated.

5. In a real-world scenario the aggregate table would not be updated with every **POST** request. For the purposes of this prototype, that is how it is implemented. A different update approach could be adopted for future development.

6. It is hypothesised that imports to the database would be largely done test-wise. For example, markers uploading all the results for a test at the end of marking. The approach breaks up the data into test-wise results and does a batch insert for all the results for the same test.

7. The results aggregate request is a simple **GET** request to the database and is done on a per test basis - without requiring any further computations.

8. Depending on the context and the dataset, if the imports happen irregularly and in small batches, a better approach would be to insert new results and update the old ones. The tests associated with these results would be flagged as _dirty_ to be updated later. This could be done before the reports are generated.

9. For a real-time dashboard, the approach would depend on the requirements again. Considering, the marks are not time sensitive information - like sensor data from a safety critical system, we could keep the aggregate table approach and update the test information every so often. If we want truly real-time updates, we could look at a streaming data approach (however, that is unlikely to be the case as marks would not be updated as often).

10. The testing is very minimal at the moment - the prototype would benefit greatly from more extensive testing.
