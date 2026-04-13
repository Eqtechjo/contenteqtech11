const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs, makeMemoryCacheProvider } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'eqtechcontent',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;
const dataConnectSettings = {
  cacheSettings: {
    cacheProvider: makeMemoryCacheProvider()
  }
};
exports.dataConnectSettings = dataConnectSettings;

const listAllContentTypesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllContentTypes');
}
listAllContentTypesRef.operationName = 'ListAllContentTypes';
exports.listAllContentTypesRef = listAllContentTypesRef;

exports.listAllContentTypes = function listAllContentTypes(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAllContentTypesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getMyContentPiecesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyContentPieces', inputVars);
}
getMyContentPiecesRef.operationName = 'GetMyContentPieces';
exports.getMyContentPiecesRef = getMyContentPiecesRef;

exports.getMyContentPieces = function getMyContentPieces(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getMyContentPiecesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const createNewCommentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewComment', inputVars);
}
createNewCommentRef.operationName = 'CreateNewComment';
exports.createNewCommentRef = createNewCommentRef;

exports.createNewComment = function createNewComment(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createNewCommentRef(dcInstance, inputVars));
}
;

const getContentPieceWithCommentsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetContentPieceWithComments', inputVars);
}
getContentPieceWithCommentsRef.operationName = 'GetContentPieceWithComments';
exports.getContentPieceWithCommentsRef = getContentPieceWithCommentsRef;

exports.getContentPieceWithComments = function getContentPieceWithComments(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getContentPieceWithCommentsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;
