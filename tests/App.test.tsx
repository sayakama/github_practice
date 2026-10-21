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

  // タスクの完了状態を切り替えられることを確認するテスト
  it('toggles task completion', async () => {
    const user = userEvent.setup();
    render(<App />);
    const taskButton = screen.getByRole('button', { name: '最初の画面を作るを完了にする' });
    await user.click(taskButton);
    expect(screen.getByRole('button', { name: '最初の画面を作るを未完了に戻す' })).toBeInTheDocument();
  });

  // タスクの完了状態を切り替えた後、再度切り替えられることを確認するテスト
  it('toggles task completion back and forth', async () => {
    const user = userEvent.setup();
    render(<App />);
    const taskButton = screen.getByRole('button', { name: '最初の画面を作るを完了にする' });
    await user.click(taskButton);
    expect(screen.getByRole('button', { name: '最初の画面を作るを未完了に戻す' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '最初の画面を作るを未完了に戻す' }));
    expect(screen.getByRole('button', { name: '最初の画面を作るを完了にする' })).toBeInTheDocument();
  });

  // 選んだタスクだけが削除され、他のタスクは残ることを確認するテスト
  it('deletes only the selected task', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '最初の画面を作るを削除' }));

    // 押したタスクは消えている
    expect(screen.queryByText('最初の画面を作る')).not.toBeInTheDocument();
    // 他のタスクは残っている
    expect(screen.getByText('チームでアイデアを出す')).toBeInTheDocument();
    expect(screen.getByText('READMEに使い方を書く')).toBeInTheDocument();
    // 件数が 3 → 2 になっている
    expect(screen.getByText('2 tasks')).toBeInTheDocument();
  });

  // すべてのタスクを削除できることを確認するテスト
  it('deletes all tasks', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '最初の画面を作るを削除' }));
    await user.click(screen.getByRole('button', { name: 'チームでアイデアを出すを削除' }));
    await user.click(screen.getByRole('button', { name: 'READMEに使い方を書くを削除' }));

    // すべてのタスクが消えている
    expect(screen.queryByText('最初の画面を作る')).not.toBeInTheDocument();
    expect(screen.queryByText('チームでアイデアを出す')).not.toBeInTheDocument();
    expect(screen.queryByText('READMEに使い方を書く')).not.toBeInTheDocument();
    // 件数が 3 → 0 になっている
    expect(screen.getByText('0 tasks')).toBeInTheDocument();
  });

  // キーボードで削除できることを確認するテスト
  it('deletes a task using keyboard', async () => {
    const user = userEvent.setup();
    render(<App />);
    const taskButton = screen.getByRole('button', { name: '最初の画面を作るを削除' });
    taskButton.focus();
    await user.keyboard('{Enter}');
    expect(screen.queryByText('最初の画面を作る')).not.toBeInTheDocument();
  });

  /// 「未完了」フィルターで未完了のタスクだけが表示されることを確認するテスト
  it('shows only todo tasks with the todo filter', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '未完了' }));

    expect(screen.queryByText('チームでアイデアを出す')).not.toBeInTheDocument();
    expect(screen.getByText('最初の画面を作る')).toBeInTheDocument();
    expect(screen.getByText('READMEに使い方を書く')).toBeInTheDocument();
  });


  // 「完了」フィルターで完了したタスクだけが表示されることを確認するテスト
  it('shows only done tasks with the done filter', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '完了' }));

    expect(screen.getByText('チームでアイデアを出す')).toBeInTheDocument();
    expect(screen.queryByText('最初の画面を作る')).not.toBeInTheDocument();
    expect(screen.queryByText('READMEに使い方を書く')).not.toBeInTheDocument();
  });

  // 絞り込んだあと「すべて」に戻すと全件が表示されることを確認するテスト
  it('shows all tasks again with the all filter', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '完了' }));
    await user.click(screen.getByRole('button', { name: 'すべて' }));

    expect(screen.getByText('チームでアイデアを出す')).toBeInTheDocument();
    expect(screen.getByText('最初の画面を作る')).toBeInTheDocument();
    expect(screen.getByText('READMEに使い方を書く')).toBeInTheDocument();
    // 絞り込んでもタスク自体は消えていない
    expect(screen.getByText('3 tasks')).toBeInTheDocument();
  });

});
