import { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Plus, Target, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Progress } from '@/shared/components/ui/progress';
import { Badge } from '@/shared/components/ui/badge';
import { useFinanceData } from '@/app/providers/FinanceDataProvider';

export const Goals: React.FC = () => {
  const { goals, addGoal, updateGoal } = useFinanceData();
  const [isOpen, setIsOpen] = useState(false);
  const [contributionDialog, setContributionDialog] = useState<{ open: boolean; goalId: string; amount: string }>({
    open: false,
    goalId: '',
    amount: '',
  });
  
  const [formData, setFormData] = useState({
    name: '',
    target: '',
    current: '',
    deadline: '',
    color: '#64748b',
  });

  const goalColors = [
    { value: '#64748b', label: 'Slate' },
    { value: '#3b82f6', label: 'Blue' },
    { value: '#10b981', label: 'Green' },
    { value: '#f59e0b', label: 'Orange' },
    { value: '#8b5cf6', label: 'Purple' },
    { value: '#ec4899', label: 'Pink' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addGoal({
        name: formData.name,
        target: parseFloat(formData.target),
        current: parseFloat(formData.current) || 0,
        deadline: formData.deadline,
        color: formData.color,
      });
      setIsOpen(false);
      setFormData({
        name: '',
        target: '',
        current: '',
        deadline: '',
        color: '#64748b',
      });
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const handleContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    const goal = goals.find(g => g.id === contributionDialog.goalId);
    if (goal) {
      try {
        await updateGoal(goal.id, {
          current: goal.current + parseFloat(contributionDialog.amount),
        });
        setContributionDialog({ open: false, goalId: '', amount: '' });
      } catch (error) {
        console.error('Error updating goal:', error);
      }
    }
  };

  const totalSaved = goals.reduce((sum, g) => sum + g.current, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);

  const getDaysRemaining = (deadline: string) => {
    if (!deadline) return 0;
    const end = new Date(deadline);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="p-6 border-slate-200">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-slate-600" />
          <p className="text-slate-500">Total Saved</p>
        </div>
        <h2 className="text-slate-800">${totalSaved.toFixed(2)}</h2>
        <Progress 
          value={totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0} 
          className="mt-3 h-2"
        />
        <p className="text-sm text-slate-400 mt-2">
          ${totalTarget.toFixed(2)} target across {goals.length} goal{goals.length !== 1 ? 's' : ''}
        </p>
      </Card>

      {/* Goals List */}
      <div className="space-y-3">
        {goals.length === 0 ? (
          <Card className="p-8 text-center border-slate-200">
            <Target className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No savings goals yet</p>
            <p className="text-sm text-slate-400 mt-2">Create a goal to start saving</p>
          </Card>
        ) : (
          goals
            .filter(g => g.deadline) // Фильтруем только цели с дедлайном для сортировки
            .sort((a, b) => {
              if (!a.deadline || !b.deadline) return 0;
              return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
            })
            .map((goal) => {
              const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
              const daysRemaining = getDaysRemaining(goal.deadline);
              
              return (
                <Card 
                  key={goal.id} 
                  className="p-5 border-slate-200"
                  style={{ borderLeftWidth: '4px', borderLeftColor: goal.color }}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-slate-800">{goal.name}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                            {daysRemaining > 0 ? `${daysRemaining} days left` : goal.deadline ? 'Overdue' : 'No deadline'}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-300 text-slate-600"
                        onClick={() => setContributionDialog({ open: true, goalId: goal.id, amount: '' })}
                      >
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Add
                      </Button>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">
                          ${goal.current.toFixed(2)} / ${goal.target.toFixed(2)}
                        </span>
                        <span className="text-sm text-slate-600">{progress.toFixed(0)}%</span>
                      </div>
                      <Progress 
                        value={progress} 
                        className="h-2"
                        style={{ 
                          backgroundColor: `${goal.color}20`,
                        }}
                      />
                    </div>
                  </div>
                </Card>
              );
            })
        )}
      </div>

      {/* Add Goal Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-slate-800 hover:bg-slate-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Savings Goal
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>New Savings Goal</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Goal Name</Label>
              <Input
                placeholder="e.g., Emergency Fund"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Target Amount</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Current Amount</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.current}
                onChange={(e) => setFormData({ ...formData, current: e.target.value })}
              />
            </div>

            <div>
              <Label>Deadline</Label>
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Color</Label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {goalColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`w-10 h-10 rounded-lg transition-all ${
                      formData.color === color.value ? 'ring-2 ring-offset-2 ring-slate-400' : ''
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-700">
              Add Goal
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Contribution Dialog */}
      <Dialog open={contributionDialog.open} onOpenChange={(open) => setContributionDialog({ ...contributionDialog, open })}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Contribution</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleContribution} className="space-y-4">
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={contributionDialog.amount}
                onChange={(e) => setContributionDialog({ ...contributionDialog, amount: e.target.value })}
                required
                autoFocus
              />
            </div>

            <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-700">
              Add Contribution
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

