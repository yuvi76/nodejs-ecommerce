<div align="center">
    <h1>   
       Nodejs Ecommerce
    </h1>
</div>

## Prerequsite

- NodeJS >= v12.18.3
- mongoDB >= v4.2.3

## Installation

1. clone repo
```
$ git clone https://github.com/yuvi76/nodejs-ecommerce.git
$ cd nodejs-ecommerce
```
2. create `.env` file 
3. add following data:
```
# Development
NODE_ENV = dev

# SERVER DETAILS
URL = Server_IP_Address_or_domain_url
PORT = Server_Port

# DB DETAILS
DB_URL=Your_db_url

# JWT KEY
JWT_SECRET = jwt-secret

```
4. install node modules
```
$ npm i
```
5. start web server
```
$ npm start
```
6. server will start on port define in `.env` or `3000`(default).
