'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _toArray2 = require('babel-runtime/helpers/toArray');

var _toArray3 = _interopRequireDefault(_toArray2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _actionToMethod, _actionToEvent;

exports.default = createMiddleware;

var _contentDisposition = require('content-disposition');

var _contentDisposition2 = _interopRequireDefault(_contentDisposition);

var _constants = require('./constants');

var _snapshot3 = require('./snapshot');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var actionToMethod = (_actionToMethod = {}, (0, _defineProperty3.default)(_actionToMethod, _constants.ActionTypes.SET_OPTION, ['setOption', function (_ref) {
  var option = _ref.option,
      value = _ref.value;
  return [option, value];
}]), (0, _defineProperty3.default)(_actionToMethod, _constants.ActionTypes.REFRESH, ['refresh']), (0, _defineProperty3.default)(_actionToMethod, _constants.ActionTypes.START, ['start']), (0, _defineProperty3.default)(_actionToMethod, _constants.ActionTypes.STOP, ['stop']), (0, _defineProperty3.default)(_actionToMethod, _constants.ActionTypes.DISABLE_BROWSE, ['disableBrowse', function (_ref2) {
  var disable = _ref2.disable;
  return [disable];
}]), (0, _defineProperty3.default)(_actionToMethod, _constants.ActionTypes.ADD_FILE, ['addFile', function (_ref3) {
  var file = _ref3.file,
      fileName = _ref3.fileName;
  return [file, fileName];
}]), (0, _defineProperty3.default)(_actionToMethod, _constants.ActionTypes.REMOVE_FILE, ['removeFile', function (_ref4) {
  var file = _ref4.file;
  return [file];
}]), (0, _defineProperty3.default)(_actionToMethod, _constants.ActionTypes.DESTROY, ['destroy']), (0, _defineProperty3.default)(_actionToMethod, _constants.ActionTypes.CLEAR, ['splice']), _actionToMethod);

var actionToEvent = (_actionToEvent = {}, (0, _defineProperty3.default)(_actionToEvent, _constants.ActionTypes.INITING, ['Init', function () {
  return {};
}]), (0, _defineProperty3.default)(_actionToEvent, _constants.ActionTypes.POST_INIT, ['PostInit', function () {
  return {};
}]), (0, _defineProperty3.default)(_actionToEvent, _constants.ActionTypes.OPTION_CHANGED, ['OptionChanged', function (name, value, oldValue) {
  return { payload: { name: name, value: value, oldValue: oldValue } };
}]), (0, _defineProperty3.default)(_actionToEvent, _constants.ActionTypes.REFRESHING, ['Refresh', function () {
  return {};
}]), (0, _defineProperty3.default)(_actionToEvent, _constants.ActionTypes.STATE_CHANGED, ['StateChanged', function () {
  return {};
}]), (0, _defineProperty3.default)(_actionToEvent, _constants.ActionTypes.UPLOAD_FILE, ['UploadFile', function (file) {
  return { payload: file };
}]), (0, _defineProperty3.default)(_actionToEvent, _constants.ActionTypes.BEFORE_UPLOAD, ['BeforeUpload', function (file) {
  return { payload: file };
}]), (0, _defineProperty3.default)(_actionToEvent, _constants.ActionTypes.QUEUE_CHANGED, ['QueueChanged', function () {
  return {};
}]), (0, _defineProperty3.default)(_actionToEvent, _constants.ActionTypes.UPLOAD_PROGRESS, ['UploadProgress', function (file) {
  return { payload: file };
}]), (0, _defineProperty3.default)(_actionToEvent, _constants.ActionTypes.FILES_REMOVED, ['FilesRemoved', function (files) {
  return { payload: files };
}]), (0, _defineProperty3.default)(_actionToEvent, _constants.ActionTypes.FILE_FILTERED, ['FileFiltered', function (file) {
  return { payload: file };
}]), (0, _defineProperty3.default)(_actionToEvent, _constants.ActionTypes.FILES_ADDED, ['FilesAdded', function (files) {
  return { payload: files };
}]), (0, _defineProperty3.default)(_actionToEvent, _constants.ActionTypes.FILE_UPLOADED, ['FileUploaded', function (file, response) {
  return { payload: file, meta: { response: response } };
}]), (0, _defineProperty3.default)(_actionToEvent, _constants.ActionTypes.CHUNK_UPLOADED, ['ChunkUploaded', function (file, response) {
  return { payload: file, meta: { response: response } };
}]), (0, _defineProperty3.default)(_actionToEvent, _constants.ActionTypes.UPLOAD_COMPLETE, ['UploadComplete', function (files) {
  return { payload: files };
}]), (0, _defineProperty3.default)(_actionToEvent, _constants.ActionTypes.ERROR, ['Error', function (error) {
  return { payload: error, error: true };
}]), (0, _defineProperty3.default)(_actionToEvent, _constants.ActionTypes.DESTROYING, ['Destroy', function () {
  return {};
}]), _actionToEvent);

var defaults = {
  runtimes: 'html5,html4',
  max_retries: 3,
  multipart: true,
  url: '/this/is/replaced/',
  handle: _constants.DEFAULT_UPLOADER_HANDLE
};

function setupUpload(uploader, file) {
  var upload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _uploader$settings = uploader.settings,
      url = _uploader$settings.url,
      multipart_params = _uploader$settings.multipart_params;

  var newUrl = upload.url || url;
  var params = (0, _assign2.default)({}, multipart_params, upload.params || {});
  if (!params['Content-Type']) {
    params['Content-Type'] = file.type;
  }
  if (!params['Content-Disposition']) {
    params['Content-Disposition'] = (0, _contentDisposition2.default)(file.name);
  }
  if (uploader.runtime === 'html4') {
    params.redirect = global.location.href;
  }
  uploader.setOption({
    url: newUrl,
    multipart_params: params
  });
}

function init(store, plupload, options) {
  var uploader = new plupload.Uploader(options);
  uploader.handle = options.handle;
  var snapshot = (0, _snapshot3.makeSnapshotFunction)();

  uploader.bind('BeforeUpload', function (eventUploader, file) {
    var uploadSettingsSelector = options.uploadSettingsSelector;

    var upload = uploadSettingsSelector ? uploadSettingsSelector(store.getState(), file) : {};

    setupUpload(eventUploader, file, upload);
  });

  (0, _keys2.default)(actionToEvent).forEach(function (type) {
    var _actionToEvent$type = (0, _slicedToArray3.default)(actionToEvent[type], 2),
        event = _actionToEvent$type[0],
        argsToAction = _actionToEvent$type[1];

    uploader.bind(event, function () {
      for (var _len = arguments.length, origArgs = Array(_len), _key = 0; _key < _len; _key++) {
        origArgs[_key] = arguments[_key];
      }

      var _snapshot = snapshot(origArgs),
          _snapshot2 = (0, _toArray3.default)(_snapshot),
          uploaderState = _snapshot2[0],
          args = _snapshot2.slice(1);

      var action = argsToAction.apply(undefined, (0, _toConsumableArray3.default)(args));
      if (!action.meta) action.meta = {};
      action.meta.uploader = uploaderState;
      action.type = type;
      store.dispatch(action);
    });
  });

  uploader.init();
  return uploader;
}

function runUploaderMethod(uploader, type, payload) {
  var _ref5 = actionToMethod[type] || [],
      _ref6 = (0, _slicedToArray3.default)(_ref5, 2),
      method = _ref6[0],
      payloadTransform = _ref6[1];

  var args = payloadTransform ? payloadTransform(payload) : [];
  return uploader[method].apply(uploader, args || []);
}

function createMiddleware(plupload) {
  var origOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var uploaders = void 0;
  return function (store) {
    return function (next) {
      return function (action) {
        var type = action.type,
            _action$payload = action.payload,
            payload = _action$payload === undefined ? {} : _action$payload,
            _action$meta = action.meta,
            meta = _action$meta === undefined ? {} : _action$meta;

        uploaders = uploaders || {};
        var handle = (type === _constants.ActionTypes.INIT ? payload.handle : meta.handle) || defaults.handle;
        var uploader = uploaders[handle];
        if (type === _constants.ActionTypes.INIT) {
          if (uploader) throw new Error('INIT called on existing uploader');
          var options = (0, _assign2.default)({}, defaults, origOptions, payload);
          uploaders[handle] = init(store, plupload, options);
        }
        if (!uploader) return next(action);

        switch (type) {
          case _constants.ActionTypes.REFRESH:
          case _constants.ActionTypes.START:
          case _constants.ActionTypes.STOP:
          case _constants.ActionTypes.CLEAR:
          case _constants.ActionTypes.SET_OPTION:
          case _constants.ActionTypes.DISABLE_BROWSE:
          case _constants.ActionTypes.ADD_FILE:
          case _constants.ActionTypes.REMOVE_FILE:
            runUploaderMethod(uploader, type, payload);
            break;
          case _constants.ActionTypes.DESTROY:
            runUploaderMethod(uploader, type, payload);
            delete uploaders[handle];
            break;
          default:
            break;
        }

        return next(action);
      };
    };
  };
}