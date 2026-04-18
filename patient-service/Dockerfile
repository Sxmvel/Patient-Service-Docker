FROM node:18-alpine
WORKDIR /app

# 1. Copia PRIMEIRO o package.json
COPY package.json .

# 2. Instala as dependências (a biblioteca pg)
RUN npm install

# 3. Só depois copia o resto do código
COPY app.js .

EXPOSE 3000
CMD ["node", "app.js"]