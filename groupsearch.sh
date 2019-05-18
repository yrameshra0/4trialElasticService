#!/bin/sh
req='{
    "query": {
        "bool": {
            "should": [
                {
                    "match": {
                        "name": "Sam Worthington"
                    }
                },
                {
                    "match": {
                        "name": "Julie Lamm"
                    }
                },
                {
                    "match": {
                        "name": "Giovanni Ribisi"
                    }
                },
                {
                    "match": {
                        "name": "April Marie Thomas"
                    }
                },
                {
                    "match": {
                        "originalLanguage": "English"
                    }
                }
            ]
        }
    },
    "size": 0,
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
                        "_source": [
                            "movieId"
                        ]
                    }
                }
            }
        }
    }
}'
echo "$req"
curl -X GET "localhost:9200/movies/_search" -H 'Content-Type: application/json' -d "$req" | jq
