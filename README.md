# REST API APP

Demo app for a testing concept of develop and build scalable, stateless Microservices in a modern Cluster IT-Infrastructure.


### Prerequisites

- Ubuntu 16.04.5 LTS
- Docker version 18.06.1-ce
- docker-compose version 1.23.2

### Installing
1. Clone repo
    ```
    git clone https://github.com/webpepeprs/rest-api.git
    ```
2. Build nodejs app
    ```
    cd rest-api
    ```
    ```
    docker-compose build
    ```
3. Run project
    ```
    docker-compose up -d
    ```
4. Check that container running and listening ports
    ```
    docker ps
    ```
## Running the tests

### 1. Run npm tests
- Login to container
    ```
    docker exec -it rest-api_nodejs_1 sh
    ```
- Run tests
    ```
    npm test
    ```
    press "ctrl + c" to exit

- Check Rabbitmq messages which should appear after npm tests
    Rabbitmq avalible on url http://docker-server-ip:15672
    - login: rabbitmq
    - pass: rabbitmq

### 2. Run CURL tests
Goal is:
Build a simple PHP/Node.JS/python/go Micro-Service with 3 REST-API Endpoints. Use Docker and publish the repository to github. You can use any components u want. Send us the the link.

Routes:
1. GET / (should echo "Hello")
2. GET /hello/{slug} (should echo "Hello {slug}")
3. POST /post (should echo POST-Body as string)

NOTES: 
- replase docker-server-ip with yours actual IP
- use this api_key (a67689cb-be85-493b-829c-5b0b663a992f) in every http request

### 1. GET / (should echo "Hello")
```
curl -H "api_key: a67689cb-be85-493b-829c-5b0b663a992f" http://<docker-server-ip>:3000/api/v1/
```
### 2. GET /hello/{slug} (should echo "Hello {slug}")
```
curl -H "api_key: a67689cb-be85-493b-829c-5b0b663a992f" http://<docker-server-ip>:3000/api/v1/hello/username
```
### 3. POST /post (should echo POST-Body as string)
```
curl --header "Content-Type: application/json" --header "api_key: a67689cb-be85-493b-829c-5b0b663a992f" --request POST --data '{"Title":"Hello World!"}' http://<docker-server-ip>:3000/api/v1/post/
```

## Rabbit transport tests
REST-API microservice must have connection with message broker.

You can check microservice functionality related to rabbitmq using next commands:
### 1. GET / (should echo "Hello")
- Send to Rabbimq
```
curl --request POST --header "Content-Type: application/json" --data '{"properties":{},"routing_key":"getIndex","payload":"","payload_encoding":"string"}' -u rabbitmq:rabbitmq http://<docker-server-ip>:15672/api/exchanges/%2F/REST/publish
```
- Get from Rabbimq
```
curl --request POST --header "Content-Type: application/json" --data '{"count":5,"ackmode":"ack_requeue_true","encoding":"auto","truncate":50000}' -u rabbitmq:rabbitmq http://<docker-server-ip>:15672/api/queues/%2F/response/get
```
### 2. GET /hello/{slug} (should echo "Hello {slug}")
- Send to Rabbimq
```
curl --request POST --header "Content-Type: application/json" --data '{"properties":{},"routing_key":"greeting","payload":"username","payload_encoding":"string"}' -u rabbitmq:rabbitmq http://<docker-server-ip>:15672/api/exchanges/%2F/REST/publish
```
- Get from Rabbimq
```
curl --request POST --header "Content-Type: application/json" --data '{"count":5,"ackmode":"ack_requeue_true","encoding":"auto","truncate":50000}' -u rabbitmq:rabbitmq http://<docker-server-ip>:15672/api/queues/%2F/response/get
```
### 3. POST /post (should echo POST-Body as string)
- Send to Rabbitmq
```
curl --request POST --header "Content-Type: application/json" --data '{"properties":{},"routing_key":"addNew","payload":"{\"Title\": \"Hello Username!\"}","payload_encoding":"string"}' -u rabbitmq:rabbitmq http://<docker-server-ip>:15672/api/exchanges/%2F/REST/publish
```
- Get from Rabbimq
```
curl --request POST --header "Content-Type: application/json" --data '{"count":5,"ackmode":"ack_requeue_true","encoding":"auto","truncate":50000}' -u rabbitmq:rabbitmq http://<docker-server-ip>:15672/api/queues/%2F/response/get
```


