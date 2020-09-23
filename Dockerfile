From node:latest as build
WORKDIR /app
COPY . ./
RUN yarn install && yarn build

From nginx
COPY --from=build /app/nignx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]