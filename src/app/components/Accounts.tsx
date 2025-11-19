import { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Plus, Wallet, CreditCard, Building2, Banknote } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import { useFinanceData } from '@/app/providers/FinanceDataProvider';

export const Accounts: React.FC = () => {
  const { accounts, addAccount } = useFinanceData();
  const [isOpen, setIsOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'checking' as 'checking' | 'savings' | 'credit' | 'cash',
    balance: '',
    color: '#95b99c',
  });

  const accountIcons = {
    checking: Building2,
    savings: Wallet,
    credit: CreditCard,
    cash: Banknote,
  };

  const accountColors = [
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
      await addAccount({
        name: formData.name,
        type: formData.type,
        balance: parseFloat(formData.balance),
        color: formData.color,
      });
      setIsOpen(false);
      setFormData({
        name: '',
        type: 'checking',
        balance: '',
        color: '#95b99c',
      });
    } catch (error) {
      console.error('Error adding account:', error);
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="space-y-6">
      {/* Total Balance */}
      <Card className="p-6 border-border">
        <p className="text-muted-foreground mb-2">Total Balance</p>
        <h2 className="text-foreground">${totalBalance.toFixed(2)}</h2>
        <p className="text-sm text-muted-foreground/70 mt-2">Across {accounts.length} account{accounts.length !== 1 ? 's' : ''}</p>
      </Card>

      {/* Accounts List */}
      <div className="space-y-3">
        {accounts.length === 0 ? (
          <Card className="p-8 text-center border-border">
            <Wallet className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">No accounts yet</p>
            <p className="text-sm text-muted-foreground/70 mt-2">Add your first account to get started</p>
          </Card>
        ) : (
          accounts.map((account) => {
            const Icon = accountIcons[account.type];
            return (
              <Card 
                key={account.id} 
                className="p-5 border-border"
                style={{ borderLeftWidth: '4px', borderLeftColor: account.color }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: `${account.color}15` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: account.color }} />
                    </div>
                    <div>
                      <p className="text-foreground">{account.name}</p>
                      <Badge 
                        variant="secondary" 
                        className="mt-1 bg-muted text-muted-foreground capitalize"
                      >
                        {account.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground">${account.balance.toFixed(2)}</p>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Add Account Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Add Account
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>New Account</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Account Name</Label>
              <Input
                placeholder="e.g., Main Checking"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Account Type</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Checking</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="credit">Credit Card</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Initial Balance</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Color</Label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {accountColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`w-10 h-10 rounded-lg transition-all ${
                      formData.color === color.value ? 'ring-2 ring-offset-2 ring-primary' : ''
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Add Account
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

