"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultSchema = void 0;
/// <reference types="node" />
exports.defaultSchema = process.env.DEFAULT_POSTGRES_SCHEMA || "public";
