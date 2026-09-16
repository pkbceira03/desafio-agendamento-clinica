import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { App } from '../src/App';

describe('App Component', () => {
  it('deve renderizar o título principal do sistema clínico', () => {
    render(<App />);
    expect(screen.getByText('Sistema de Agendamento Clínico')).toBeInTheDocument();
  });
});