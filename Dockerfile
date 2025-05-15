# Use official Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy source code and data
COPY src ./src
COPY data ./data

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Compile TypeScript
RUN npx tsc

# Expose port
EXPOSE 3000

# Start the server
CMD ["ts-node", "dist/index.ts"]