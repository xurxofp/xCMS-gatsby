#!/bin/sh
# wait-for-strapi.sh

set -e

cmd="$@"

until $(curl --output /dev/null --silent --head --fail http://xCMS-strapi:1337); do
    >&2 echo  "Strapi is unavailable - sleeping"
    sleep 5
done

>&2 echo "Strapi is up - executing command"
exec $cmd