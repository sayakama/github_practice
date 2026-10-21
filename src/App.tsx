import { CalendarDays, Check, Circle, Clock3, Plus, Sparkles, Trash2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import type { Task } from './types';

const starterTasks: Task[] = [
  { id: 1, title: 'チームでアイデアを出す', completed: true },
  { id: 2, title: '最初の画面を作る', completed: false },
  { id: 3, title: 'READMEに使い方を書く', completed: false },
];

type Filter = 'all'|'todo'|'done';

const filterLabels: Record<Filter, string> = {
  all: 'すべて',
  todo: '未完了',
  done: '完了',
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(starterTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const handleAddTask = (event: FormEvent) => {
    event.preventDefault();
    const trimmedTitle = newTaskTitle.trim();
    if (trimmedTitle) {
      const newTask: Task = {
        id: tasks.length + 1,
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
              <span className="task-title">{task.title}</span>
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
