import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Home } from '../src/pages/Home';
import { api } from '../src/services/api';

vi.mock('../src/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  }
}));

describe('Home Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve realizar o fluxo completo de agendamento com sucesso', async () => {
    (api.get as any).mockResolvedValueOnce({ data: [] });
    render(<Home />);

    fireEvent.click(screen.getByText('>'));
    
    (api.get as any).mockResolvedValueOnce({
      data: { available: true, slots: ['09:00', '10:00'] }
    });

    fireEvent.click(screen.getByText('15'));

    await waitFor(() => {
      expect(screen.getByText('09:00')).toBeInTheDocument();
      expect(screen.getByText('10:00')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('09:00'));

    const nameInput = screen.getByPlaceholderText('Seu Nome Completo');
    const phoneInput = screen.getByPlaceholderText('Telefone (Ex: 61 99999-9999)');
    
    fireEvent.change(nameInput, { target: { value: 'Pedro' } });
    fireEvent.change(phoneInput, { target: { value: '61988887777' } });

    (api.post as any).mockResolvedValueOnce({ status: 201 });
    (api.get as any).mockResolvedValueOnce({ data: [] });
    (api.get as any).mockResolvedValueOnce({ 
      data: { available: true, slots: ['10:00'] } 
    });

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));

    await waitFor(() => {
      expect(screen.getByText('Agendamento confirmado com sucesso!')).toBeInTheDocument();
    });
  });

  it('deve exibir mensagem de erro se a busca de horários falhar na API', async () => {
    (api.get as any).mockResolvedValueOnce({ data: [] });
    render(<Home />);

    fireEvent.click(screen.getByText('>'));

    (api.get as any).mockRejectedValueOnce({
      isAxiosError: true,
      response: { data: { error: 'Erro interno no servidor' } }
    });

    fireEvent.click(screen.getByText('20'));

    await waitFor(() => {
      expect(screen.getByText('Erro interno no servidor')).toBeInTheDocument();
    });
  });

  it('deve exibir empty state quando a data não tiver horários disponíveis', async () => {
    (api.get as any).mockResolvedValueOnce({ data: [] });
    render(<Home />);

    fireEvent.click(screen.getByText('>'));

    (api.get as any).mockResolvedValueOnce({
      data: { available: true, slots: [] }
    });

    fireEvent.click(screen.getByText('25'));

    await waitFor(() => {
      expect(screen.getByText('Nenhum horário disponível para esta data.')).toBeInTheDocument();
    });
  });

  it('deve exibir alerta se ocorrer erro no momento de salvar o agendamento', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    (api.get as any).mockResolvedValueOnce({ data: [] });
    render(<Home />);

    fireEvent.click(screen.getByText('>'));

    (api.get as any).mockResolvedValueOnce({
      data: { available: true, slots: ['14:00'] }
    });

    fireEvent.click(screen.getByText('28'));

    await waitFor(() => {
      expect(screen.getByText('14:00')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('14:00'));

    fireEvent.change(screen.getByPlaceholderText('Seu Nome Completo'), { target: { value: 'Pedro' } });
    fireEvent.change(screen.getByPlaceholderText('Telefone (Ex: 61 99999-9999)'), { target: { value: '61988887777' } });

    (api.post as any).mockRejectedValueOnce({
      isAxiosError: true,
      response: { data: { error: 'Este horário acabou de ser ocupado.' } }
    });

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Este horário acabou de ser ocupado.');
    });

    alertMock.mockRestore();
  });
});