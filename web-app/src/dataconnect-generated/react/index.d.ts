import { ListAllContentTypesData, GetMyContentPiecesData, GetMyContentPiecesVariables, CreateNewCommentData, CreateNewCommentVariables, GetContentPieceWithCommentsData, GetContentPieceWithCommentsVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useListAllContentTypes(options?: useDataConnectQueryOptions<ListAllContentTypesData>): UseDataConnectQueryResult<ListAllContentTypesData, undefined>;
export function useListAllContentTypes(dc: DataConnect, options?: useDataConnectQueryOptions<ListAllContentTypesData>): UseDataConnectQueryResult<ListAllContentTypesData, undefined>;

export function useGetMyContentPieces(vars: GetMyContentPiecesVariables, options?: useDataConnectQueryOptions<GetMyContentPiecesData>): UseDataConnectQueryResult<GetMyContentPiecesData, GetMyContentPiecesVariables>;
export function useGetMyContentPieces(dc: DataConnect, vars: GetMyContentPiecesVariables, options?: useDataConnectQueryOptions<GetMyContentPiecesData>): UseDataConnectQueryResult<GetMyContentPiecesData, GetMyContentPiecesVariables>;

export function useCreateNewComment(options?: useDataConnectMutationOptions<CreateNewCommentData, FirebaseError, CreateNewCommentVariables>): UseDataConnectMutationResult<CreateNewCommentData, CreateNewCommentVariables>;
export function useCreateNewComment(dc: DataConnect, options?: useDataConnectMutationOptions<CreateNewCommentData, FirebaseError, CreateNewCommentVariables>): UseDataConnectMutationResult<CreateNewCommentData, CreateNewCommentVariables>;

export function useGetContentPieceWithComments(vars: GetContentPieceWithCommentsVariables, options?: useDataConnectQueryOptions<GetContentPieceWithCommentsData>): UseDataConnectQueryResult<GetContentPieceWithCommentsData, GetContentPieceWithCommentsVariables>;
export function useGetContentPieceWithComments(dc: DataConnect, vars: GetContentPieceWithCommentsVariables, options?: useDataConnectQueryOptions<GetContentPieceWithCommentsData>): UseDataConnectQueryResult<GetContentPieceWithCommentsData, GetContentPieceWithCommentsVariables>;
