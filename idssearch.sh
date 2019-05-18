#!/bin/sh
req='{
    "query": {
        "ids": {
            "values": [
                "movieId:19995"
            ]
        }
    },
    "size": 0,
    "aggs": {
        "101": {
            "filter": {
                "term": {
                    "originalLanguage": "de"
                }
            },
            "aggs": {
                "groupByIds": {
                    "terms": {
                        "field": "id",
                        "include": [
                            "movieId:19995"
                        ]
                    },
                    "aggs": {
                        "allResluts": {
                            "top_hits": {
                                "sort": [
                                    {
                                        "title": "asc"
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        }
    }
}'
echo "$req"
curl -X GET "localhost:9200/movies/_search" -H 'Content-Type: application/json' -d "$req" | jq
