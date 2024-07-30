'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createReducer = createReducer;

var _constants = require('./constants');

function createReducer() {
  var handle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _constants.DEFAULT_UPLOADER_HANDLE;

  return function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { handle: handle };
    var _ref = arguments[1];
    var type = _ref.type,
        _ref$meta = _ref.meta;
    _ref$meta = _ref$meta === undefined ? {} : _ref$meta;
    var uploader = _ref$meta.uploader;

    switch (type) {
      case _constants.ActionTypes.INITING:
      case _constants.ActionTypes.POST_INIT:
      case _constants.ActionTypes.OPTION_CHANGED:
      case _constants.ActionTypes.REFRESHING:
      case _constants.ActionTypes.STATE_CHANGED:
      case _constants.ActionTypes.UPLOAD_FILE:
      case _constants.ActionTypes.BEFORE_UPLOAD:
      case _constants.ActionTypes.QUEUE_CHANGED:
      case _constants.ActionTypes.UPLOAD_PROGRESS:
      case _constants.ActionTypes.FILES_REMOVED:
      case _constants.ActionTypes.FILE_FILTERED:
      case _constants.ActionTypes.FILES_ADDED:
      case _constants.ActionTypes.FILE_UPLOADED:
      case _constants.ActionTypes.CHUNK_UPLOADED:
      case _constants.ActionTypes.UPLOAD_COMPLETE:
      case _constants.ActionTypes.ERROR:
      case _constants.ActionTypes.DESTROYING:
        return uploader.handle === handle ? uploader : state;
      default:
        return state;
    }
  };
}

exports.default = createReducer();