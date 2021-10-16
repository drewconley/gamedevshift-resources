# GameDev Shift resources

A collection of resources for game developers collected by the GameDev Shift community

Join the community here:
https://discord.gg/umD2GRy

## Contributing

### Adding resources

Simply edit `src/data.js` and raise a PR with the new resource.
Please follow the existing format.

### Updating the site

1.  Clone this repository
2.  Run `npm install`
3.  Run `npm run dev`

## Deployment instructions

### Initial setup

1.  Navigate to repository on Github
2.  Goto Settings
3.  Goto Pages
4.  Select branch `gh-pages` (if this is not yet visible, run a deployment first)
5.  Click Save

### Manual deployment

The following steps can be ran locally to publish a new version of the site. It will build the project on a `gh-pages` branch and push it to Github.

**Note** This will deploy anything and everything in the current directory - commited, staged or unstaged.

1. `npm run deploy`
