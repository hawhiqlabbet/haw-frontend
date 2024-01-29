# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:latest as build

# Set the working directory
WORKDIR /usr/local/app

# Add the source code to app
COPY ./ /usr/local/app/

# Install all the dependencies
RUN npm install -g @angular/cli
RUN npm install

# Generate the build of the application
RUN ng build


# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:latest

# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/local/app/dist/angular-client /usr/share/nginx/html

# Add custom Nginx configuration for JWT cookie handling
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80