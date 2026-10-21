import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../src/App';

describe('Team Quest Board', () => {
  const STORAGE_KEY = 'questboard-tasks';
  beforeEach(() => {
    localStorage.removeItem('questboard-tasks');
  });

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

  // タスクを追加すると localStorage に保存されることを確認するテスト
  it('saves tasks to localStorage', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('textbox', { name: 'タスク名' }), '保存のテスト');
    await user.click(screen.getByRole('button', { name: '次のタスクを追加する' }));

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    expect(saved).toHaveLength(4);
    expect(saved[3]).toMatchObject({ title: '保存のテスト', completed: false });
  });

  // 再読み込み後も、完了・削除した状態が復元されることを確認するテスト
  it('restores tasks after reload', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.click(screen.getByRole('button', { name: '最初の画面を作るを完了にする' }));
    await user.click(screen.getByRole('button', { name: 'READMEに使い方を書くを削除' }));

    // 画面を閉じて、もう一度開く(再読み込みの代わり)
    unmount();
    render(<App />);

    expect(screen.getByRole('button', { name: '最初の画面を作るを未完了に戻す' })).toBeInTheDocument();
    expect(screen.queryByText('READMEに使い方を書く')).not.toBeInTheDocument();
    expect(screen.getByText('2 tasks')).toBeInTheDocument();
  });

  // localStorage に保存されたタスクが表示されることを確認するテスト
  it('loads saved tasks from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([
      { id: 10, title: '保存済みのタスク', completed: true },
    ]));
    render(<App />);

    expect(screen.getByText('保存済みのタスク')).toBeInTheDocument();
    expect(screen.queryByText('チームでアイデアを出す')).not.toBeInTheDocument();
    expect(screen.getByText('1 tasks')).toBeInTheDocument();
  });

 // 保存データがない場合は初期タスクが表示されることを確認するテスト
  it('shows starter tasks when there is no saved data', () => {
    render(<App />);

    expect(screen.getByText('チームでアイデアを出す')).toBeInTheDocument();
    expect(screen.getByText('3 tasks')).toBeInTheDocument();
  });

  // 空の一覧を保存した場合は、再読み込み後も空のままになることを確認するテスト
  it('keeps an empty list after reload', () => {
    localStorage.setItem(STORAGE_KEY, '[]');
    render(<App />);

    expect(screen.queryByText('チームでアイデアを出す')).not.toBeInTheDocument();
    expect(screen.getByText('0 tasks')).toBeInTheDocument();
  });

 // JSON として読めないデータでもクラッシュせず、初期タスクが表示されることを確認するテスト
  it('shows starter tasks when saved data is broken', () => {
    localStorage.setItem(STORAGE_KEY, 'これはJSONではない{');
    render(<App />);

    expect(screen.getByText('チームでアイデアを出す')).toBeInTheDocument();
    expect(screen.getByText('3 tasks')).toBeInTheDocument();
  });

  // 形の違うデータでもクラッシュせず、初期タスクが表示されることを確認するテスト
  it('shows starter tasks when saved data has a wrong shape', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([{ id: 1, title: 123 }]));
    render(<App />);

    expect(screen.getByText('チームでアイデアを出す')).toBeInTheDocument();
    expect(screen.getByText('3 tasks')).toBeInTheDocument();
  });

  // 編集を始めると現在のタスク名が入力欄に表示され、保存・キャンセルボタンが出ることを確認するテスト
  it('shows the current title and buttons when editing starts', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '最初の画面を作るを編集' }));

    expect(screen.getByRole('textbox', { name: '最初の画面を作るの新しい名前' })).toHaveValue('最初の画面を作る');
    expect(screen.getByRole('button', { name: '最初の画面を作るの編集を保存' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '最初の画面を作るの編集をキャンセル' })).toBeInTheDocument();
  });

  // 保存すると対象タスクの名前だけが更新され、再読み込み後も残ることを確認するテスト
  it('saves the edited title only for the target task', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.click(screen.getByRole('button', { name: '最初の画面を作るを編集' }));
    const input = screen.getByRole('textbox', { name: '最初の画面を作るの新しい名前' });
    await user.clear(input);
    await user.type(input, '  画面を作り直す  ');
    await user.click(screen.getByRole('button', { name: '最初の画面を作るの編集を保存' }));

    expect(screen.getByText('画面を作り直す')).toBeInTheDocument();
    expect(screen.queryByText('最初の画面を作る')).not.toBeInTheDocument();
    // 他のタスクは変わらない
    expect(screen.getByText('チームでアイデアを出す')).toBeInTheDocument();
    expect(screen.getByText('READMEに使い方を書く')).toBeInTheDocument();

    // 再読み込みしても残っている
    unmount();
    render(<App />);
    expect(screen.getByText('画面を作り直す')).toBeInTheDocument();
  });

  // キャンセルすると変更前の名前が保たれることを確認するテスト
  it('keeps the original title when editing is canceled', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '最初の画面を作るを編集' }));
    const input = screen.getByRole('textbox', { name: '最初の画面を作るの新しい名前' });
    await user.clear(input);
    await user.type(input, '別の名前');
    await user.click(screen.getByRole('button', { name: '最初の画面を作るの編集をキャンセル' }));

    expect(screen.getByText('最初の画面を作る')).toBeInTheDocument();
    expect(screen.queryByText('別の名前')).not.toBeInTheDocument();
    // 編集欄が閉じている
    expect(screen.queryByRole('textbox', { name: '最初の画面を作るの新しい名前' })).not.toBeInTheDocument();
  });

  // 空白だけでは保存されないことを確認するテスト
  it('does not save an empty or whitespace-only title', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '最初の画面を作るを編集' }));
    const input = screen.getByRole('textbox', { name: '最初の画面を作るの新しい名前' });
    await user.clear(input);
    await user.type(input, '   ');
    await user.click(screen.getByRole('button', { name: '最初の画面を作るの編集を保存' }));

    // 保存されず、編集中のまま残っている
    expect(screen.getByRole('textbox', { name: '最初の画面を作るの新しい名前' })).toBeInTheDocument();
    // キャンセルすると元の名前が出る
    await user.click(screen.getByRole('button', { name: '最初の画面を作るの編集をキャンセル' }));
    expect(screen.getByText('最初の画面を作る')).toBeInTheDocument();
  });

});
