
import React, { useState, useMemo } from 'react';
import { Assignment, AssignmentStatus, Goal } from '../types';

// TASKS
//------------------------------------------------

const statusConfig = {
    [AssignmentStatus.ToDo]: {
        bg: 'bg-danger/20', text: 'text-danger', selectBg: 'bg-surface/80 border-danger/50'
    },
    [AssignmentStatus.InProgress]: {
        bg: 'bg-warning/20', text: 'text-warning', selectBg: 'bg-surface/80 border-warning/50'
    },
    [AssignmentStatus.Completed]: {
        bg: 'bg-success/20', text: 'text-success', selectBg: 'bg-surface/80 border-success/50'
    }
}

const AddTaskForm: React.FC<{ onAddTask: (task: { name: string, deadline: string, points: number }) => void }> = ({ onAddTask }) => {
    const [name, setName] = useState('');
    const [deadline, setDeadline] = useState('');
    const [points, setPoints] = useState(50);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !deadline) return;
        onAddTask({ name, deadline, points: Number(points) || 0 });
        setName('');
        setDeadline('');
        setPoints(50);
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-subtle/50 space-y-2">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="New task name..."
                className="w-full p-2 rounded-md bg-subtle/50 border border-subtle focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                aria-label="New task name"
            />
            <div className="flex space-x-2">
                <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full p-2 rounded-md bg-subtle/50 border border-subtle focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                    aria-label="Task deadline"
                />
                <input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    min="0"
                    className="w-24 p-2 rounded-md bg-subtle/50 border border-subtle focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                    aria-label="Task points"
                />
            </div>
            <button type="submit" className="w-full py-2 px-4 rounded-lg font-semibold bg-primary text-white hover:brightness-110 transition-all">
                Add Task
            </button>
        </form>
    );
};


const TaskItem: React.FC<{ assignment: Assignment, onStatusChange: (status: AssignmentStatus) => void, onDelete: () => void }> = ({ assignment, onStatusChange, onDelete }) => {
    const config = statusConfig[assignment.status];
    
    return (
        <li className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${config.bg} hover:bg-subtle/60 group`}>
            <div>
                <span className={`font-medium ${assignment.status === AssignmentStatus.Completed ? 'line-through text-muted' : 'text-text-main'}`}>{assignment.name}</span>
                <p className="text-sm text-text-subtle mt-1">Due: {assignment.deadline} | <span className="font-semibold text-primary">{assignment.points} EXP</span></p>
            </div>
            <div className="flex items-center space-x-2">
                <select
                    value={assignment.status}
                    onChange={(e) => onStatusChange(e.target.value as AssignmentStatus)}
                    className={`text-sm rounded-md p-2 border focus:ring-2 focus:ring-primary focus:outline-none transition ${config.text} ${config.selectBg}`}
                >
                    {Object.values(AssignmentStatus).map(status => (
                        <option key={status} value={status} className="bg-surface">{status}</option>
                    ))}
                </select>
                <button 
                    onClick={onDelete} 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-muted hover:bg-danger hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Delete task"
                >
                    &times;
                </button>
            </div>
        </li>
    );
}

interface TaskListProps {
  assignments: Assignment[];
  onAssignmentChange: (updatedAssignment: Assignment) => void;
  onAddTask: (task: { name: string, deadline: string, points: number }) => void;
  onDeleteAssignment: (id: number) => void;
}


export const TaskList: React.FC<TaskListProps> = ({ assignments, onAssignmentChange, onAddTask, onDeleteAssignment }) => {
  const sortedAssignments = useMemo(() => 
    [...assignments].sort((a, b) => {
      const aCompleted = a.status === AssignmentStatus.Completed;
      const bCompleted = b.status === AssignmentStatus.Completed;

      if (aCompleted !== bCompleted) {
        return aCompleted ? 1 : -1;
      }
      
      return a.deadline.localeCompare(b.deadline);
    }),
    [assignments]
  );

  return (
    <div className="bg-surface/50 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-subtle h-full flex flex-col">
      <h2 className="text-3xl font-bold text-text-main mb-4 font-heading">Tasks</h2>
      <ul className="space-y-3 flex-grow overflow-y-auto pr-2">
        {sortedAssignments.map(assignment => (
          <TaskItem 
            key={assignment.id} 
            assignment={assignment} 
            onStatusChange={(newStatus) => onAssignmentChange({...assignment, status: newStatus})} 
            onDelete={() => onDeleteAssignment(assignment.id)}
          />
        ))}
      </ul>
      <AddTaskForm onAddTask={onAddTask} />
    </div>
  );
};


// GOALS
//------------------------------------------------

const AddGoalForm: React.FC<{ onAddGoal: (goal: { name: string, points: number }) => void }> = ({ onAddGoal }) => {
    const [name, setName] = useState('');
    const [points, setPoints] = useState(20);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        onAddGoal({ name, points: Number(points) || 0 });
        setName('');
        setPoints(20);
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-subtle/50 space-y-2">
            <div className="flex space-x-2">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="New daily goal..."
                    className="w-full p-2 rounded-md bg-subtle/50 border border-subtle focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                    aria-label="New goal name"
                />
                <input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    min="0"
                    className="w-24 p-2 rounded-md bg-subtle/50 border border-subtle focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                    aria-label="Goal points"
                />
            </div>
            <button type="submit" className="w-full py-2 px-4 rounded-lg font-semibold bg-primary text-white hover:brightness-110 transition-all">
                Add Goal
            </button>
        </form>
    );
};

interface GoalsListProps {
  goals: Goal[];
  onGoalChange: (updatedGoal: Goal) => void;
  onAddGoal: (goal: { name: string, points: number }) => void;
  onDeleteGoal: (id: number) => void;
}

const GoalItem: React.FC<{ goal: Goal, onToggle: (completed: boolean) => void, onDelete: () => void }> = ({ goal, onToggle, onDelete }) => {
  return (
      <li className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${goal.completed ? 'bg-success/20' : 'bg-subtle/40'} hover:bg-subtle/60 group`}>
          <label htmlFor={`goal-${goal.id}`} className="flex items-center cursor-pointer flex-grow mr-2">
              <input
                  id={`goal-${goal.id}`}
                  type="checkbox"
                  checked={goal.completed}
                  onChange={(e) => onToggle(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className={`ml-3 font-medium ${goal.completed ? 'line-through text-muted' : 'text-text-main'}`}>{goal.name}</span>
          </label>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className="text-sm font-semibold text-primary">+{goal.points} EXP</span>
            <button 
                onClick={onDelete} 
                className="w-6 h-6 rounded-full flex items-center justify-center text-muted hover:bg-danger hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Delete goal"
            >
                &times;
            </button>
          </div>
      </li>
  );
}

export const GoalsList: React.FC<GoalsListProps> = ({ goals, onGoalChange, onAddGoal, onDeleteGoal }) => {
  const sortedGoals = useMemo(() =>
    [...goals].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return 0; // maintain original order for goals with same status
    }),
    [goals]
  );
  
  return (
    <div className="bg-surface/50 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-subtle h-full flex flex-col">
      <h2 className="text-3xl font-bold text-text-main mb-4 font-heading">Daily Goals</h2>
      <ul className="space-y-3 flex-grow overflow-y-auto pr-2">
        {sortedGoals.map(goal => (
          <GoalItem 
            key={goal.id} 
            goal={goal}
            onToggle={(isCompleted) => onGoalChange({ ...goal, completed: isCompleted })}
            onDelete={() => onDeleteGoal(goal.id)}
          />
        ))}
      </ul>
      <AddGoalForm onAddGoal={onAddGoal} />
    </div>
  );
};
