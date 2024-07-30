'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_UPLOADER_HANDLE = exports.ActionTypes = exports.Errors = exports.States = exports.FileStatus = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _keymirror = require('keymirror');

var _keymirror2 = _interopRequireDefault(_keymirror);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copied from plupload
var FileStatus = exports.FileStatus = {
  QUEUED: 1,
  UPLOADING: 2,
  FAILED: 4,
  DONE: 5,
  RESIZING: 6
};

// Copied from plupload
var States = exports.States = {
  STOPPED: 1,
  STARTED: 2
};

// Copied from plupload
var Errors = exports.Errors = {
  GENERIC_ERROR: -100,
  HTTP_ERROR: -200,
  IO_ERROR: -300,
  SECURITY_ERROR: -400,
  INIT_ERROR: -500,
  FILE_SIZE_ERROR: -600,
  FILE_EXTENSION_ERROR: -601,
  FILE_DUPLICATE_ERROR: -602,
  IMAGE_FORMAT_ERROR: -700,
  MEMORY_ERROR: -701,
  IMAGE_DIMENSIONS_ERROR: -702,
  OPTION_ERROR: -800
};

var ActionTypes = exports.ActionTypes = (0, _keymirror2.default)({
  INIT: null,
  SET_OPTION: null,
  REFRESH: null,
  START: null,
  STOP: null,
  DISABLE_BROWSE: null,
  ADD_FILE: null,
  REMOVE_FILE: null,
  DESTROY: null,
  CLEAR: null,

  INITING: null,
  POST_INIT: null,
  OPTION_CHANGED: null,
  REFRESHING: null,
  STATE_CHANGED: null,
  UPLOAD_FILE: null,
  BEFORE_UPLOAD: null,
  QUEUE_CHANGED: null,
  UPLOAD_PROGRESS: null,
  FILES_REMOVED: null,
  FILE_FILTERED: null,
  FILES_ADDED: null,
  FILE_UPLOADED: null,
  CHUNK_UPLOADED: null,
  UPLOAD_COMPLETE: null,
  ERROR: null,
  DESTROYING: null
});

(0, _keys2.default)(ActionTypes).forEach(function (key) {
  ActionTypes[key] = 'redux-plupload/' + key;
});

var DEFAULT_UPLOADER_HANDLE = exports.DEFAULT_UPLOADER_HANDLE = 'default';