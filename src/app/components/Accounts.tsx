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
  });

  const accountIcons = {
    checking: Building2,
    savings: Wallet,
    credit: CreditCard,
    cash: Banknote,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addAccount({
        name: formData.name,
        type: formData.type,
        balance: parseFloat(formData.balance),
      });
      setIsOpen(false);
      setFormData({
        name: '',
        type: 'checking',
        balance: '',
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
        <p className="text-muted-foreground mb-2">Общий баланс</p>
        <h2 className="text-foreground">₽{totalBalance.toFixed(2)}</h2>
        <p className="text-sm text-muted-foreground/70 mt-2">В {accounts.length} {accounts.length === 1 ? 'счете' : accounts.length < 5 ? 'счетах' : 'счетах'}</p>
      </Card>

      {/* Accounts List */}
      <div className="space-y-3">
        {accounts.length === 0 ? (
          <Card className="p-8 text-center border-border">
            <Wallet className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">Пока нет счетов</p>
            <p className="text-sm text-muted-foreground/70 mt-2">Добавьте первый счет, чтобы начать</p>
          </Card>
        ) : (
          accounts.map((account) => {
            const Icon = accountIcons[account.type];
            return (
              <Card 
                key={account.id} 
                className="p-5 border-border"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-muted">
                      <Icon className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-foreground">{account.name}</p>
                      <Badge 
                        variant="secondary" 
                        className="mt-1 bg-muted text-muted-foreground"
                      >
                        {account.type === 'checking' ? 'Расчетный' : account.type === 'savings' ? 'Накопительный' : account.type === 'credit' ? 'Кредитная карта' : 'Наличные'}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground">₽{account.balance.toFixed(2)}</p>
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
            Добавить счет
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Новый счет</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Название счета</Label>
              <Input
                placeholder="Например, Основной расчетный"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Тип счета</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Расчетный</SelectItem>
                  <SelectItem value="savings">Накопительный</SelectItem>
                  <SelectItem value="credit">Кредитная карта</SelectItem>
                  <SelectItem value="cash">Наличные</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Начальный баланс</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Добавить счет
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

