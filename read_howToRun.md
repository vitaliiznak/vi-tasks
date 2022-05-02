<h2> Run all together with docker </h2>

<h3> In dev mode </h3>
To start
<code>
 cd ./infrastructure
 docker-compose -f docker-compose.dev.yml up  --build 
</code>
To run only selected service for example db_postgres_dev
<code>
  cd ./infrastructure
  docker-compose -f docker-compose.dev.yml  up db_postgres_dev
</code>
To stop
<code>
 cd ./infrastructure
 docker-compose -f docker-compose.dev.yml down
</code>

<h3> In preprod mode </h3>
To start
<code>
 cd ./infrastructure
 docker-compose -f docker-compose.preprod.yml  up --build
</code>
To stop
<code>
 cd ./infrastructure
 docker-compose -f docker-compose.preprod.yml down
</code>



<h3> Code qualiry, check with sonarqube </h3>
Run sonarqube container, create a project, then run 
<code>
  docker run --rm --network=host -e SONAR_HOST_URL='http://127.0.0.1:9000'   -e SONAR_LOGIN="<Project token>" -v "<project_path>/web_app:/usr/src" sonarsource/sonar-scanner-cli
</code>
<code>
  docker run --rm --network=host -e SONAR_HOST_URL='http://127.0.0.1:9000'   -e SONAR_LOGIN="<Project token>" -v "<project_path>/z-tasks/api_main:/usr/src" sonarsource/sonar-scanner-cli
</code>