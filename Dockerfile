FROM node:lts as BUILDER
WORKDIR /app
COPY package.json /app/package.json
COPY tsconfig.json /app/tsconfig.json
COPY tsconfig.prod.json /app/tsconfig.prod.json
COPY .npmrc /app/.npmrc
COPY src /app/src
RUN npm run prod
RUN npm run clean:prod
RUN npm i --omit=dev
RUN rm -rf .npmrc

FROM node:lts-slim
WORKDIR /app
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
CMD ["node", "./dist"]
EXPOSE 6777
