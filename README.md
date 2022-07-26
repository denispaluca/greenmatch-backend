# GreenMatch BackEnd.
This is the backend of the Green Match system.

## Prerequisites
- [node](https://nodejs.org/en/): v18.6.0
- [npm](https://www.npmjs.com/): v8.11

## Setup
- The environment file ".env" already has the connection string which points to our populated database. If you want to connect to your local database change the property "DB_URI".
- The JWT_SECRET can also be changed, but we advise against it.
- If you intend to use your own stripe account change the STRIPE_SK. (Afterwards you cannot use our database. We also advise against this.)

## Running the project
1. Install all the project dependencies: ```npm install```
2. Run the project: ```npm start```

## Credentials
- MongoDB Atlas: email ```energiesucher@yahoo.com``` password ```B4T#Ly3zM!86```
- Stripe: email ```energiesucher@yahoo.com``` password ```B4T#Ly3zM!86```

## API SCHEMA

api/  
>auth/  
>>POST login  
>>POST register  
>>GET logout
>>GET setupIntent --> Returns stripe id to be used for subscription.

>GET email/:id --> if user exists return true else false

>GET|POST powerplants/  --> only powerplants of supplier 
>>GET|PATCH|DELETE :id

>GET offers/ --> all live offers
>>GET :id

>GET|POST ppas/ --> returns only ppas of user 
>>GET :id
>>PATCH :id --> only for supplier, cancles PPA

>GET notifications/
>>PATCH :id --> Mark notification as read
