FROM node:18

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de configuración para instalar dependencias
COPY package*.json ./

# Instalar las dependencias globales y locales
RUN npm install -g @nestjs/cli
RUN npm install


# Copiar el resto de los archivos de la aplicación
COPY . .

# Exponer el puerto en el que la aplicación se ejecutará
EXPOSE 3000

# Comando por defecto para iniciar la aplicación
CMD ["npm", "run", "start:dev"]
