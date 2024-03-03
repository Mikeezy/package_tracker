

## Description

Package tracker 

## Installation
 - Build the sdk
```bash
$ cd sdk && yarn && yarn build
```
  - Install client dependencies
```bash
$ cd client && yarn
```
  - Install server dependencies
```bash
$ cd server && yarn
```


## Running the app locally

```bash
# rename .env.example into .env in client folder and fullfil it with informations
$ mv .env.example .env

# rename .env.example into .env in server folder and fullfil it with informations
$ mv .env.example .env

# start server 
$ cd server && yarn dev

# start client
$ cd client && yarn start

#By default, server port = 3005, websocket port = 3006
```
