"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loader_1 = require("../../src/config/loader");
describe('Config Loader', () => {
    it('should load and validate the default config', () => {
        const config = (0, loader_1.loadConfig)();
        expect(config).toBeDefined();
        expect(config.providers.openai.enabled).toBe(true);
    });
});
