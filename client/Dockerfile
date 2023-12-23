# Koristite Node slike kao roditeljsku sliku
FROM node:latest

# Postavite radni direktorijum u kontejneru
WORKDIR /app

# Kopirajte paket fajlove
COPY ./package.json ./package-lock.json* ./

# Instalirajte zavisnosti
RUN npm install

# Kopirajte ostatak aplikacije
COPY . .

# Izgradite aplikaciju 
RUN npm run build

# Instalirajte serve i pokrenite ga na portu 3000
# RUN npm install -g serve
# CMD ["serve", "-s", "build", "-l", "3000"]
CMD ["npm","start"]