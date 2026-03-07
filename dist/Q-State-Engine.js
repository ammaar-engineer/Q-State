"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Q_StateEngine = void 0;
var react_1 = require("react");
var Q_StateEngine = /** @class */ (function () {
    function Q_StateEngine(state, transformer, option) {
        var _this = this;
        this.subsribe = function (cb) {
            _this.listener.add(cb);
            return function () { return _this.listener.delete(cb); };
        };
        this.updateValue = function (key, func) {
            var _a;
            var executeFunc = func(_this.obj[key]);
            var transformData = (_this.transformer && _this.transformer[key])
                ? _this.transformer[key](executeFunc)
                : executeFunc;
            // Kita ambil saja data hasil update jika data dari layer transformer nya undefined
            var finalData = transformData !== null && transformData !== void 0 ? transformData : executeFunc;
            _this.obj[key] = finalData;
            if ((_a = _this.option) === null || _a === void 0 ? void 0 : _a.cache)
                localStorage.setItem(key, JSON.stringify(_this.obj[key]));
            _this.listener.forEach(function (cb) { return cb(); });
        };
        this.useQuantaState = function (key) {
            var getCurr = function () {
                var _a;
                if (((_a = _this.option) === null || _a === void 0 ? void 0 : _a.cache) && typeof window !== "undefined") {
                    var getcache = localStorage.getItem(key);
                    if (getcache !== null && getcache !== 'undefined') {
                        var dataFromCache = '';
                        try {
                            dataFromCache = JSON.parse(getcache);
                        }
                        catch (_b) {
                            dataFromCache = _this.obj[key];
                        }
                        if (dataFromCache !== _this.obj[key]) {
                            _this.obj[key] = dataFromCache;
                        }
                    }
                }
                return _this.obj[key];
            };
            var syncSpecificData = (0, react_1.useSyncExternalStore)(_this.subsribe, getCurr);
            return [syncSpecificData];
        };
        this.obj = state;
        this.transformer = transformer;
        this.listener = new Set();
        this.option = option;
    }
    return Q_StateEngine;
}());
exports.Q_StateEngine = Q_StateEngine;
