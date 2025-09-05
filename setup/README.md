# Setup Instructions 

## Install Docker and Docker Compose

Follow the official installation guides for [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/).

``` Bash
apt install docker.io
apt install docker-compose
```

## Initialize Docker Swarm

``` Bash
docker swarm init --advertise-addr <MANAGER-IP> # Replace <MANAGER-IP> with your manager node's IP address
```

## Create Overlay Network

``` Bash
docker network create -d overlay shared_net
```

## Deploy Portainer Stack

``` Bash
docker stack deploy -c portainer-stack.yaml portainer
```
