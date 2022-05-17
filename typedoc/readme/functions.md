# functions folder

The main porpuse of this folder is to handle/organize the communication to the backend, as like fetch, add, delete and update a data.

## context

This is a variable, that is a parameter in the most of the functions inside this folder.

`context` is an object that has `APIContext` type, that is the following:

```ts
interface APIContext {
	host: string;
	useEncryption: boolean;
	authToken: string | null;
	fetch: typeof fetch;
}
```
