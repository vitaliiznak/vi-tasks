[< Main](./Readme.md)

<h1> Code quality check with sonarqube </h1>
Run sonarqube container, create a project, then run

```bash
docker run --rm --network=host -e SONAR_HOST_URL='http://127.0.0.1:9000'   -e SONAR_LOGIN="<Project token>" -v "<project_path>/web_app:/usr/src" sonarsource/sonar-scanner-cli
```

```bash
docker run --rm --network=host -e SONAR_HOST_URL='http://127.0.0.1:9000'   -e SONAR_LOGIN="<Project token>" -v "<project_path>/z-tasks/api_main:/usr/src" sonarsource/sonar-scanner-cli
```
