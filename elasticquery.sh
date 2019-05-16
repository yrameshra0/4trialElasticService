#!/bin/sh
req="{
    \"query\": {
        \"bool\": {
            \"must\": [
                {
                    \"match\": {
                        \"name\":\"$1\"
                    }
                }
            ],
            \"should\": [
                {
                    \"match\": {
                        \"name\": \"Sam Worthington\"
                    }
                },
                {
                    \"match\": {
                        \"name\": \"Tom Hanks\"
                    }
                },
                {
                    \"match\": {
                        \"originalLanguage\": \"English\"
                    }
                }
            ]
        }
    },
    \"sort\": [
      {
        \"title\": \"asc\"
      }
    ]
}"
echo "$req"
curl -X GET "localhost:9200/movies/_search" -H 'Content-Type: application/json' -d "$req" | jq
