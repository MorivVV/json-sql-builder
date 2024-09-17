"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mqlFetchQuery = exports.Query = void 0;
var classQuery_1 = require("./creators/classQuery");
Object.defineProperty(exports, "Query", { enumerable: true, get: function () { return classQuery_1.Query; } });
var fetchQuery_1 = require("./functions/fetchQuery");
Object.defineProperty(exports, "mqlFetchQuery", { enumerable: true, get: function () { return fetchQuery_1.mqlFetchQuery; } });
