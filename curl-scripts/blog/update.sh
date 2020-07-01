# sh curl-scripts/index.sh

curl "http://localhost:4741/blogs/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
--header "Authorization: Bearer ${TOKEN}" \
--data '{
  "blog": {
    "title": "'"${TITLE}"'",
    "date": "'"${DATE}"'",
    "post": "'"${POST}"'"
  }
}'
