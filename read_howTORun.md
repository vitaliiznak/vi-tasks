<h2> Run all together with docker </h2>

<h3> In dev mode </h3>
To start
<pre>
  <code>
cd ./infrastructure
docker-compose -f docker-compose.dev.yml up  --build 
  </code>
</pre>
To run only selected service for example db_postgres_dev
<pre>
  <code>
cd ./infrastructure
docker-compose -f docker-compose.dev.yml  up db_postgres_dev
  </code>
</pre>
To stop
<pre>
  <code>
cd ./infrastructure
docker-compose -f docker-compose.dev.yml down
  </code>
</pre>
<h3> In preprod mode </h3>
To start
<pre>
  <code>
cd ./infrastructure
docker-compose -f docker-compose.preprod.yml  up --build
  </code>
</pre>
To stop
<pre>
  <code>
cd ./infrastructure
docker-compose -f docker-compose.preprod.yml down
  </code>
</pre>


<h3> Code qualiry, check with sonarqube </h3>
Run sonarqube container, create a project, then run 
<pre>
<code>
docker run --rm --network=host -e SONAR_HOST_URL='http://127.0.0.1:9000'   -e SONAR_LOGIN="<Project token>" -v "<project_path>/web_app:/usr/src" sonarsource/sonar-scanner-cli
</code>
</pre>
<pre>
  <code>
docker run --rm --network=host -e SONAR_HOST_URL='http://127.0.0.1:9000'   -e SONAR_LOGIN="<Project token>" -v "<project_path>/z-tasks/api_main:/usr/src" sonarsource/sonar-scanner-cli
  </code>
</pre>