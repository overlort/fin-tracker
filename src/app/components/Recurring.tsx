import { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Plus, Calendar, ArrowDownLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import { useFinanceData } from '@/app/providers/FinanceDataProvider';

export const Recurring: React.FC = () => {
  const { recurring, accounts, addRecurring } = useFinanceData();
  const [isOpen, setIsOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    frequency: 'monthly' as 'weekly' | 'monthly' | 'yearly',
    category: '',
    accountId: '',
    nextDate: new Date().toISOString().split('T')[0],
  });

  const categories = ['Rent', 'Utilities', 'Insurance', 'Subscriptions', 'Phone', 'Internet', 'Gym', 'Other'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addRecurring({
        name: formData.name,
        amount: parseFloat(formData.amount),
        frequency: formData.frequency,
        category: formData.category,
        accountId: formData.accountId,
        nextDate: formData.nextDate,
      });
      setIsOpen(false);
      setFormData({
        name: '',
        amount: '',
        frequency: 'monthly',
        category: '',
        accountId: '',
        nextDate: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Error adding recurring payment:', error);
    }
  };

  const totalMonthly = recurring
    .map(r => {
      if (r.frequency === 'weekly') return r.amount * 4.33;
      if (r.frequency === 'yearly') return r.amount / 12;
      return r.amount;
    })
    .reduce((sum, amount) => sum + amount, 0);

  const getDaysUntil = (date: string) => {
    const next = new Date(date);
    const now = new Date();
    const diff = Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="p-6 border-slate-200">
        <div className="flex items-center gap-2 mb-2">
          <ArrowDownLeft className="w-5 h-5 text-red-600" />
          <p className="text-slate-500">Monthly Recurring</p>
        </div>
        <h2 className="text-slate-800">${totalMonthly.toFixed(2)}</h2>
        <p className="text-sm text-slate-400 mt-2">{recurring.length} active payment{recurring.length !== 1 ? 's' : ''}</p>
      </Card>

      {/* Recurring Payments List */}
      <div className="space-y-3">
        {recurring.length === 0 ? (
          <Card className="p-8 text-center border-slate-200">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No recurring payments yet</p>
            <p className="text-sm text-slate-400 mt-2">Add bills and subscriptions to track them</p>
          </Card>
        ) : (
          recurring
            .sort((a, b) => getDaysUntil(a.nextDate) - getDaysUntil(b.nextDate))
            .map((payment) => {
              const account = accounts.find(a => a.id === payment.accountId);
              const daysUntil = getDaysUntil(payment.nextDate);
              
              return (
                <Card key={payment.id} className="p-4 border-slate-200">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="p-2 rounded-lg bg-red-100">
                        <Calendar className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-slate-800">{payment.name}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                            {payment.category}
                          </Badge>
                          <Badge variant="outline" className="border-slate-300 text-slate-600 capitalize">
                            {payment.frequency}
                          </Badge>
                          {account && (
                            <Badge variant="outline" className="border-slate-300 text-slate-600">
                              {account.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-800">${payment.amount.toFixed(2)}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })
        )}
      </div>

      {/* Add Recurring Payment Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-slate-800 hover:bg-slate-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Recurring Payment
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>New Recurring Payment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Payment Name</Label>
              <Input
                placeholder="e.g., Netflix Subscription"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Frequency</Label>
              <Select value={formData.frequency} onValueChange={(value: any) => setFormData({ ...formData, frequency: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Account</Label>
              <Select value={formData.accountId} onValueChange={(value) => setFormData({ ...formData, accountId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Next Payment Date</Label>
              <Input
                type="date"
                value={formData.nextDate}
                onChange={(e) => setFormData({ ...formData, nextDate: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-700">
              Add Payment
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

