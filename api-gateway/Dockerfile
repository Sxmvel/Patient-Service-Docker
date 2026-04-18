# 1. IMAGEM BASE: Pega um Linux bem levinho (alpine)
FROM node:18-alpine

# 2. DIRETÓRIO DE TRABALHO: Cria uma pasta chamada /app dentro do container e entra nela
WORKDIR /app

# 3. COPIAR ARQUIVOS: Copia o nosso arquivo app.js
COPY app.js .

# 4. PORTA DE REDE: Informa que este container vai se comunicar através da porta 4000
EXPOSE 4000

# 5. COMANDO DE INÍCIO:
CMD ["node", "app.js"]