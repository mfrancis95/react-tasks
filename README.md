# React Tasks

## Requirements
- Docker
- MongoDB
- Node.js
- NPM

## Environment
- `$TASKS_API_HOST`: The hostname of the tasks api backend server. Defaults to `http://localhost`.
- `$TASKS_API_PORT`: The port of the tasks api backend server. Defaults to `8000`.

These environment variables can be specified inside an `.env` present in the root of the repository.

## Building

In each subdirectory within `services`, run `npm install` to install the service's dependencies. In `services/web`, run `npm run build` to build the front-end for production.

Each of the `Dockerfile`s present in those directories can be built by running `docker build .`, or from the root of the repository through Docker Compose: `docker-compose up --build`.

## Running

To run all services in production mode, including the MongoDB server, run `docker-compose up`. This will start up the MongoDB server, followed by the tasks api microservice and then the UI microservice.

Outside of Docker, either of the services can be run by running `npm start` in their directories. For `services/web`, this starts it in development mode, where it'll constantly refresh on changes made.

## Linting

In either service, run `npm run lint` to have `eslint` analyse the `src` folders.
