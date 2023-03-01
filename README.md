# battle-judge-back

## Dependencies


### Global dependency
prettier => `npm install --global prettier` \
project-related => `npm install`

## Database if not created using Docker

```bash
# MariaDB
docker run -d \
        --name bj-mariadb \
        -p 3306:3306 \
        -v $(pwd)/db/scripts/maria-init.sql:/docker-entrypoint-initdb.d/script.sql \
        -e MARIADB_ROOT_PASSWORD=root \
        mariadb:10

# MongoDB
docker run -d \
        --name bj-mongo \
        -p 27017:27017 \
        -v $(pwd)/db/scripts/mongo-init.js:/docker-entrypoint-initdb.d/script.js \
        -e MONGO_INITDB_ROOT_USERNAME=root \
        -e MONGO_INITDB_ROOT_PASSWORD=root \
        mongo:6.0.3

# add these flag to keep data in track
# for MongoDB
# -v $(pwd)/db/data/mongodb:/data/db \
# for MariaDB
# -v $(pwd)/db/data/mariadb:/var/lib/mysql \

```

## .env

Development environment config only !!! (to change for production)

```dotenv
MONGO_URI=mongodb://root:root@localhost:27017/battle_judge # REDACTED
MARIADB_URI=mariadb://root:root@localhost:3306/battle_judge # REDACTED
PORT=3000 # REDACTED
JWT_SECRET=m5@4jp&2P$kkfq&m6jh&@p5CjY # REDACTED
```
