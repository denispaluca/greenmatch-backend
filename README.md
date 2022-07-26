# GreenMatch BackEnd.
This is the backend of the GreenMatch system.

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
3. Supplier login: email ```hello@gruenstrom.de``` password ```123```
4. Buyer login: email ```energiesucher@yahoo.com``` password ```123```

## Credentials
- MongoDB Atlas: email ```energiesucher@yahoo.com``` password ```B4T#Ly3zM!86```
- Stripe (use test mode): email ```energiesucher@yahoo.com``` password ```B4T#Ly3zM!86```
- Yahoo Mail: email ```energiesucher@yahoo.com``` password ```8QYJcRd6KyAZnxw```

## API SCHEMA

api/  
>auth/  
>>POST login  
>>POST register  
>>GET logout  
>>GET setupIntent --> returns Stripe client secret to set up payment method for future payments  

>GET email/:id --> if user exists return true else false

>GET|POST powerplants/  --> only powerplants of supplier 
>>GET|PATCH|DELETE :id

>GET offers/ --> all live offers
>>GET :id

>GET|POST ppas/ --> returns only ppas of user 
>>GET :id
>>PATCH :id --> only for supplier, cancles PPA

>GET notifications/
>>PATCH :id --> mark notification as read
