# Step 1: Use official Node.js image as the base image
FROM node:20 AS base

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Install dependencies only when needed
COPY package.json package-lock.json ./

# Step 4: Install dependencies using Yarn (or npm if you prefer)
RUN npm install

# Step 5: Copy the rest of the application files
COPY . .

# Step 6: Build the Next.js app
RUN npm run build

# Step 7: Expose the port the app runs on
EXPOSE 3000

# Step 8: Start the app in production mode
CMD ["npm", "run", "start"]
