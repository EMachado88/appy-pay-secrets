import { getCredential } from './credential';
import mockedCredential from '../mocks/credential.json';

describe('getCredential', () => {
  it('should return mock credential data', async () => {
    const result = await getCredential();
    expect(result).toEqual(mockedCredential.data);
  });
});
