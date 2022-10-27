# Common build stage
FROM node:16.14.2

ENV TZ=Asia/Seoul

COPY . ./app

WORKDIR /app

RUN yarn
ENV NODE_ENV production
RUN yarn build

EXPOSE 3001

CMD ["yarn", "start:docker"]
