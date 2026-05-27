FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY angular.json tsconfig.json postcss.config.js tailwind.config.js ./
COPY projects ./projects

RUN npm run build:docs -- --configuration production

FROM node:22-alpine AS runtime

ENV NODE_ENV=production
ENV PORT=4000
ENV NG_ALLOWED_HOSTS=*

WORKDIR /app

COPY --from=build /app/dist/docs ./dist/docs

EXPOSE 4000

CMD ["node", "dist/docs/server/server.mjs"]
