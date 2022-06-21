# API SCHEMA

api/  
>auth/  
>>POST login  
>>POST register  
>>GET me

>GET username/:id --> if user exists return true else false

>GET|POST powerplants/  --> only powerplants of user 
>>GET|PATCH :id

>GET offers/ --> all live offers
>>GET :id

>GET|POST ppas/ --> only ppas of user GET 
>>GET|PATCH :id