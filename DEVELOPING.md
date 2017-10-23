### Developing locally

```sh
npm install
npm run watch
```

### Deploying to production

Automated deployment of minified assets and generated files to [GitHub Pages](https://pages.github.com/) happens on every commit to `master` and is handled by [CircleCI](https://circleci.com/) using a [GitHub read/write deploy key](https://circleci.com/docs/2.0/gh-bb-integration/#adding-readwrite-deployment-keys-to-github-or-bitbucket).
