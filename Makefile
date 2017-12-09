PUBLISH_BRANCH:=gh-pages

setup:
	npm install

prep_branch:
	git branch -D ${PUBLISH_BRANCH} | true
	git checkout -b ${PUBLISH_BRANCH}

build:
	NODE_ENV=production npm run build
	NODE_ENV=production npm run htmllint

cache_bust:
	CACHE_BUST=`git rev-parse HEAD` && sed -i "s/CACHE_BUST/$$CACHE_BUST/g" index.html breaktheinternet/index.html breaktheinternet/twitter.html

publish_branch:
	git config user.email "fftf@users.noreply.github.com"
	git config user.name "CircleCI Script"
	git add -f dist/
	git commit -a -m "Build static assets"
	git push --quiet ${CIRCLE_REPOSITORY_URL} +${PUBLISH_BRANCH};

purge_cloudflare:
	curl -X DELETE "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE}/purge_cache" \
		-H "X-Auth-Email: ${CLOUDFLARE_EMAIL}" \
		-H "X-Auth-Key: ${CLOUDFLARE_SECRET}" \
		-H "Content-Type: application/json" \
		--data '{"purge_everything":true}'

run:
	./node_modules/.bin/gulp watch 
