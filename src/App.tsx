import { CalendarDays, Check, Circle, Clock3, Pencil, Plus, Sparkles, Trash2 } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import type { Task } from './types';

const starterTasks: Task[] = [
  { id: 1, title: 'チームでアイデアを出す', completed: true },
  { id: 2, title: '最初の画面を作る', completed: false },
  { id: 3, title: 'READMEに使い方を書く', completed: false },
];

const STORAGE_KEY = 'questboard-tasks';

const isTask = (value: unknown): value is Task =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as Task).id === 'number' &&
  typeof (value as Task).title === 'string' &&
  typeof (value as Task).completed === 'boolean';

const loadTasks = (): Task[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) return starterTasks;           // 保存データがない
    const parsed: unknown = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.every(isTask)) {
      return parsed;                                    // 正しいデータ(空配列も含む)
    }
    return starterTasks;                                // 形がおかしい
  } catch {
    return starterTasks;                                // JSON として読めない
  }
};

type Filter = 'all'|'todo'|'done';

const filterLabels: Record<Filter, string> = {
  all: 'すべて',
  todo: '未完了',
  done: '完了',
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [editingId, setEditingId] = useState<number|null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
    // 保存できない環境(容量オーバーなど)でもアプリは動かし続ける
    }
  }, [tasks]);

  const handleAddTask = (event: FormEvent) => {
    event.preventDefault();
    const trimmedTitle = newTaskTitle.trim();
    if (trimmedTitle) {
      const newTask: Task = {
        id: Date.now(),
        title: trimmedTitle,
        completed: false
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    }
  };

  const handleToggleTask = (id: number) => {
    setTasks(tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const visibleTasks = tasks.filter((task) => {
    if (filter === 'todo') return !task.completed;
    if (filter === 'done') return task.completed;
    return true;
  });

  // 編集を始める:現在のタスク名を入力欄に入れる
  const handleStartEdit = (task: Task) => {
    setEditingId(task.id);
    setEditingTitle(task.title);
  };

  // 保存する:空白だけなら何もしない。対象のタスクだけ名前を変える
  const handleSaveEdit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedTitle = editingTitle.trim();
    if (!trimmedTitle) return;
    setTasks(tasks.map((task) => task.id === editingId ? { ...task, title: trimmedTitle } : task));
    setEditingId(null);
    setEditingTitle('');
  };

  // キャンセルする:tasks には触らず、編集状態だけを終わらせる
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle('');
  };


  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Quest Board ホーム">
          <span className="brand-mark"><Sparkles size={17} strokeWidth={2.5} /></span>
          <span>questboard</span>
        </a>
        <span className="topbar-note"><span className="online-dot" /> チーム作業中</span>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <span className="eyebrow"><CalendarDays size={14} /> GitHub チーム開発入門</span>
          <h1>アイデアを、<span>動くもの</span>に。</h1>
          <p>GitHubでのチーム開発を、小さなタスクから練習しよう。</p>
        </div>
        <div className="hero-card" aria-label="進捗">
          <span className="hero-card-label">今日の進捗</span>
          <strong><span className="progress-number">1</span><span className="progress-divider">/</span>{tasks.length}</strong>
          <span className="hero-card-caption">タスクを完了</span>
          <div className="progress-track"><span style={{ width: `${(1 / tasks.length) * 100}%` }} /></div>
        </div>
        <div className="filter-group" role="group" aria-label="タスクの絞り込み">
          {((Object.keys(filterLabels) as Filter[]).map((key) => (
            <button
              key={key}
              className={`filter-button ${filter === key ? 'is-active' : ''}`}
              onClick={() => setFilter(key)}
              aria-pressed={filter === key}
            >
              {filterLabels[key]}
            </button>
          )))}
        </div>
      </section>

      <section className="board" aria-labelledby="tasks-heading">
        <div className="board-heading">
          <div>
            <div className="section-kicker"><Clock3 size={14} /> SPRINT 01</div>
            <h2 id="tasks-heading">やることリスト</h2>
          </div>
          <span className="task-count">{tasks.length} tasks</span>
        </div>

        <div className="task-list">
          {visibleTasks.map((task) => (
            <div className={`task-row${task.completed ? ' is-complete' : ''}`} key={task.id}>
              <button className="check-button" type="button" aria-label={task.completed ? `${task.title}を未完了に戻す`: `${task.title}を完了にする`} 
                onClick={() => handleToggleTask(task.id)}>
                {task.completed ? <Check size={16} /> : <Circle size={19} />}
              </button>
              <button className="delete-button" type="button" aria-label={`${task.title}を削除`} onClick={() => handleDeleteTask(task.id)}>
                <Trash2 size={15} />
              </button>
              {editingId === task.id ? (
                <form className="edit-task-form" onSubmit={handleSaveEdit}>
                  <input
                    className="edit-task-input"
                    type="text"
                    value={editingTitle}
                    onChange={(event) => setEditingTitle(event.target.value)}
                    aria-label={`${task.title}の新しい名前`}
                    autoFocus
                  />
                  <button className="edit-save-button" type="submit" aria-label={`${task.title}の編集を保存`}>保存</button>
                  <button className="edit-cancel-button" type="button" aria-label={`${task.title}の編集をキャンセル`} onClick={handleCancelEdit}>キャンセル</button>
                </form>
              ) : (
                <>
                  <span className="task-title">{task.title}</span>
                  <button className="edit-button" type="button" aria-label={`${task.title}を編集`} onClick={() => handleStartEdit(task)}>
                    <Pencil size={14} />
                  </button>
                </>
              )}

              <span className={`task-status ${task.completed ? 'done' : 'todo'}`}>
                {task.completed ? '完了' : '未完了'}
              </span>
            </div>
          ))}
        </div>

        <form className="add-task-form" onSubmit={handleAddTask}>
          <span className="add-icon"><Plus size={18} /></span>
          <input
            className="add-task-input"
            type="text"
            value={newTaskTitle}
            onChange={(event) => setNewTaskTitle(event.target.value)}
            placeholder="次のタスクをここに追加しよう"
            aria-label="タスク名"
          />
          <button className="add-task-button" type="submit" aria-label="次のタスクを追加する">追加</button>
          <span className="issue-badge">Quest 3</span>
        </form>
        <p className="board-hint">このアプリをIssueごとに少しずつ完成させていきます。</p>
      </section>

      <footer className="footer"><span className="footer-star">✳</span> いいチームは、小さく作って、よく相談する。</footer>
    </main>
  );
}
