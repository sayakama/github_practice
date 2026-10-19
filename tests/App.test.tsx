import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../src/App';

describe('Team Quest Board', () => {
  it('shows the starter tasks', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'やることリスト' })).toBeInTheDocument();
    expect(screen.getByText('チームでアイデアを出す')).toBeInTheDocument();
    expect(screen.getByText('最初の画面を作る')).toBeInTheDocument();
    expect(screen.getByText('READMEに使い方を書く')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '次のタスクを追加する' })).toBeInTheDocument();
  });

  it('shows the current quest hint', () => {
    render(<App />);
    expect(screen.getByText('Quest 3')).toBeInTheDocument();
  });

  //タスクを追加でき，入力欄が空になることを確認するテスト
  it('adds a task and clears the input', async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByRole('textbox', { name: 'タスク名' });
    await user.type(input, '  テストを書く  ');
    await user.click(screen.getByRole('button', { name: '次のタスクを追加する' }));
    expect(screen.getByText('テストを書く')).toBeInTheDocument();
    expect(screen.getByText('4 tasks')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  // タスクを追加する際に、空白のみのタスクが追加されないことを確認するテスト
  it('does not add an empty or whitespace-only task', async () => {
    const user = userEvent.setup();
    render(<App />);
    const button = screen.getByRole('button', { name: '次のタスクを追加する' });
    await user.click(button);
    await user.type(screen.getByRole('textbox', { name: 'タスク名' }), '   ');
    await user.click(button);
    expect(screen.getByText('3 tasks')).toBeInTheDocument();
  });
});
