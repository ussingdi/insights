FROM node:22 AS build-env

ARG GCS_SA
ARG GCS_BUCKET

WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
RUN npm ci --omit=dev

FROM gcr.io/distroless/nodejs22-debian12

COPY --from=build-env /app/build /app/build
COPY --from=build-env /app/node_modules /app/node_modules
COPY --from=build-env /app/package.json /app/package.json
COPY --from=build-env /app/googleCloudStorageServiceAccount.json /app/googleCloudStorageServiceAccount.json

EXPOSE 3000

WORKDIR /app
CMD ["build"]