import { render, screen } from '@testing-library/react';
import Credential from './Credential';

jest.mock('../services/credential', () => ({
  getCredential: () => Promise.resolve({ value: 'test-credential' }),
}));

describe('Credential component', () => {
  it('renders without crashing', async () => {
    render(<Credential />);

    const credentialElement = await screen.findByTestId('credential-component');
    expect(credentialElement).toBeInTheDocument();
  });

  it('renders the credential value', async () => {
    render(<Credential />);

    const credentialValue = await screen.findByText('test-cre*******');
    expect(credentialValue).toBeInTheDocument();
  });
});
