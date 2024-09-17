"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mqlFetchQuery = void 0;
/**
 *
 * Функция получения данных из запроса в формате JSON
 */
const mqlFetchQuery = (mql_1, url_1, ...args_1) => __awaiter(void 0, [mql_1, url_1, ...args_1], void 0, function* (
/**Запрос в формате JSON */
mql, 
/**Ссылка на апи */
url, 
/**Токен для авторизации */
token = "") {
    const data = JSON.stringify(mql);
    const conf = {
        body: data,
        credentials: "same-origin",
        method: "POST",
        headers: {
            "V-Token": token,
            "Content-Type": "application/json;charset=utf-8",
        },
    };
    return fetch(url, conf).then((response) => __awaiter(void 0, void 0, void 0, function* () {
        let restext = "";
        try {
            restext = yield response
                .json()
                .catch(() => ({ err: { code: response.status } }));
        }
        catch (error) {
            restext = yield response.text();
        }
        return restext;
    }));
});
exports.mqlFetchQuery = mqlFetchQuery;
