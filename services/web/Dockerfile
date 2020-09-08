FROM node:alpine

ARG REACT_APP_TASKS_API_HOST
ARG REACT_APP_TASKS_API_PORT

COPY . .

RUN npm install && npm run build

ENTRYPOINT node_modules/.bin/serve -l 8001 -s build
