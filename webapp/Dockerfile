# Use the official Node.js 20.11.1 image as a parent image
FROM node:20.11.1

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
# Note: It's important to install dependencies before copying the whole app for cache optimization
RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

# Copy the rest of your app's source code
COPY . .

ARG mongoURI
ARG nextCloudName
ARG resendAPIKey
ARG blobConnectionString
ARG sendgridAPIKey
ENV MONGODB_URI=$mongoURI
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=$nextCloudName
ENV RESEND_API_KEY=$resendAPIKey
ENV BLOB_CONNECTION_STRING=$blobConnectionString
ENV SENDGRID_API_KEY=$sendgridAPIKey

# Build your Next.js application
RUN npm run build

RUN npm run test

# Your app binds to port 3000 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3000

# Define the command to run your app using CMD which defines your runtime
# Here we will use the "start" script defined in your package.json
CMD [ "npm", "start" ]
