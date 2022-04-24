# Showcase of Postgresql + Graphql + typescript + React tech stack

![Screenshot 1](screenshots/1.PNG?raw=true )


### Run all together with docker

#### In dev mode
To start
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
```

#### In preprod mode
To start
```
 cd ./infrastructure
 docker-compose -f docker-compose.preprod.yml  up --build
```
To stop
```
 cd ./infrastructure
 docker-compose -f docker-compose.preprod.yml down
```



### Code qualiry, check with sonarqube
Run sonarqube container, create a project, then run 
```
  docker run --rm --network=host -e SONAR_HOST_URL='http://127.0.0.1:9000'   -e SONAR_LOGIN="<Project token>" -v "/home/vitalii/projects/z-tasks/web_app:/usr/src" sonarsource/sonar-scanner-cli

```