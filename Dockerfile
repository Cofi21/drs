# Stage 1: Build the client
FROM node:14 as client-builder

WORKDIR /client

COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

# Stage 2: Build the server
FROM python:3.9

WORKDIR /server

COPY server/ .

RUN pip install --no-cache-dir -r requirements.txt

# Copy the built client application from the client-builder stage
COPY --from=client-builder /client/build /server/client/build

# Expose the port the app runs on
EXPOSE 5000

# Define environment variable
ENV NAME World

# Run the application
CMD ["python", "app.py"]
