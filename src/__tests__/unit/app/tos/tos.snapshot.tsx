import TermsOfServicePage from '@/app/tos/page';
import { render, cleanup } from '@testing-library/react';

describe('TermsOfServicePage', () => {
  afterEach(cleanup);

  it('renders the terms of service page unchanged.', () => {
    const { container } = render(<TermsOfServicePage />);
    expect(container).toMatchSnapshot();
  });
});
