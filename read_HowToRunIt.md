[< Main](./Readme.md)

<h1> How to run it </h1>

<h2> In dev mode </h2>
<div style='font-size:14px;'>Make sure you have installed all of the following prerequisites on your development machine: </div>

* [Node.js](https://nodejs.org/en/) - Download & Install [Node.js](https://nodejs.org/en/) and the npm package manager.
* [Docker](https://www.docker.com/) - Download & Install [Docker](https://www.docker.com/) and the npm package manager.

<p>Start database server</p>

```bash
cd ./infrastructure
docker-compose -f docker-compose.dev.yml  up db_postgres_dev
```

<div style='font-size:14px;'>Install npm deps</div>

```bash
cd ./api_main
npm i
```

<div style='font-size:14px;'>Create DB tables (run migration script)</div>

```bash
cd ./api_main
npm run db-migrate up
```

<div style='font-size:12px; margin-top: -10px; padding-top: 0;'>
Check docker-compose.dev.yml to know DB username/password and other env. info</div>
<br/>

<div style='font-size:14px;'>Populate DB with user accounts</div>

```bash
cd ./api_main
npm run db-migrate up
```

<div style='font-size:12px; margin-top: -10px; padding-top: 0;'>It will create users with credentials: <span style='font-weight:700;'>john@mail.com/12345</span> and <span style='font-weight:700;'>mike@mail.com/12345</span></div>

<br/>

<div style='font-size:14px;'>Start api</div>

```bash
  npm run start
```

<div style='font-size:14px; margin-top: -10px; padding-top: 0;'>
  It will start a Graphql API on
  <a href="http://localhost:4000/graphql">
    http://localhost:400/graphql
  </a>
  The Graphql playground is accessible by the link above
  
</div>

<!-- To start
```
cd ./infrastructure
docker-compose -f docker-compose.dev.yml up  --build 
```

To run only selected service for example db_postgres_dev
```
cd ./infrastructure
docker-compose -f docker-compose.dev.yml  up db_postgres_dev

```

To stop
```
cd ./infrastructure
docker-compose -f docker-compose.dev.yml down
``` -->

<br>

<h2> In preprod mode with docker</h2>

To start

```bash
cd ./infrastructure
docker-compose -f docker-compose.preprod.yml  up --build
```

To stop

```bash
cd ./infrastructure
docker-compose -f docker-compose.preprod.yml down
```

<br>
