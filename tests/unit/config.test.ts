import { loadConfig } from '../../src/config/loader';

describe('Config Loader', () => {
  it('should load and validate the default config', () => {
    const config = loadConfig();
    expect(config).toBeDefined();
    expect(config.providers.openai.enabled).toBe(true);
  });
});