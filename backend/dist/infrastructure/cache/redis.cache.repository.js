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
exports.RedisCacheRepository = void 0;
const redis_1 = require("redis");
class RedisCacheRepository {
    constructor() {
        this.client = (0, redis_1.createClient)({ url: "redis://localhost:6379" });
        this.client.on("error", (err) => {
            console.error("Redis connected: ❌\n", err);
        });
        this.client.on("connect", () => console.log("Redis connected: ✅"));
    }
    getCachedData(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.get(key);
        });
    }
    setCachedData(key, value, expiry) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.set(key, value, {
                EX: expiry,
            });
        });
    }
    removeCachedData(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.del(key);
        });
    }
}
exports.RedisCacheRepository = RedisCacheRepository;
