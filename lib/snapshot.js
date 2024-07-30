'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _weakMap = require('babel-runtime/core-js/weak-map');

var _weakMap2 = _interopRequireDefault(_weakMap);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.default = snapshot;
exports.makeSnapshotFunction = makeSnapshotFunction;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function snapshotObject(obj, origRef, context) {
  var ref = origRef;
  var changed = false;
  if ((typeof ref === 'undefined' ? 'undefined' : (0, _typeof3.default)(ref)) !== 'object') {
    changed = true;
    ref = {};
  }

  var snapshotHelper = context.snapshotHelper;

  var keys = (0, _keys2.default)(obj);
  var clone = {};
  var foundRefKeys = 0;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (key.lastIndexOf('_', 0) === 0 || key.lastIndexOf('Symbol(', 0) === 0) continue;
    if (ref.hasOwnProperty(key)) foundRefKeys++;

    var referenceStateForKey = ref[key];
    var clonedStateForKey = void 0;
    // In some cases,
    // properties listed in `Object.keys` may actually throw Errors on read
    try {
      clonedStateForKey = snapshotHelper(obj[key], referenceStateForKey, context);
      // eslint-disable-next-line no-empty
    } catch (e) {}
    clone[key] = clonedStateForKey;
    changed = changed || clonedStateForKey !== referenceStateForKey;
  }
  changed = changed || !(keys.length === foundRefKeys && (0, _keys2.default)(ref).length === foundRefKeys);
  return changed ? clone : ref;
}

function snapshotArray(arr, origRef, context) {
  var ref = origRef;
  var changed = false;
  if (!Array.isArray(ref)) {
    changed = true;
    ref = [];
  }

  var snapshotHelper = context.snapshotHelper;

  var clone = [];
  for (var i = 0; i < arr.length; i++) {
    var referenceStateForIndex = ref[i];
    var clonedStateForIndex = snapshotHelper(arr[i], referenceStateForIndex, context);
    clone[i] = clonedStateForIndex;
    changed = changed || clonedStateForIndex !== referenceStateForIndex;
  }
  changed = changed || arr.length !== ref.length;
  return changed ? clone : ref;
}

function stackSnapshotHelper(obj, ref, context) {
  if (obj === null) return obj;

  var type = typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj);
  if (type !== 'object' && type !== 'function') {
    return obj;
  }
  var stack = context.stack;


  if (stack.length > 2000) return undefined;
  if (stack.indexOf(obj) !== -1) return undefined;

  var snapper = Array.isArray(obj) ? snapshotArray : snapshotObject;
  stack.push(obj);
  var snap = snapper(obj, ref, context);
  stack.pop();
  return snap;
}

function mapSnapshotHelper(obj, origRef, context) {
  if (obj === null) return obj;

  var type = typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj);
  if (type !== 'object' && type !== 'function') {
    return obj;
  }
  var map = context.map;


  var mapRef = map.get(obj);
  var ref = origRef;
  if (mapRef) ref = mapRef;
  var snap = stackSnapshotHelper(obj, ref, context);
  map.set(obj, snap);
  return snap;
}

function snapshot(obj, ref) {
  return stackSnapshotHelper(obj, ref, { stack: [], snapshotHelper: stackSnapshotHelper });
}

function makeSnapshotFunction() {
  var map = new _weakMap2.default();
  return function (obj, ref) {
    return mapSnapshotHelper(obj, ref, { map: map, stack: [], snapshotHelper: mapSnapshotHelper });
  };
}