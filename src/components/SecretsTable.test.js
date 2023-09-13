import { render, screen } from '@testing-library/react';

import SecretsTable from './SecretsTable';

window.matchMedia = window.matchMedia || function() {
  return {
      matches: false,
      addListener: function() {},
      removeListener: function() {}
  };
};

describe('SecretsTable component', () => {
  it('renders without crashing', () => {
    const mockSecrets = [
      {
        key: '1',
        name: 'Test Secret 1',
        created: '01-01-2023',
        valid: '31-12-2023',
        secret: 'secret1',
        status: 'active',
      },
      {
        key: '2',
        name: 'Test Secret 2',
        created: '02-01-2023',
        valid: '31-12-2023',
        secret: 'secret2',
        status: 'active',
      },
    ];

    render(<SecretsTable secrets={mockSecrets} />);
    const tableElement = screen.getByRole('table');
    expect(tableElement).toBeInTheDocument();
  });

  it('displays the correct data', () => {
    const mockSecrets = [
      {
        key: '1',
        name: 'Test Secret 1',
        created: '01-01-2023',
        valid: '31-12-2023',
        secret: 'secret1',
        status: 'active',
      },
    ];

    render(<SecretsTable secrets={mockSecrets} />);
    const nameCell = screen.getByText('Test Secret 1');
    const createdCell = screen.getByText('01-01-2023');
    const validCell = screen.getByText('31-12-2023');
    const secretCell = screen.getByText('secret1');
    const statusCell = screen.getByText('active');

    expect(nameCell).toBeInTheDocument();
    expect(createdCell).toBeInTheDocument();
    expect(validCell).toBeInTheDocument();
    expect(secretCell).toBeInTheDocument();
    expect(statusCell).toBeInTheDocument();
  });
});
