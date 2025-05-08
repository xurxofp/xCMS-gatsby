FROM node:22-slim

EXPOSE 8000 
EXPOSE 4001

WORKDIR /home/gatsby-app

# (Opcional) Si tu app necesita curl o procps para tu script de espera:
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    procps \
    awscli \
    # python3 \
    # python3-pip \
  && rm -rf /var/lib/apt/lists/*

# RUN pip3 install awscli

# Instala Gatsby CLI
RUN npm install -g gatsby-cli

# Copia sólo package.json para cachear npm install
COPY package*.json ./

# npm install con permisos (para que prebuild-install funcione como root)
RUN npm install --unsafe-perm

# Copy sourcecode files
COPY . .

# RUN yarn add express

CMD ["node", "server.js"]

# RUN chmod +x ./wait-for-strapi.sh

# Node image provide build-in non-root user
#USER node

#CMD ["gatsby", "develop", "-H", "0.0.0.0" ]