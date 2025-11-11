import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface Equipment {
  id: number;
  inventory_number: string;
  name: string;
  category: string;
  description: string;
  daily_rate: number;
  status: 'available' | 'rented' | 'maintenance';
  specifications: Record<string, string>;
}

interface Rental {
  id: number;
  equipment_name: string;
  client_name: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  paid_amount: number;
  status: string;
  contract_number: string;
}

interface Stats {
  totalEquipment: number;
  availableEquipment: number;
  activeRentals: number;
  totalRevenue: number;
  utilizationRate: number;
}

const Index = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalEquipment: 0,
    availableEquipment: 0,
    activeRentals: 0,
    totalRevenue: 0,
    utilizationRate: 0
  });
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rentalForm, setRentalForm] = useState({
    clientName: '',
    clientEmail: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchEquipment();
    fetchRentals();
    fetchStats();
  }, []);

  const fetchEquipment = async () => {
    const mockEquipment: Equipment[] = [
      {
        id: 1,
        inventory_number: 'EQ-001',
        name: 'MacBook Pro 16"',
        category: 'Ноутбуки',
        description: 'Мощный ноутбук для профессиональной работы',
        daily_rate: 2500,
        status: 'available',
        specifications: { cpu: 'Apple M2 Pro', ram: '32GB', storage: '1TB SSD' }
      },
      {
        id: 2,
        inventory_number: 'EQ-002',
        name: 'iPhone 15 Pro',
        category: 'Смартфоны',
        description: 'Флагманский смартфон Apple',
        daily_rate: 1500,
        status: 'rented',
        specifications: { storage: '256GB', color: 'Titanium' }
      },
      {
        id: 3,
        inventory_number: 'EQ-003',
        name: 'iPad Pro 12.9"',
        category: 'Планшеты',
        description: 'Профессиональный планшет для творчества',
        daily_rate: 1800,
        status: 'available',
        specifications: { storage: '512GB', connectivity: 'Wi-Fi + Cellular' }
      },
      {
        id: 4,
        inventory_number: 'EQ-004',
        name: 'Sony A7 IV',
        category: 'Камеры',
        description: 'Полнокадровая беззеркальная камера',
        daily_rate: 3500,
        status: 'available',
        specifications: { megapixels: '33MP', video: '4K 60fps' }
      },
      {
        id: 5,
        inventory_number: 'EQ-005',
        name: 'DJI Mavic 3',
        category: 'Дроны',
        description: 'Профессиональный дрон для съёмки',
        daily_rate: 4000,
        status: 'maintenance',
        specifications: { flight_time: '46 min', camera: 'Hasselblad' }
      },
      {
        id: 6,
        inventory_number: 'EQ-006',
        name: 'Dell XPS 15',
        category: 'Ноутбуки',
        description: 'Высокопроизводительный ноутбук для бизнеса',
        daily_rate: 2200,
        status: 'available',
        specifications: { cpu: 'Intel i9', ram: '32GB', gpu: 'RTX 4060' }
      }
    ];
    setEquipment(mockEquipment);
  };

  const fetchRentals = async () => {
    const mockRentals: Rental[] = [
      {
        id: 1,
        equipment_name: 'iPhone 15 Pro',
        client_name: 'Иван Петров',
        start_date: '2025-11-05',
        end_date: '2025-11-15',
        total_amount: 15000,
        paid_amount: 15000,
        status: 'active',
        contract_number: 'RNT-2025-001'
      },
      {
        id: 2,
        equipment_name: 'Sony A7 IV',
        client_name: 'Мария Сидорова',
        start_date: '2025-11-08',
        end_date: '2025-11-12',
        total_amount: 14000,
        paid_amount: 7000,
        status: 'active',
        contract_number: 'RNT-2025-002'
      },
      {
        id: 3,
        equipment_name: 'MacBook Pro 16"',
        client_name: 'Алексей Смирнов',
        start_date: '2025-10-20',
        end_date: '2025-10-30',
        total_amount: 25000,
        paid_amount: 25000,
        status: 'completed',
        contract_number: 'RNT-2025-003'
      }
    ];
    setRentals(mockRentals);
  };

  const fetchStats = () => {
    setStats({
      totalEquipment: 6,
      availableEquipment: 4,
      activeRentals: 2,
      totalRevenue: 54000,
      utilizationRate: 66.7
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      available: { variant: "default", label: 'Свободно' },
      rented: { variant: "secondary", label: 'В аренде' },
      maintenance: { variant: "destructive", label: 'Ремонт' },
      active: { variant: "default", label: 'Активна' },
      completed: { variant: "outline", label: 'Завершена' }
    };
    const config = variants[status] || { variant: "outline" as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleRentClick = (item: Equipment) => {
    setSelectedEquipment(item);
    setIsDialogOpen(true);
  };

  const handleRentalSubmit = () => {
    if (!rentalForm.clientName || !rentalForm.clientEmail || !rentalForm.startDate || !rentalForm.endDate) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive'
      });
      return;
    }
    toast({
      title: 'Аренда оформлена!',
      description: `${selectedEquipment?.name} забронировано для ${rentalForm.clientName}`,
    });
    setIsDialogOpen(false);
    setRentalForm({ clientName: '', clientEmail: '', startDate: '', endDate: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Icon name="Laptop" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  RentTech Pro
                </h1>
                <p className="text-xs text-muted-foreground">Система аренды оборудования</p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                  <Icon name="Plus" size={18} className="mr-2" />
                  Новая аренда
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Оформление аренды</DialogTitle>
                  <DialogDescription>
                    {selectedEquipment ? `${selectedEquipment.name} — ${selectedEquipment.daily_rate.toLocaleString()} ₽/день` : 'Заполните данные для аренды'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">ФИО клиента</Label>
                    <Input
                      id="clientName"
                      value={rentalForm.clientName}
                      onChange={(e) => setRentalForm({...rentalForm, clientName: e.target.value})}
                      placeholder="Иван Иванов"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">Email</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={rentalForm.clientEmail}
                      onChange={(e) => setRentalForm({...rentalForm, clientEmail: e.target.value})}
                      placeholder="ivan@example.com"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Дата начала</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={rentalForm.startDate}
                        onChange={(e) => setRentalForm({...rentalForm, startDate: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">Дата окончания</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={rentalForm.endDate}
                        onChange={(e) => setRentalForm({...rentalForm, endDate: e.target.value})}
                      />
                    </div>
                  </div>
                  {selectedEquipment && rentalForm.startDate && rentalForm.endDate && (
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Итого к оплате:</span>
                        <span className="text-2xl font-bold text-primary">
                          {(selectedEquipment.daily_rate * Math.ceil((new Date(rentalForm.endDate).getTime() - new Date(rentalForm.startDate).getTime()) / (1000 * 3600 * 24))).toLocaleString()} ₽
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Отмена
                  </Button>
                  <Button onClick={handleRentalSubmit} className="flex-1 bg-gradient-to-r from-primary to-secondary">
                    Оформить аренду
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 animate-fade-in">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Всего оборудования</CardTitle>
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon name="Package" size={16} className="text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalEquipment}</div>
              <p className="text-xs text-muted-foreground mt-1">единиц техники</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Доступно</CardTitle>
                <div className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Icon name="CheckCircle" size={16} className="text-secondary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.availableEquipment}</div>
              <p className="text-xs text-muted-foreground mt-1">готово к аренде</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Активные аренды</CardTitle>
                <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Icon name="TrendingUp" size={16} className="text-accent" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.activeRentals}</div>
              <p className="text-xs text-muted-foreground mt-1">в работе</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Выручка</CardTitle>
                <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Icon name="DollarSign" size={16} className="text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalRevenue.toLocaleString()} ₽</div>
              <p className="text-xs text-muted-foreground mt-1">за период</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="equipment" className="space-y-6">
          <TabsList className="bg-card border">
            <TabsTrigger value="equipment" className="gap-2">
              <Icon name="Laptop" size={16} />
              Оборудование
            </TabsTrigger>
            <TabsTrigger value="rentals" className="gap-2">
              <Icon name="FileText" size={16} />
              Аренда
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <Icon name="BarChart3" size={16} />
              Аналитика
            </TabsTrigger>
          </TabsList>

          <TabsContent value="equipment" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <CardTitle>Каталог оборудования</CardTitle>
                    <CardDescription>Управление техникой и инвентарными номерами</CardDescription>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Input
                      placeholder="Поиск..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-64"
                    />
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Статус" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все</SelectItem>
                        <SelectItem value="available">Свободно</SelectItem>
                        <SelectItem value="rented">В аренде</SelectItem>
                        <SelectItem value="maintenance">Ремонт</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredEquipment.map((item, index) => (
                    <Card
                      key={item.id}
                      className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-scale-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="h-40 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-grid-white/10" />
                        <Icon name="Laptop" size={48} className="text-primary relative z-10" />
                        <div className="absolute top-2 right-2">
                          {getStatusBadge(item.status)}
                        </div>
                      </div>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg truncate">{item.name}</CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                              <Icon name="Tag" size={12} />
                              {item.inventory_number}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">{item.category}</Badge>
                          {Object.entries(item.specifications).slice(0, 2).map(([key, value]) => (
                            <Badge key={key} variant="secondary" className="text-xs">
                              {value}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div>
                            <p className="text-2xl font-bold text-primary">{item.daily_rate.toLocaleString()} ₽</p>
                            <p className="text-xs text-muted-foreground">за день</p>
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-primary to-secondary"
                            onClick={() => handleRentClick(item)}
                            disabled={item.status !== 'available'}
                          >
                            Арендовать
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rentals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Активные аренды</CardTitle>
                <CardDescription>Управление договорами и сроками аренды</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rentals.map((rental, index) => (
                    <Card
                      key={rental.id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-lg">{rental.equipment_name}</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <Icon name="User" size={14} />
                              {rental.client_name}
                            </CardDescription>
                          </div>
                          {getStatusBadge(rental.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Icon name="Calendar" size={12} />
                              Договор
                            </p>
                            <p className="font-medium">{rental.contract_number}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Icon name="CalendarRange" size={12} />
                              Период
                            </p>
                            <p className="font-medium text-sm">
                              {new Date(rental.start_date).toLocaleDateString('ru')} - {new Date(rental.end_date).toLocaleDateString('ru')}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Icon name="Wallet" size={12} />
                              Сумма
                            </p>
                            <p className="font-medium">{rental.total_amount.toLocaleString()} ₽</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Оплачено</span>
                            <span className="font-medium">{rental.paid_amount.toLocaleString()} ₽ / {rental.total_amount.toLocaleString()} ₽</span>
                          </div>
                          <Progress value={(rental.paid_amount / rental.total_amount) * 100} className="h-2" />
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Icon name="FileText" size={14} className="mr-2" />
                            Договор
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Icon name="CreditCard" size={14} className="mr-2" />
                            Платёж
                          </Button>
                          <Button variant="outline" size="sm">
                            <Icon name="MoreVertical" size={14} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Загрузка оборудования</CardTitle>
                  <CardDescription>Процент использования техники</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center py-8">
                    <div className="relative inline-flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full border-8 border-muted" />
                      <div
                        className="absolute inset-0 w-32 h-32 rounded-full border-8 border-primary border-t-transparent animate-spin"
                        style={{ animation: 'none', borderTopColor: 'transparent', borderRightColor: 'transparent', transform: `rotate(${(stats.utilizationRate / 100) * 360}deg)` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            {stats.utilizationRate}%
                          </div>
                          <div className="text-xs text-muted-foreground">загрузка</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-primary" />
                        <span className="text-sm">В аренде</span>
                      </div>
                      <span className="font-medium">2 ед.</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-secondary" />
                        <span className="text-sm">Свободно</span>
                      </div>
                      <span className="font-medium">4 ед.</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-destructive" />
                        <span className="text-sm">Ремонт</span>
                      </div>
                      <span className="font-medium">1 ед.</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Выручка по категориям</CardTitle>
                  <CardDescription>Доход от аренды разных типов техники</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { category: 'Ноутбуки', amount: 25000, color: 'from-primary to-primary/70' },
                    { category: 'Смартфоны', amount: 15000, color: 'from-secondary to-secondary/70' },
                    { category: 'Камеры', amount: 14000, color: 'from-accent to-accent/70' }
                  ].map((item, index) => (
                    <div key={item.category} className="space-y-2 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.category}</span>
                        <span className="text-sm font-bold">{item.amount.toLocaleString()} ₽</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${item.color} transition-all duration-1000`}
                          style={{ width: `${(item.amount / 25000) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Итого:</span>
                      <span className="text-xl font-bold text-primary">{stats.totalRevenue.toLocaleString()} ₽</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Популярное оборудование</CardTitle>
                <CardDescription>Топ арендованной техники за месяц</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'MacBook Pro 16"', rentals: 8, revenue: 50000 },
                    { name: 'Sony A7 IV', rentals: 6, revenue: 42000 },
                    { name: 'iPhone 15 Pro', rentals: 5, revenue: 37500 },
                    { name: 'iPad Pro 12.9"', rentals: 4, revenue: 28800 },
                    { name: 'DJI Mavic 3', rentals: 3, revenue: 24000 }
                  ].map((item, index) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-4 p-4 rounded-lg border hover:border-primary/50 transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-bold text-lg">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.rentals} аренд</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{item.revenue.toLocaleString()} ₽</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;