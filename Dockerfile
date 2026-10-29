# Stage 1: Node installs the packages and builds the app
FROM node:24-alpine AS build
WORKDIR /app

# Copying only the package files first lets Docker reuse the npm ci layer when just the code changes
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ARG TMDB_TOKEN
RUN TMDB_TOKEN=$TMDB_TOKEN npm run build

# Stage 2: only nginx and the built files go to the final image (no Node, no node_modules)
FROM nginx:1.29-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/movie-explorer/browser /usr/share/nginx/html
EXPOSE 80
