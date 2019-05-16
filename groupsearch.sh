#!/bin/sh
req='{
    "aggs": {
        "101": {
            "terms": {
                "field": "name.raw",
                "include": [
                    "Sam Worthington",
                    "Julie Lamm",
                    "Giovanni Ribisi"
                ]
            },
            "aggs": {
                "allResluts": {
                    "top_hits": {
                        "sort": [
                            {
                                "name.raw": {
                                    "order": "asc"
                                }
                            }
                        ]
                    }
                }
            }
        }
    }
}'
echo "$req"
curl -X GET "localhost:9200/movies/_search" -H 'Content-Type: application/json' -d "$req" | jq
