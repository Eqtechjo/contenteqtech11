import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Comment_Key {
  id: UUIDString;
  __typename?: 'Comment_Key';
}

export interface ContentField_Key {
  id: UUIDString;
  __typename?: 'ContentField_Key';
}

export interface ContentPiece_Key {
  id: UUIDString;
  __typename?: 'ContentPiece_Key';
}

export interface ContentType_Key {
  id: UUIDString;
  __typename?: 'ContentType_Key';
}

export interface CreateNewCommentData {
  comment_insert: Comment_Key;
}

export interface CreateNewCommentVariables {
  contentPieceId: UUIDString;
  text: string;
}

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

export interface GetContentPieceWithCommentsVariables {
  contentPieceId: UUIDString;
}

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

export interface GetMyContentPiecesVariables {
  assigneeId: UUIDString;
}

export interface ListAllContentTypesData {
  contentTypes: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    createdAt: TimestampString;
  } & ContentType_Key)[];
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface ListAllContentTypesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllContentTypesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllContentTypesData, undefined>;
  operationName: string;
}
export const listAllContentTypesRef: ListAllContentTypesRef;

export function listAllContentTypes(options?: ExecuteQueryOptions): QueryPromise<ListAllContentTypesData, undefined>;
export function listAllContentTypes(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllContentTypesData, undefined>;

interface GetMyContentPiecesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMyContentPiecesVariables): QueryRef<GetMyContentPiecesData, GetMyContentPiecesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetMyContentPiecesVariables): QueryRef<GetMyContentPiecesData, GetMyContentPiecesVariables>;
  operationName: string;
}
export const getMyContentPiecesRef: GetMyContentPiecesRef;

export function getMyContentPieces(vars: GetMyContentPiecesVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyContentPiecesData, GetMyContentPiecesVariables>;
export function getMyContentPieces(dc: DataConnect, vars: GetMyContentPiecesVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyContentPiecesData, GetMyContentPiecesVariables>;

interface CreateNewCommentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewCommentVariables): MutationRef<CreateNewCommentData, CreateNewCommentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateNewCommentVariables): MutationRef<CreateNewCommentData, CreateNewCommentVariables>;
  operationName: string;
}
export const createNewCommentRef: CreateNewCommentRef;

export function createNewComment(vars: CreateNewCommentVariables): MutationPromise<CreateNewCommentData, CreateNewCommentVariables>;
export function createNewComment(dc: DataConnect, vars: CreateNewCommentVariables): MutationPromise<CreateNewCommentData, CreateNewCommentVariables>;

interface GetContentPieceWithCommentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetContentPieceWithCommentsVariables): QueryRef<GetContentPieceWithCommentsData, GetContentPieceWithCommentsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetContentPieceWithCommentsVariables): QueryRef<GetContentPieceWithCommentsData, GetContentPieceWithCommentsVariables>;
  operationName: string;
}
export const getContentPieceWithCommentsRef: GetContentPieceWithCommentsRef;

export function getContentPieceWithComments(vars: GetContentPieceWithCommentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetContentPieceWithCommentsData, GetContentPieceWithCommentsVariables>;
export function getContentPieceWithComments(dc: DataConnect, vars: GetContentPieceWithCommentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetContentPieceWithCommentsData, GetContentPieceWithCommentsVariables>;

