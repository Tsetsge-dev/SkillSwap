<<<<<<< HEAD
FROM node:20-alpine AS build
=======
FROM node:22-alpine AS build
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0

WORKDIR /app

COPY package*.json ./
<<<<<<< HEAD
RUN npm install
=======
RUN npm ci
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
