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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function prefecturesDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.prefectures.createMany({
                        data: [
                            { placeId: 1, name: "北海道" },
                            { placeId: 2, name: "青森県" },
                            { placeId: 3, name: "岩手県" },
                            { placeId: 4, name: "宮城県" },
                            { placeId: 5, name: "秋田県" },
                            { placeId: 6, name: "山形県" },
                            { placeId: 7, name: "福島県" },
                            { placeId: 8, name: "茨城県" },
                            { placeId: 9, name: "栃木県" },
                            { placeId: 10, name: "群馬県" },
                            { placeId: 11, name: "埼玉県" },
                            { placeId: 12, name: "千葉県" },
                            { placeId: 13, name: "東京都" },
                            { placeId: 14, name: "神奈川県" },
                            { placeId: 15, name: "新潟県" },
                            { placeId: 16, name: "富山県" },
                            { placeId: 17, name: "石川県" },
                            { placeId: 18, name: "福井県" },
                            { placeId: 19, name: "山梨県" },
                            { placeId: 20, name: "長野県" },
                            { placeId: 21, name: "岐阜県" },
                            { placeId: 22, name: "静岡県" },
                            { placeId: 23, name: "愛知県" },
                            { placeId: 24, name: "三重県" },
                            { placeId: 25, name: "滋賀県" },
                            { placeId: 26, name: "京都府" },
                            { placeId: 27, name: "大阪府" },
                            { placeId: 28, name: "兵庫県" },
                            { placeId: 29, name: "奈良県" },
                            { placeId: 30, name: "和歌山県" },
                            { placeId: 31, name: "鳥取県" },
                            { placeId: 32, name: "島根県" },
                            { placeId: 33, name: "岡山県" },
                            { placeId: 34, name: "広島県" },
                            { placeId: 35, name: "山口県" },
                            { placeId: 36, name: "徳島県" },
                            { placeId: 37, name: "香川県" },
                            { placeId: 38, name: "愛媛県" },
                            { placeId: 39, name: "高知県" },
                            { placeId: 40, name: "福岡県" },
                            { placeId: 41, name: "佐賀県" },
                            { placeId: 42, name: "長崎県" },
                            { placeId: 43, name: "熊本県" },
                            { placeId: 44, name: "大分県" },
                            { placeId: 45, name: "宮崎県" },
                            { placeId: 46, name: "鹿児島県" },
                            { placeId: 47, name: "沖縄県" },
                        ],
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// 処理開始
prefecturesDatabase()
    .catch(function (e) {
    throw e;
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
