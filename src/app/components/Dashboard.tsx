import { useState, useMemo } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PiggyBank,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  RussianRuble,
  Wallet,
  CreditCard,
  Building2,
  Banknote
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import { useFinanceData } from '@/app/providers/FinanceDataProvider';

export const Dashboard: React.FC = () => {
  const { transactions, accounts, goals, addTransaction, addAccount } = useFinanceData();
  const [isOpen, setIsOpen] = useState(false);
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    description: '',
    category: '',
    accountId: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [accountFormData, setAccountFormData] = useState({
    name: '',
    type: 'checking' as 'checking' | 'savings' | 'credit' | 'cash',
    balance: '',
  });

  const categories = {
    income: ['Зарплата', 'Фриланс', 'Инвестиции', 'Подарок', 'Прочее'],
    expense: ['Еда', 'Транспорт', 'Покупки', 'Счета', 'Развлечения', 'Здоровье', 'Прочее'],
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addAccount({
        name: accountFormData.name,
        type: accountFormData.type,
        balance: parseFloat(accountFormData.balance),
      });
      setIsAccountDialogOpen(false);
      setAccountFormData({
        name: '',
        type: 'checking',
        balance: '',
      });
    } catch (error) {
      console.error('Error adding account:', error);
    }
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

  // Calculate totals
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  
  const accountIcons = {
    checking: Building2,
    savings: Wallet,
    credit: CreditCard,
    cash: Banknote,
  };
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyIncome = transactions
    .filter(t => {
      const date = new Date(t.date);
      return t.type === 'income' && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = transactions
    .filter(t => {
      const date = new Date(t.date);
      return t.type === 'expense' && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSavingsGoal = goals.reduce((sum, g) => sum + g.target, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.current, 0);

  // Last 6 months data
  const chartData = useMemo(() => {
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    const data = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.getMonth();
      const year = date.getFullYear();
      
      const income = transactions
        .filter(t => {
          const tDate = new Date(t.date);
          return t.type === 'income' && tDate.getMonth() === month && tDate.getFullYear() === year;
        })
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = transactions
        .filter(t => {
          const tDate = new Date(t.date);
          return t.type === 'expense' && tDate.getMonth() === month && tDate.getFullYear() === year;
        })
        .reduce((sum, t) => sum + t.amount, 0);
      
      data.push({
        month: months[month],
        value: income - expenses,
      });
    }
    
    return data;
  }, [transactions]);

  // Transactions filtering
  const filteredTransactions = transactions
    .filter(t => filter === 'all' || t.type === filter)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      {/* Balance Card and Accounts Gallery */}
      <div className="space-y-3">
        <div className="flex flex-row gap-4 overflow-x-auto pb-2 -mx-4 px-4">
          <Card className="p-6 border-0 min-w-[55vw] flex-shrink-0 bg-primary text-primary-foreground">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary-foreground/20">
                <DollarSign className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-primary-foreground/90 text-sm font-medium">Общий баланс</p>
                <p className="text-primary-foreground/70 text-xs">Все счета</p>
              </div>
            </div>
            <h2 className="text-primary-foreground text-2xl font-semibold">₽{totalBalance.toFixed(2)}</h2>
          </Card>
          {accounts.map((acc) => {
            const Icon = accountIcons[acc.type];
            return (
              <Card
                key={acc.id}
                className="p-6 border-0 min-w-[55vw] flex-shrink-0 bg-primary text-primary-foreground"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary-foreground/20">
                    <Icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-primary-foreground/90 text-sm font-medium">{acc.name}</p>
                    <p className="text-primary-foreground/70 text-xs">
                      {acc.type === 'checking' ? 'Расчетный' : 
                       acc.type === 'savings' ? 'Накопительный' : 
                       acc.type === 'credit' ? 'Кредитная карта' : 'Наличные'}
                    </p>
                  </div>
                </div>
                <h2 className="text-primary-foreground text-2xl font-semibold">₽{acc.balance.toFixed(2)}</h2>
              </Card>
            );
          })}
        </div>
        
        {/* Add Account Button */}
        <Dialog open={isAccountDialogOpen} onOpenChange={setIsAccountDialogOpen}>
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
            <form onSubmit={handleAccountSubmit} className="space-y-4">
              <div>
                <Label>Название счета</Label>
                <Input
                  placeholder="Например, Основной расчетный"
                  value={accountFormData.name}
                  onChange={(e) => setAccountFormData({ ...accountFormData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label>Тип счета</Label>
                <Select value={accountFormData.type} onValueChange={(value: any) => setAccountFormData({ ...accountFormData, type: value })}>
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
                  value={accountFormData.balance}
                  onChange={(e) => setAccountFormData({ ...accountFormData, balance: e.target.value })}
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

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg">
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Доходы</p>
              <p className="text-green-600">₽{monthlyIncome.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg">
              <TrendingDown className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Расходы</p>
              <p className="text-red-600">₽{monthlyExpenses.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg">
              <RussianRuble className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Этот месяц</p>
              <p className={`${monthlyIncome - monthlyExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₽{(monthlyIncome - monthlyExpenses).toFixed(2)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg">
              <PiggyBank className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Накоплено</p>
              <p className="text-foreground">₽{totalSaved.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Chart */}
      <Card className="p-4 border-border">
        <h3 className="text-foreground mb-4">Денежный поток (Последние 6 месяцев)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData}>
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#4f6d4b', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#4f6d4b', fontSize: 12 }}
              tickFormatter={(value) => `₽${value}`}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#10b981' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Transactions Section */}
      <div>
        <h3 className="text-foreground mb-3">Транзакции</h3>
        
        {/* Filter */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-primary text-primary-foreground' : ''}
          >
            Все
          </Button>
          <Button
            variant={filter === 'income' ? 'default' : 'outline'}
            onClick={() => setFilter('income')}
            className={filter === 'income' ? 'bg-primary text-primary-foreground' : ''}
          >
            Доходы
          </Button>
          <Button
            variant={filter === 'expense' ? 'default' : 'outline'}
            onClick={() => setFilter('expense')}
            className={filter === 'expense' ? 'bg-primary text-primary-foreground' : ''}
          >
            Расходы
          </Button>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <Card className="p-8 text-center border-border">
              <p className="text-muted-foreground">Пока нет транзакций</p>
              <p className="text-sm text-muted-foreground/70 mt-2">Добавьте первую транзакцию ниже</p>
            </Card>
          ) : (
            filteredTransactions.map((transaction) => {
              const account = accounts.find(a => a.id === transaction.accountId);
              return (
                <Card key={transaction.id} className="p-4 border-border">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'income' ? (
                          <ArrowUpRight className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowDownLeft className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-foreground">{transaction.description || 'Без описания'}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary" className="bg-muted text-muted-foreground">
                            {transaction.category}
                          </Badge>
                          {account && (
                            <Badge variant="outline" className="border-border text-muted-foreground">
                              {account.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`${transaction.type === 'income' ? 'text-green-600' : 'text-foreground'}`}>
                        {transaction.type === 'income' ? '+' : '-'}₽{transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(transaction.date).toLocaleDateString('ru-RU', { 
                          day: 'numeric',
                          month: 'short', 
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Add Transaction Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Добавить транзакцию
          </Button>
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
    </div>
  );
};

