PUBLISH_BRANCH:=test-pages

setup:
	npm install

prep_branch:
	git branch -D ${PUBLISH_BRANCH} | true
	git checkout -b ${PUBLISH_BRANCH}

build:
	NODE_ENV=production npm run build

publish_branch:
	git commit -a --author="CircleCI Script <>" -m "Build static assets"
	git push --quiet ${CIRCLE_REPOSITORY_URL} +${PUBLISH_BRANCH};

run:
	./node_modules/.bin/gulp watch 
