
import { render, screen } from '@testing-library/react';
import MailRedactor from '../app/MailRedactor/page.tsx';

test('From element: exist in the DOM', () => {
    render(<MailRedactor />)
    expect(screen.getByButtonText<HTMLSelectElement>('Back')).toBeInTheDocument();
  });
