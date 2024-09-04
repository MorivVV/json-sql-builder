"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessTable = exports.defaultSchema = void 0;
/// <reference types="node" />
exports.defaultSchema = process.env.DEFAULT_POSTGRES_SCHEMA || "public";
exports.accessTable = process.env.ACCESS_TABLE || [
    "pg_catalog",
    "information_schema",
];
