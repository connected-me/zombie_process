FROM node:16
COPY /cacert/root_ca.crt /usr/local/share/ca-certificates/root_ca.crt
RUN update-ca-certificates
WORKDIR /app
COPY package*.json /app
RUN ls -alh
RUN npm install
COPY . /app
EXPOSE 3000
CMD ["npm", "start"]