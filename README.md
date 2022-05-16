# Gravwell JavaScript Client

Wrapper for the [Gravwell Web API](https://docs.gravwell.io/#!api/api.md).

- Exported in ES5
- Works on Node and browsers
- Full TypeScript coverage

Install it with NPM

```sh
npm install gravwell
```

## Contributing

Make sure you understand our [contributing guide](./CONTRIBUTING.md) before doing any work.

## Generate docs

First run `npm install`, to inastall all dependencies, then run `npm run start:docs`, then the docs from this project will be generated and a server on port 8080 will be started, so go to `http://localhost:8080` to see the docs. When you open the docs, it's important to `disable the cache` to a better experience, otherwise it will have a delay every time you update the docs.

### How to generate a docs from a diferent folder

This pr has added a implementation to generate a docs every time we run npm run start:docs. This will generate a document to all the files inside the folders ['src/function', 'src/models', 'src/service', 'src/tests', 'src/value-objects'].

If you want a document from a different folder you need to go to typedoc/typedoc.js and write a new line with generateDocsPage() it should looks like:

generateDocsPage(object).then(() => setLinks(${new_folder_name}));

Inside the function generateAllDocsPage(), note that you need to provide a parameter to generateDocsPage, that is a object, if your new folder has sub-folders inside it, the object should looks like:

{
entryPointStrategy: 'Resolve',
entryPoints: getEntryPoints(${new_folder_path}),
outputDir: docs/modules/${new_folder_name}
}

If your new folder just have files, it should looks like:

{
entryPointStrategy: 'Expand',
entryPoints: ${new_folder_path},
outputDir: docs/modules/${new_folder_name}
};
