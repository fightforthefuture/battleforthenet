setup:
	npm install

build:
	NODE_ENV=production ./node_modules/.bin/gulp build

run:
	./node_modules/.bin/gulp watch 
