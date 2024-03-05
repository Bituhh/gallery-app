# Gallery App

This is a simple gallery app that allows users to view images, group them into albums and tag them with keywords.

## Features
- View images
- Group images into albums
- Tag images with keywords
- Search for images by album or keyword
- Order images by ascending or descending date of upload

## Stack
The app is built split into 4 parts:
1. Frontend: Ionic + Angular + Amplify - Authentication and image storage
2. Backend: NestJs + TypeORM - REST API
3. Database: PostgreSQL
4. Infrastructure: AWS CDK - S3 bucket for image storage, Cognito Identity Pool for user authentication and IAM roles for access control.

## Running the app
2. Edit the `.env` file at the root of the project to your liking.
3. Run `docker-compose up` at the root of the project to start the database.
4. Run `npm install` at the root, `./backend` and `./frontend` to install the dependencies.
5. Run `npm run start` from `./backend` to start the nestjs app.
6. Run `npm run start` from `./frontend` to start the ionic/angular app.
7. Open the app in your browser at [http://localhost:4200](http://localhost:4200).

> Note: The app S3 and Cognito resources were created using AWS CDK. You can via the code in the `./infrastructure` folder. The resources are already created and there is no need to run the CDK code. However, if you which to create the resources in your own AWS account, I recommend you read the [AWS CDK Getting Started](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html) guide, as you need might need to configure you AWS CLI and CDK before running the code. Please note that you will need to change the .env file to reflect the new resources created.

