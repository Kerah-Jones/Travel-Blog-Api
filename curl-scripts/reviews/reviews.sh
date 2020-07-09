curl 'http://localhost:4741/reviews' \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --data '{
    "review": {
      "title": "'"${TITLE}"'",
      "content": "'"${CONTENT}"'",
      "blogId":"'"${blog_ID}"'"
      "reviewer": "'"${USER_ID}"'"
    }
  }'
