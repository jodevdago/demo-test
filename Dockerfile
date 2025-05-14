# Étape 1 : Build de l'application Angular
FROM node:22.11.0-slim AS builder
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers et build l'app Angular
COPY . .
RUN npx ng build --configuration=production

# Étape 2 : Configuration de Nginx pour servir l'application
FROM nginx:alpine

# Copier les fichiers de build générés par Angular vers Nginx
COPY --from=builder /app/dist/support-it-app/browser /usr/share/nginx/html

# Copier la configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
