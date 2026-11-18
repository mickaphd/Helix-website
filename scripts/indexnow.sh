#!/bin/sh
# Tells Bing (and other IndexNow engines, which feed ChatGPT and Copilot search)
# that the site's pages changed. Run it after each push that changes the site.
set -e
KEY=bfdb7bf83d242b76cac5bddc3f71d8a1
curl -s -o /dev/null -w "IndexNow: HTTP %{http_code}\n" -X POST https://api.indexnow.org/indexnow \
    -H "Content-Type: application/json; charset=utf-8" \
    -d "{\"host\":\"www.helix-desktop.com\",\"key\":\"$KEY\",\"keyLocation\":\"https://www.helix-desktop.com/$KEY.txt\",\"urlList\":[\"https://www.helix-desktop.com/\",\"https://www.helix-desktop.com/faq/\",\"https://www.helix-desktop.com/llms.txt\"]}"
