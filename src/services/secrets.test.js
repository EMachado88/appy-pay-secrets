import { getSecrets, addSecret } from './secrets';
import mockedSecrets from '../mocks/secrets.json';

describe('Secrets Service', () => {
  it('getSecrets should return mock secrets data', async () => {
    const result = await getSecrets();
    expect(result).toEqual(mockedSecrets.data);
  });

  it('addSecret should add a secret and return its id and value', async () => {
    const initialLength = mockedSecrets.data.length;
    const credential = { name: 'test', description: 'test description' };
    const result = await addSecret(credential);

    expect(result).toHaveProperty('secretId');
    expect(result).toHaveProperty('value');
    expect(mockedSecrets.data.length).toBe(initialLength + 1);
    expect(mockedSecrets.data[mockedSecrets.data.length - 1]).toMatchObject({
      ...credential,
      secretId: result.secretId,
      value: `***${result.value.slice(-3)}`,
    });
  });
});
