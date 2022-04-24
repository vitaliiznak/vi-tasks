#!/bin/sh




while ! nc -z $DATABASE_HOST $DATABASE_PORT; do   
  sleep 0.1 # wait for 1/10 of the second before check again
done

pwd;
npm run db-migrate up && pm2-runtime ./src/server.js;
    # src/server.js;

exec "$@"


# set -e
  
# host="$1"
# shift
  
# until PGPASSWORD=$DATABASE_PASSWORD psql -h "$DATABASE_HOST" -U "postgres" -c '\q'; do
#   >&2 echo "Postgres is unavailable - sleeping"
#   sleep 1
# done
  
# >&2 echo "Postgres is up - executing command"
# exec "$@"