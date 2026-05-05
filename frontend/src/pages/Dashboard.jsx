import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Trash2, GripVertical, Calendar, Flag, Play, CheckCircle2, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import useTaskStore, { STATUSES, STATUS_LABELS } from '../store/useTaskStore';
import useAuthStore from '../store/useAuthStore';
import { format, isToday, isPast, parseISO } from 'date-fns';

// Task card sub-component
const TaskCard = ({ task, provided, snapshot }) => {
  const { updateTask, deleteTask, moveTask } = useTaskStore();
  const [expanded, setExpanded] = useState(false);

  const isOverdue = task.dueDate && !task.isCompleted && isPast(parseISO(task.dueDate)) && !isToday(parseISO(task.dueDate));

  const statusActions = {
    inbox: { label: 'Start', icon: <Play size={13} />, next: 'in-progress', cls: 'btn-start' },
    'in-progress': { label: 'Complete', icon: <CheckCircle2 size={13} />, next: 'completed', cls: 'btn-complete' },
    completed: { label: 'Reopen', icon: <RotateCcw size={13} />, next: 'inbox', cls: 'btn-reopen' },
  };
  const action = statusActions[task.status];

  return (
    <div
      className={`task-card pri-${task.priority} ${snapshot.isDragging ? 'is-dragging' : ''} ${task.status === 'completed' ? 'is-done' : ''}`}
      ref={provided.innerRef}
      {...provided.draggableProps}
    >
      <div className="task-card-top">
        <div className="task-drag" {...provided.dragHandleProps}>
          <GripVertical size={15} />
        </div>

        <div className="task-body" onClick={() => setExpanded(v => !v)}>
          <p className="task-title">{task.title}</p>
          <div className="task-chips">
            {task.dueDate && (
              <span className={`chip chip-date ${isOverdue ? 'overdue' : isToday(parseISO(task.dueDate)) ? 'today' : ''}`}>
                <Calendar size={11} />
                {isToday(parseISO(task.dueDate)) ? 'Today' : format(parseISO(task.dueDate), 'MMM d')}
              </span>
            )}
            <span className={`chip chip-pri chip-${task.priority}`}>
              <Flag size={11} /> {task.priority}
            </span>
            {task.category !== STATUS_LABELS[task.status] && (
              <span className="chip chip-cat">{task.category}</span>
            )}
          </div>
        </div>

        <div className="task-actions">
          <button
            className={`task-btn ${action.cls}`}
            onClick={() => moveTask(task.id, action.next)}
            title={action.label}
          >
            {action.icon} {action.label}
          </button>
          <button className="task-btn task-btn-delete" onClick={() => deleteTask(task.id)} title="Delete">
            <Trash2 size={13} />
          </button>
          <button className="task-btn task-btn-expand" onClick={() => setExpanded(v => !v)}>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="task-expanded">
          <textarea
            className="task-note"
            placeholder="Add a note..."
            defaultValue={task.description}
            onBlur={e => { if (e.target.value !== task.description) updateTask(task.id, { description: e.target.value }); }}
            rows={3}
          />
        </div>
      )}
    </div>
  );
};

// Column header
const ColumnHeader = ({ status, count }) => {
  const config = {
    inbox: { emoji: '📥', color: 'var(--col-inbox)' },
    'in-progress': { emoji: '⚡', color: 'var(--col-progress)' },
    completed: { emoji: '✅', color: 'var(--col-done)' },
  };
  const c = config[status];
  return (
    <div className="col-header">
      <div className="col-header-left">
        <span className="col-emoji">{c.emoji}</span>
        <h3 className="col-title">{STATUS_LABELS[status]}</h3>
      </div>
      <span className="col-count" style={{ background: c.color }}>{count}</span>
    </div>
  );
};

// Add Task Form
const AddTaskForm = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, dueDate: dueDate || null, priority });
    setTitle(''); setDueDate(''); setPriority('medium'); setOpen(false);
  };

  if (!open) return (
    <button className="add-task-trigger" onClick={() => setOpen(true)}>
      <Plus size={18} /> New Task
    </button>
  );

  return (
    <form className="add-task-form" onSubmit={submit}>
      <input className="form-input" type="text" placeholder="Task title..." value={title} onChange={e => setTitle(e.target.value)} autoFocus required />
      <div className="form-row">
        <input className="form-input" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        <select className="form-select" value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="low">🟢 Low</option>
          <option value="medium">🟡 Medium</option>
          <option value="high">🔴 High</option>
        </select>
      </div>
      <div className="form-row">
        <button type="submit" className="btn-primary-sm">Add Task</button>
        <button type="button" className="btn-ghost-sm" onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </form>
  );
};

// Dashboard page
const Dashboard = () => {
  const { tasks, fetchTasks, addTask, reorderTasks } = useTaskStore();
  const { userInfo } = useAuthStore();

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const getHour = () => new Date().getHours();
  const greeting = getHour() < 12 ? 'Good morning' : getHour() < 18 ? 'Good afternoon' : 'Good evening';

  const tasksByStatus = (status) =>
    tasks.filter(t => t.status === status).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const handleDragEnd = ({ source, destination }) => {
    if (!destination) return;
    const srcStatus = source.droppableId;
    const dstStatus = destination.droppableId;

    const srcTasks = [...tasksByStatus(srcStatus)];
    const dstTasks = srcStatus === dstStatus ? srcTasks : [...tasksByStatus(dstStatus)];

    const [moved] = srcTasks.splice(source.index, 1);
    dstTasks.splice(destination.index, 0, { ...moved, status: dstStatus });

    const batch = [];
    const push = (arr, status) => arr.forEach((t, i) => batch.push({ id: t.id, order: i, status, category: STATUS_LABELS[status] }));

    if (srcStatus === dstStatus) { push(dstTasks, dstStatus); }
    else { push(srcTasks, srcStatus); push(dstTasks, dstStatus); }

    reorderTasks(batch);
  };

  const overdue = tasks.filter(t => t.dueDate && !t.isCompleted && isPast(parseISO(t.dueDate)) && !isToday(parseISO(t.dueDate)));
  const dueToday = tasks.filter(t => t.dueDate && isToday(parseISO(t.dueDate)) && !t.isCompleted);

  return (
    <div className="page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{greeting}, {userInfo?.name?.split(' ')[0]} 👋</h1>
          <p className="page-subtitle">
            {dueToday.length > 0 && <span className="badge-today">{dueToday.length} due today</span>}
            {overdue.length > 0 && <span className="badge-overdue">{overdue.length} overdue</span>}
            {dueToday.length === 0 && overdue.length === 0 && 'You\'re all caught up!'}
          </p>
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="board">
          {Object.values(STATUSES).map(status => (
            <div className="column" key={status}>
              <ColumnHeader status={status} count={tasksByStatus(status).length} />

              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    className={`droppable-area ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {tasksByStatus(status).map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <TaskCard task={task} provided={provided} snapshot={snapshot} />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {tasksByStatus(status).length === 0 && !snapshot.isDraggingOver && (
                      <div className="empty-col">
                        <p>No tasks here.<br />Drag one in!</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>

              {status === 'inbox' && (
                <div className="col-footer">
                  <AddTaskForm onAdd={(data) => addTask({ ...data, status: 'inbox', category: 'Inbox' })} />
                </div>
              )}
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Dashboard;
