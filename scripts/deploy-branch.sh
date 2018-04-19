#!/bin/bash
REPO=$(basename `git rev-parse --show-toplevel`)
BRANCH=$(git rev-parse --abbrev-ref HEAD)
BUCKET="$REPO-stage-$BRANCH"

# if bucket doesn't exist, create it and set up website hosting
if aws s3 ls "s3://$BUCKET" 2>&1 | grep -q 'NoSuchBucket'; then
  echo "Creating $BUCKET bucket"
  aws s3 mb "s3://$BUCKET"
  aws s3 website "s3://$BUCKET" --index-document index.html --error-document error.html
fi

# sync site
aws s3 sync --acl public-read --delete dist/ "s3://$BUCKET"
echo "$BRANCH branch deployed to http://$BUCKET.s3-website-us-east-1.amazonaws.com"
