# Build Frontend
Remove vue built file
```
rm -rf ./frontend/dist
```
Run command to rebuild vue 
```
cd ./frontend
npm run build
```
# Run Container
Run command to build docker container<br>
Change ```DOCKER_SOCK_PATH``` to your ```docker.sock``` path, default is ```/var/run/docker.sock```
```
DOCKER_SOCK_PATH=/path/to/your/docker.sock docker-compose up -d --build --force-recreate
```
# Stop and remove container
Run command to stop and remove container, it will also remove relative images
```
docker-compose down --rmi all -v 
```
