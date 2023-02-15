FROM nginx:stable-alpine

COPY *.js  /usr/share/nginx/html/.
COPY index.html  /usr/share/nginx/html/index.html
COPY semantic/  /usr/share/nginx/html/semantic/

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]