import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Plus } from 'lucide-react';
import { useFinanceData } from '@/app/providers/FinanceDataProvider';

export const AddTransactionButton: React.FC = () => {
  const { accounts, addTransaction } = useFinanceData();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    description: '',
    category: '',
    accountId: '',
    date: new Date().toISOString().split('T')[0],
  });

  const categories = {
    income: ['Зарплата', 'Фриланс', 'Инвестиции', 'Подарок', 'Прочее'],
    expense: ['Еда', 'Транспорт', 'Покупки', 'Счета', 'Развлечения', 'Здоровье', 'Прочее'],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTransaction({
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description,
        category: formData.category,
        accountId: formData.accountId,
        date: formData.date,
      });
      setIsOpen(false);
      setFormData({
        type: 'expense',
        amount: '',
        description: '',
        category: '',
        accountId: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center justify-center transition-colors text-primary w-[50px]">
          <Plus className="w-9 h-9" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Новая транзакция</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={formData.type === 'expense' ? 'default' : 'outline'}
              onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
              className={formData.type === 'expense' ? 'bg-primary text-primary-foreground' : ''}
            >
              Расход
            </Button>
            <Button
              type="button"
              variant={formData.type === 'income' ? 'default' : 'outline'}
              onClick={() => setFormData({ ...formData, type: 'income', category: '' })}
              className={formData.type === 'income' ? 'bg-primary text-primary-foreground' : ''}
            >
              Доход
            </Button>
          </div>

          <div>
            <Label>Сумма</Label>
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
            <Label>Описание (необязательно)</Label>
            <Input
              placeholder="Введите описание"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <Label>Категория</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {categories[formData.type].map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Счет</Label>
            <Select value={formData.accountId} onValueChange={(value) => setFormData({ ...formData, accountId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите счет" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Дата</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            Добавить транзакцию
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

