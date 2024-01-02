export enum QueryKeys {
  messages = 'messages',
  allConversations = 'allConversations',
  conversation = 'conversation',
  searchEnabled = 'searchEnabled',
  user = 'user',
  name = 'name', // user key name
  models = 'models',
  balance = 'balance',
  endpoints = 'endpoints',
  presets = 'presets',
  searchResults = 'searchResults',
  tokenCount = 'tokenCount',
  availablePlugins = 'availablePlugins',
  startupConfig = 'startupConfig',
  assistants = 'assistants',
  assistant = 'assistant',
  endpointsConfigOverride = 'endpointsConfigOverride',
}

export enum MutationKeys {
  imageUpload = 'imageUpload',
  // UCLA BEGIN EDIT
  // Add excel upload mutation key
  excelUpload = 'imageUpload',
  // UCLA END EDIT
  fileDelete = 'fileDelete',
  updatePreset = 'updatePreset',
  deletePreset = 'deletePreset',
  logoutUser = 'logoutUser',
}
