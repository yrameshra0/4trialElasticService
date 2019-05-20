#!/bin/sh
req=$(cat ./idsquery.json)
echo "$req"
curl -X GET "localhost:9200/movies/_search" -H 'Content-Type: application/json' -d "$req" | jq
