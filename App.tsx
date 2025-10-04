import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Header from './components/Header';
import { TaskList, GoalsList } from './components/AssignmentList';
import ExperienceBar from './components/ProductivityTracker';
import Tamagotchi from './components/Tamagotchi';
import Footer from './components/Footer';
import { Assignment, AssignmentStatus, Goal, ShopItem, ItemCategory } from './types';
import { INITIAL_ASSIGNMENTS, INITIAL_GOALS, SHOP_ITEMS } from './constants';

// FIX: Changed 'main' to 'home' to create a consistent 'View' type across components.
type View = 'home' | 'shop' | 'calendar';


// Shop View Component
const Shop: React.FC<{
  items: ShopItem[];
  onPurchase: (item: ShopItem) => void;
  userPoints: number;
  purchasedIds: Set<number>;
}> = ({ items, onPurchase, userPoints, purchasedIds }) => {
    return (
        <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-text-main mb-6 text-center font-heading">Item Shop</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map(item => {
                    const isPurchased = purchasedIds.has(item.id);
                    const canAfford = userPoints >= item.price;
                    return (
                        <div key={item.id} className="bg-surface/50 border border-subtle rounded-2xl p-4 flex flex-col items-center text-center shadow-lg">
                            <div className="w-24 h-24 mb-4 flex items-center justify-center">
                                {item.category === ItemCategory.Skin ? (
                                    <div className={`w-full h-full rounded-full ${item.asset}`} />
                                ) : (
                                    <img src={item.asset} alt={item.name} className="w-full h-full object-contain" />
                                )}
                            </div>
                            <h3 className="font-bold text-xl text-text-main font-heading">{item.name}</h3>
                            <p className="text-base text-text-subtle mb-4">{item.category}</p>
                            <button
                                onClick={() => onPurchase(item)}
                                disabled={isPurchased || !canAfford}
                                className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-200
                                  ${isPurchased ? 'bg-muted text-text-subtle cursor-not-allowed' : ''}
                                  ${!isPurchased && canAfford ? 'bg-success hover:brightness-110 text-white' : ''}
                                  ${!isPurchased && !canAfford ? 'bg-danger/50 text-danger cursor-not-allowed' : ''}
                                `}
                            >
                                {isPurchased ? 'Owned' : `${item.price} Points`}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const statusCalendarConfig = {
    [AssignmentStatus.ToDo]: 'bg-danger',
    [AssignmentStatus.InProgress]: 'bg-warning',
    [AssignmentStatus.Completed]: 'bg-success'
};

const CalendarTaskItem: React.FC<{ assignment: Assignment }> = ({ assignment }) => {
    const statusColor = statusCalendarConfig[assignment.status];
    return (
        <div className={`flex items-start space-x-2 p-1.5 rounded bg-subtle/70 text-text-main text-xs leading-tight`}>
            <div className={`w-2 h-2 rounded-full ${statusColor} mt-1 flex-shrink-0`}></div>
            <p>{assignment.name}</p>
        </div>
    );
};

// Calendar View Component
const CalendarView: React.FC<{ assignments: Assignment[] }> = ({ assignments }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysInMonth = endOfMonth.getDate();
    const startDayOfWeek = startOfMonth.getDay(); // 0 = Sunday

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: startDayOfWeek });

    const assignmentsByDate = useMemo(() => {
        const map = new Map<string, Assignment[]>();
        assignments.forEach(a => {
            const date = a.deadline;
            if (!map.has(date)) map.set(date, []);
            map.get(date)!.push(a);
        });
        return map;
    }, [assignments]);

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    return (
        <div className="container mx-auto bg-surface/50 border border-subtle rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="px-4 py-2 bg-subtle rounded-lg hover:bg-muted">&lt;</button>
                <h2 className="text-3xl font-bold font-heading">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                <button onClick={() => changeMonth(1)} className="px-4 py-2 bg-subtle rounded-lg hover:bg-muted">&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="font-bold text-text-subtle">{day}</div>)}
                {emptyDays.map((_, i) => <div key={`empty-${i}`} />)}
                {days.map(day => {
                    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dailyAssignments = assignmentsByDate.get(dateStr) || [];
                    const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
                    return (
                        <div key={day} className={`p-2 border border-subtle/50 rounded-lg min-h-[120px] flex flex-col ${isToday ? 'bg-primary/20' : ''}`}>
                            <div className={`font-bold ${isToday ? 'text-primary' : ''}`}>{day}</div>
                            <div className="text-left text-xs space-y-1 mt-1 flex-grow overflow-y-auto pr-1">
                                {dailyAssignments.map(a => <CalendarTaskItem key={a.id} assignment={a} />)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


const App: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [points, setPoints] = useState<number>(250);
  const [purchasedItems, setPurchasedItems] = useState<ShopItem[]>([]);
  // FIX: Changed 'main' to 'home' to create a consistent 'View' type across components.
  const [activeView, setActiveView] = useState<View>('home');
  const [hatScale, setHatScale] = useState(1.2);
  const [hatX, setHatX] = useState(0);
  const [hatY, setHatY] = useState(0);
  const [petHealth, setPetHealth] = useState(100);
  const [currentMessage, setCurrentMessage] = useState("Let's get started on our tasks!");


  const purchasedItemIds = useMemo(() => new Set(purchasedItems.map(item => item.id)), [purchasedItems]);

  const handleAssignmentChange = useCallback((updatedAssignment: Assignment) => {
    setAssignments(prevAssignments => {
      const oldAssignment = prevAssignments.find(a => a.id === updatedAssignment.id);
      if (oldAssignment && oldAssignment.status !== AssignmentStatus.Completed && updatedAssignment.status === AssignmentStatus.Completed) {
          const messages = ["Great job!", "You're on a roll!", "Awesome work!", "Keep it up!"];
          setCurrentMessage(messages[Math.floor(Math.random() * messages.length)]);
      }
      return prevAssignments.map(a => a.id === updatedAssignment.id ? updatedAssignment : a);
    });
  }, []);

  const handleGoalChange = useCallback((updatedGoal: Goal) => {
    setGoals(prevGoals => {
        const oldGoal = prevGoals.find(g => g.id === updatedGoal.id);
        if(oldGoal && !oldGoal.completed && updatedGoal.completed) {
            const messages = ["Nice one!", "Goal achieved!", "Every little bit helps!"];
            setCurrentMessage(messages[Math.floor(Math.random() * messages.length)]);
        }
        return prevGoals.map(g => g.id === updatedGoal.id ? updatedGoal : g);
    });
  }, []);

  const handlePurchaseItem = useCallback((item: ShopItem) => {
    if (points >= item.price && !purchasedItemIds.has(item.id)) {
        setPoints(prev => prev - item.price);
        setPurchasedItems(prev => [...prev, item]);
    }
  }, [points, purchasedItemIds]);
  
  const handleAddTask = useCallback((task: { name: string, deadline: string, points: number }) => {
    const newAssignment: Assignment = {
      id: Date.now(),
      name: task.name,
      deadline: task.deadline,
      points: task.points,
      status: AssignmentStatus.ToDo,
    };
    setAssignments(prev => [newAssignment, ...prev]);
  }, []);

  const handleDeleteAssignment = useCallback((id: number) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  }, []);

  const handleAddGoal = useCallback((goal: { name: string, points: number }) => {
    const newGoal: Goal = {
      id: Date.now(),
      name: goal.name,
      points: goal.points,
      completed: false,
    };
    setGoals(prev => [newGoal, ...prev]);
  }, []);

  const handleDeleteGoal = useCallback((id: number) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  }, []);


  const experience = useMemo(() => {
    const assignmentExp = assignments
        .filter(a => a.status === AssignmentStatus.Completed)
        .reduce((sum, a) => sum + a.points, 0);
    const goalExp = goals
        .filter(g => g.completed)
        .reduce((sum, g) => sum + g.points, 0);
    return assignmentExp + goalExp;
  }, [assignments, goals]);

  // Effect for motivational messages
  useEffect(() => {
    const intervalId = setInterval(() => {
        if (petHealth < 50) {
            const messages = ["I'm not feeling so good...", "We need to finish some tasks!", "My health is low!"];
            setCurrentMessage(messages[Math.floor(Math.random() * messages.length)]);
        } else if (assignments.every(a => a.status === AssignmentStatus.Completed)) {
            const messages = ["All tasks done! Great work!", "You're amazing! Time to relax."];
            setCurrentMessage(messages[Math.floor(Math.random() * messages.length)]);
        } else if (assignments.filter(a => a.status === AssignmentStatus.ToDo).length > 4) {
            const messages = ["That's a lot of tasks! Let's do it!", "We can handle this!", "One step at a time."];
            setCurrentMessage(messages[Math.floor(Math.random() * messages.length)]);
        } else {
            const messages = ["You're doing great!", "What should we work on next?", "Keep the productivity going!"];
            setCurrentMessage(messages[Math.floor(Math.random() * messages.length)]);
        }
    }, 15000); // Change message every 15 seconds

    return () => clearInterval(intervalId);
}, [petHealth, assignments]);
  
  const renderView = () => {
    switch(activeView) {
      case 'shop':
        return <Shop items={SHOP_ITEMS} onPurchase={handlePurchaseItem} userPoints={points} purchasedIds={purchasedItemIds} />;
      case 'calendar':
        return <CalendarView assignments={assignments} />;
      // FIX: Changed 'main' to 'home' to create a consistent 'View' type across components.
      case 'home':
      default:
        return (
          <main className="flex-grow container mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4 mt-6">
            <div className="lg:col-span-1">
              <GoalsList 
                goals={goals} 
                onGoalChange={handleGoalChange}
                onAddGoal={handleAddGoal}
                onDeleteGoal={handleDeleteGoal}
              />
            </div>
            <div className="lg:col-span-2 flex flex-col space-y-4">
              <Tamagotchi 
                experience={experience} 
                purchasedItems={purchasedItems} 
                hatScale={hatScale} 
                hatX={hatX} 
                hatY={hatY}
                health={petHealth}
                message={currentMessage}
              />
              {purchasedItemIds.has(1) && (
                <div className="bg-surface/50 p-4 rounded-2xl shadow-lg border border-subtle">
                    <h3 className="text-center font-bold text-text-main font-heading text-xl mb-2">Customize Vassar Hat</h3>
                    <div className="grid grid-cols-[auto,1fr] items-center gap-x-4 gap-y-2 max-w-sm mx-auto">
                        <label htmlFor="hat-scale" className="text-sm text-text-subtle w-12 text-right">Size</label>
                        <input 
                            id="hat-scale"
                            type="range"
                            min="0.5"
                            max="2.5"
                            step="0.05"
                            value={hatScale}
                            onChange={(e) => setHatScale(parseFloat(e.target.value))}
                            className="w-full accent-primary"
                            aria-label="Vassar Hat Size"
                        />
                        <label htmlFor="hat-x" className="text-sm text-text-subtle w-12 text-right">X-Pos</label>
                        <input 
                            id="hat-x"
                            type="range"
                            min="-50"
                            max="50"
                            step="1"
                            value={hatX}
                            onChange={(e) => setHatX(parseInt(e.target.value, 10))}
                            className="w-full accent-primary"
                            aria-label="Vassar Hat X Position"
                        />
                        <label htmlFor="hat-y" className="text-sm text-text-subtle w-12 text-right">Y-Pos</label>
                        <input 
                            id="hat-y"
                            type="range"
                            min="-50"
                            max="50"
                            step="1"
                            value={hatY}
                            onChange={(e) => setHatY(parseInt(e.target.value, 10))}
                            className="w-full accent-primary"
                            aria-label="Vassar Hat Y Position"
                        />
                    </div>
                </div>
              )}
              <ExperienceBar experience={experience} />
            </div>
            <div className="lg:col-span-1">
              <TaskList 
                assignments={assignments} 
                onAssignmentChange={handleAssignmentChange}
                onAddTask={handleAddTask}
                onDeleteAssignment={handleDeleteAssignment}
              />
            </div>
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-primary">
      <div className="w-2 bg-primary" />
      <div className="flex-grow flex flex-col bg-background">
        <div className="w-full h-2 bg-primary" />
        <div className="flex-grow flex flex-col p-4 md:p-8">
          <Header activeView={activeView} onNavigate={setActiveView} points={points} />
          <div className="flex-grow">
            {renderView()}
          </div>
          <Footer />
        </div>
        <div className="w-full h-2 bg-primary" />
      </div>
      <div className="w-2 bg-primary" />
    </div>
  );
};

export default App;
