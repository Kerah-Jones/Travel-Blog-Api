# sh curl-scripts/index.sh

curl "http://localhost/2111/blogs/${ID}" \
--include \
--request PATCH \
--header "Content-Type: application/json" \
--data '{
  "blog": {
    "title": "'"${TITLE}"'",
    "date": "'"${DATE}"'",
    "post": "'"${POST}"'"
  }
}'
