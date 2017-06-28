### Developing locally

```sh
npm install
npm run watch
```

### Publishing for production

Commit any changes to non-generated files separately, then update the generated `dist` files in a separate commit to facilitate easier rebasing. This step will eventually be handled automatically by a CI script.

```sh
NODE_ENV=production npm run build
```
