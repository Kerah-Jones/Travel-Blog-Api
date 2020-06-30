curl 'http://localhost:4741/blogs' \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --data '{
    "blog": {
      "title": "'"${TITLE}"'",
      "date": "'"${DATE}"'",
      "post": "'"${POST}"'",
      "owner": "'"${OWNER}"'"
    }
  }'
