"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
async function main() {
    try {
        await mongoose_1.default.connect(config_1.default.database_url);
        app_1.default.listen(config_1.default.port, () => {
            // eslint-disable-next-line no-console
            console.log(`Server is running on port ${config_1.default.port}`);
        });
    }
    catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
    }
}
main();
//# sourceMappingURL=server.js.map