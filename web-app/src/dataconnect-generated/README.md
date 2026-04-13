# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListAllContentTypes*](#listallcontenttypes)
  - [*GetMyContentPieces*](#getmycontentpieces)
  - [*GetContentPieceWithComments*](#getcontentpiecewithcomments)
- [**Mutations**](#mutations)
  - [*CreateNewComment*](#createnewcomment)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListAllContentTypes
You can execute the `ListAllContentTypes` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAllContentTypes(options?: ExecuteQueryOptions): QueryPromise<ListAllContentTypesData, undefined>;

interface ListAllContentTypesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllContentTypesData, undefined>;
}
export const listAllContentTypesRef: ListAllContentTypesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllContentTypes(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllContentTypesData, undefined>;

interface ListAllContentTypesRef {
  ...
  (dc: DataConnect): QueryRef<ListAllContentTypesData, undefined>;
}
export const listAllContentTypesRef: ListAllContentTypesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllContentTypesRef:
```typescript
const name = listAllContentTypesRef.operationName;
console.log(name);
```

### Variables
The `ListAllContentTypes` query has no variables.
### Return Type
Recall that executing the `ListAllContentTypes` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllContentTypesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllContentTypesData {
  contentTypes: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    createdAt: TimestampString;
  } & ContentType_Key)[];
}
```
### Using `ListAllContentTypes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllContentTypes } from '@dataconnect/generated';


// Call the `listAllContentTypes()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllContentTypes();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllContentTypes(dataConnect);

console.log(data.contentTypes);

// Or, you can use the `Promise` API.
listAllContentTypes().then((response) => {
  const data = response.data;
  console.log(data.contentTypes);
});
```

### Using `ListAllContentTypes`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllContentTypesRef } from '@dataconnect/generated';


// Call the `listAllContentTypesRef()` function to get a reference to the query.
const ref = listAllContentTypesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllContentTypesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.contentTypes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.contentTypes);
});
```

## GetMyContentPieces
You can execute the `GetMyContentPieces` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMyContentPieces(vars: GetMyContentPiecesVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyContentPiecesData, GetMyContentPiecesVariables>;

interface GetMyContentPiecesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMyContentPiecesVariables): QueryRef<GetMyContentPiecesData, GetMyContentPiecesVariables>;
}
export const getMyContentPiecesRef: GetMyContentPiecesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyContentPieces(dc: DataConnect, vars: GetMyContentPiecesVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyContentPiecesData, GetMyContentPiecesVariables>;

interface GetMyContentPiecesRef {
  ...
  (dc: DataConnect, vars: GetMyContentPiecesVariables): QueryRef<GetMyContentPiecesData, GetMyContentPiecesVariables>;
}
export const getMyContentPiecesRef: GetMyContentPiecesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyContentPiecesRef:
```typescript
const name = getMyContentPiecesRef.operationName;
console.log(name);
```

### Variables
The `GetMyContentPieces` query requires an argument of type `GetMyContentPiecesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetMyContentPiecesVariables {
  assigneeId: UUIDString;
}
```
### Return Type
Recall that executing the `GetMyContentPieces` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyContentPiecesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyContentPiecesData {
  contentPieces: ({
    id: UUIDString;
    title: string;
    status: string;
    createdAt: TimestampString;
    publicationDate?: TimestampString | null;
    contentType?: {
      name: string;
    };
  } & ContentPiece_Key)[];
}
```
### Using `GetMyContentPieces`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyContentPieces, GetMyContentPiecesVariables } from '@dataconnect/generated';

// The `GetMyContentPieces` query requires an argument of type `GetMyContentPiecesVariables`:
const getMyContentPiecesVars: GetMyContentPiecesVariables = {
  assigneeId: ..., 
};

// Call the `getMyContentPieces()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyContentPieces(getMyContentPiecesVars);
// Variables can be defined inline as well.
const { data } = await getMyContentPieces({ assigneeId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyContentPieces(dataConnect, getMyContentPiecesVars);

console.log(data.contentPieces);

// Or, you can use the `Promise` API.
getMyContentPieces(getMyContentPiecesVars).then((response) => {
  const data = response.data;
  console.log(data.contentPieces);
});
```

### Using `GetMyContentPieces`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyContentPiecesRef, GetMyContentPiecesVariables } from '@dataconnect/generated';

// The `GetMyContentPieces` query requires an argument of type `GetMyContentPiecesVariables`:
const getMyContentPiecesVars: GetMyContentPiecesVariables = {
  assigneeId: ..., 
};

// Call the `getMyContentPiecesRef()` function to get a reference to the query.
const ref = getMyContentPiecesRef(getMyContentPiecesVars);
// Variables can be defined inline as well.
const ref = getMyContentPiecesRef({ assigneeId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyContentPiecesRef(dataConnect, getMyContentPiecesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.contentPieces);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.contentPieces);
});
```

## GetContentPieceWithComments
You can execute the `GetContentPieceWithComments` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getContentPieceWithComments(vars: GetContentPieceWithCommentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetContentPieceWithCommentsData, GetContentPieceWithCommentsVariables>;

interface GetContentPieceWithCommentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetContentPieceWithCommentsVariables): QueryRef<GetContentPieceWithCommentsData, GetContentPieceWithCommentsVariables>;
}
export const getContentPieceWithCommentsRef: GetContentPieceWithCommentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getContentPieceWithComments(dc: DataConnect, vars: GetContentPieceWithCommentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetContentPieceWithCommentsData, GetContentPieceWithCommentsVariables>;

interface GetContentPieceWithCommentsRef {
  ...
  (dc: DataConnect, vars: GetContentPieceWithCommentsVariables): QueryRef<GetContentPieceWithCommentsData, GetContentPieceWithCommentsVariables>;
}
export const getContentPieceWithCommentsRef: GetContentPieceWithCommentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getContentPieceWithCommentsRef:
```typescript
const name = getContentPieceWithCommentsRef.operationName;
console.log(name);
```

### Variables
The `GetContentPieceWithComments` query requires an argument of type `GetContentPieceWithCommentsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetContentPieceWithCommentsVariables {
  contentPieceId: UUIDString;
}
```
### Return Type
Recall that executing the `GetContentPieceWithComments` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetContentPieceWithCommentsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetContentPieceWithCommentsData {
  contentPiece?: {
    id: UUIDString;
    title: string;
    description?: string | null;
    status: string;
    createdAt: TimestampString;
    publicationDate?: TimestampString | null;
    creator?: {
      displayName: string;
    };
      contentType?: {
        name: string;
      };
        comments_on_contentPiece: ({
          id: UUIDString;
          text: string;
          createdAt: TimestampString;
          user?: {
            displayName: string;
          };
        } & Comment_Key)[];
  } & ContentPiece_Key;
}
```
### Using `GetContentPieceWithComments`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getContentPieceWithComments, GetContentPieceWithCommentsVariables } from '@dataconnect/generated';

// The `GetContentPieceWithComments` query requires an argument of type `GetContentPieceWithCommentsVariables`:
const getContentPieceWithCommentsVars: GetContentPieceWithCommentsVariables = {
  contentPieceId: ..., 
};

// Call the `getContentPieceWithComments()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getContentPieceWithComments(getContentPieceWithCommentsVars);
// Variables can be defined inline as well.
const { data } = await getContentPieceWithComments({ contentPieceId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getContentPieceWithComments(dataConnect, getContentPieceWithCommentsVars);

console.log(data.contentPiece);

// Or, you can use the `Promise` API.
getContentPieceWithComments(getContentPieceWithCommentsVars).then((response) => {
  const data = response.data;
  console.log(data.contentPiece);
});
```

### Using `GetContentPieceWithComments`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getContentPieceWithCommentsRef, GetContentPieceWithCommentsVariables } from '@dataconnect/generated';

// The `GetContentPieceWithComments` query requires an argument of type `GetContentPieceWithCommentsVariables`:
const getContentPieceWithCommentsVars: GetContentPieceWithCommentsVariables = {
  contentPieceId: ..., 
};

// Call the `getContentPieceWithCommentsRef()` function to get a reference to the query.
const ref = getContentPieceWithCommentsRef(getContentPieceWithCommentsVars);
// Variables can be defined inline as well.
const ref = getContentPieceWithCommentsRef({ contentPieceId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getContentPieceWithCommentsRef(dataConnect, getContentPieceWithCommentsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.contentPiece);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.contentPiece);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateNewComment
You can execute the `CreateNewComment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createNewComment(vars: CreateNewCommentVariables): MutationPromise<CreateNewCommentData, CreateNewCommentVariables>;

interface CreateNewCommentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewCommentVariables): MutationRef<CreateNewCommentData, CreateNewCommentVariables>;
}
export const createNewCommentRef: CreateNewCommentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createNewComment(dc: DataConnect, vars: CreateNewCommentVariables): MutationPromise<CreateNewCommentData, CreateNewCommentVariables>;

interface CreateNewCommentRef {
  ...
  (dc: DataConnect, vars: CreateNewCommentVariables): MutationRef<CreateNewCommentData, CreateNewCommentVariables>;
}
export const createNewCommentRef: CreateNewCommentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createNewCommentRef:
```typescript
const name = createNewCommentRef.operationName;
console.log(name);
```

### Variables
The `CreateNewComment` mutation requires an argument of type `CreateNewCommentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateNewCommentVariables {
  contentPieceId: UUIDString;
  text: string;
}
```
### Return Type
Recall that executing the `CreateNewComment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateNewCommentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateNewCommentData {
  comment_insert: Comment_Key;
}
```
### Using `CreateNewComment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createNewComment, CreateNewCommentVariables } from '@dataconnect/generated';

// The `CreateNewComment` mutation requires an argument of type `CreateNewCommentVariables`:
const createNewCommentVars: CreateNewCommentVariables = {
  contentPieceId: ..., 
  text: ..., 
};

// Call the `createNewComment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createNewComment(createNewCommentVars);
// Variables can be defined inline as well.
const { data } = await createNewComment({ contentPieceId: ..., text: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createNewComment(dataConnect, createNewCommentVars);

console.log(data.comment_insert);

// Or, you can use the `Promise` API.
createNewComment(createNewCommentVars).then((response) => {
  const data = response.data;
  console.log(data.comment_insert);
});
```

### Using `CreateNewComment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createNewCommentRef, CreateNewCommentVariables } from '@dataconnect/generated';

// The `CreateNewComment` mutation requires an argument of type `CreateNewCommentVariables`:
const createNewCommentVars: CreateNewCommentVariables = {
  contentPieceId: ..., 
  text: ..., 
};

// Call the `createNewCommentRef()` function to get a reference to the mutation.
const ref = createNewCommentRef(createNewCommentVars);
// Variables can be defined inline as well.
const ref = createNewCommentRef({ contentPieceId: ..., text: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createNewCommentRef(dataConnect, createNewCommentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.comment_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.comment_insert);
});
```

