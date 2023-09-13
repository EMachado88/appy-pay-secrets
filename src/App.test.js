import { render, screen } from '@testing-library/react';

import App from './App';

window.matchMedia = window.matchMedia || function() {
  return {
      matches: false,
      addListener: function() {},
      removeListener: function() {}
  };
};

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the Menu with correct items', () => {
    render(<App />);
    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems).toHaveLength(2);
    expect(menuItems[0]).toHaveTextContent('API Keys');
    expect(menuItems[1]).toHaveTextContent('Information');
  });

  it('renders the Credential and Secrets components', () => {
    render(<App />);
    expect(screen.getByTestId('credential-component')).toBeInTheDocument();
    expect(screen.getByTestId('secrets-component')).toBeInTheDocument();
  });
});
