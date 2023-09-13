import { maskCharactersFromIndex, copyToClipboard } from './utils';

describe('maskCharactersFromIndex', () => {
  it('should mask characters from the given index', () => {
    const result = maskCharactersFromIndex('1234567890', 5);
    expect(result).toEqual('12345*****');
  });

  it('should return the input string if the index is out of range', () => {
    const result = maskCharactersFromIndex('1234567890', 15);
    expect(result).toEqual('1234567890');
  });
});

describe('copyToClipboard', () => {
  const originalConsoleError = console.error;
  const mockMessageApi = { open: jest.fn() };

  beforeEach(() => {
    console.error = jest.fn();

    if (!navigator.clipboard) {
      navigator.clipboard = {};
    }
    navigator.clipboard.writeText = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('should copy value to clipboard and show success message', async () => {
    await copyToClipboard('test value', mockMessageApi);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test value');
    expect(mockMessageApi.open).toHaveBeenCalledWith({
      type: 'success',
      content: 'Credential copied successfully',
    });
  });

  it('should log an error if copying to clipboard fails', async () => {
    const error = new Error('Failed to copy text');
    navigator.clipboard.writeText.mockImplementationOnce(() => { throw error; });
    await copyToClipboard('test value', mockMessageApi);
    expect(console.error).toHaveBeenCalledWith(error);
  });
});
