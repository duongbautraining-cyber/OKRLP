import React, { useState, useEffect, useMemo } from 'react';

// Dữ liệu mẫu ban đầu để hiển thị ngay khi deploy lên GitHub
const DEFAULT_OKRS = [
  {
    id: 'okr-1',
    objective: 'Bứt phá thu nhập Freelance & Đạt mục tiêu tài chính Quý 2',
    startDate: '2026-04-01',
    endDate: '2026-06-30',
    keyResults: [
      { id: 'kr-1-1', text: 'Doanh số bán hàng đạt 100,000,000đ', current: 60000000, target: 100000000, unit: 'đ', autoLink: 'sales' },
      { id: 'kr-1-2', text: 'Ký mới 5 khách hàng thuộc nhóm VIP', current: 2, target: 5, unit: 'khách', autoLink: 'customers-vip' },
      { id: 'kr-1-3', text: 'Tỷ lệ hài lòng CSKH đạt tối thiểu 4.5/5 sao', current: 4.7, target: 5, unit: 'sao', autoLink: 'cskh-rating' }
    ]
  },
  {
    id: 'okr-2',
    objective: 'Nâng cao thương hiệu cá nhân và kỹ năng chuyên môn',
    startDate: '2026-04-01',
    endDate: '2026-06-30',
    keyResults: [
      { id: 'kr-2-1', text: 'Hoàn thành 3 khóa học chuyên sâu UI/UX', current: 2, target: 3, unit: 'khóa', autoLink: 'manual' },
      { id: 'kr-2-2', text: 'Viết và đăng tải 12 bài viết chuyên môn trên Blog/LinkedIn', current: 6, target: 12, unit: 'bài', autoLink: 'manual' },
      { id: 'kr-2-3', text: 'Hoàn thành 100% các công việc quan trọng độ ưu tiên Cao', current: 3, target: 5, unit: 'task', autoLink: 'tasks-high' }
    ]
  }
];

const DEFAULT_SALES = [
  { id: 'sale-1', customerName: 'Nguyễn Văn A', amount: 45000000, date: '2026-05-10', product: 'Thiết kế Web App E-commerce', status: 'Đã thanh toán' },
  { id: 'sale-2', customerName: 'Trần Thị B', amount: 15000000, date: '2026-05-18', product: 'Tư vấn trải nghiệm người dùng (UX)', status: 'Đã thanh toán' },
  { id: 'sale-3', customerName: 'Lê Hoàng C', amount: 35000000, date: '2026-05-25', product: 'Setup hệ thống CRM bán hàng', status: 'Chờ thanh toán' },
  { id: 'sale-4', customerName: 'Phạm Minh D', amount: 8000000, date: '2026-04-15', product: 'Thiết kế Landing Page tuyển dụng', status: 'Đã thanh toán' }
];

const DEFAULT_CUSTOMERS = [
  { id: 'cust-1', name: 'Nguyễn Văn A', phone: '0901234567', email: 'nva@company.com', segment: 'VIP', notes: 'Đối tác lớn, liên hệ chính dự án Web App' },
  { id: 'cust-2', name: 'Trần Thị B', phone: '0912345678', email: 'ttb@agency.vn', segment: 'Thường', notes: 'Khách hàng giới thiệu từ bạn bè' },
  { id: 'cust-3', name: 'Lê Hoàng C', phone: '0987654321', email: 'lhc@enterprise.com', segment: 'VIP', notes: 'Doanh nghiệp FDI, rất quan tâm bảo mật' },
  { id: 'cust-4', name: 'Phạm Minh D', phone: '0933445566', email: 'pmd@startup.io', segment: 'Mới', notes: 'Startup trẻ, ngân sách ban đầu hạn chế' }
];

const DEFAULT_CSKH = [
  { id: 'cskh-1', customerName: 'Nguyễn Văn A', date: '2026-05-12', channel: 'Gặp trực tiếp', content: 'Trao đổi về thiết kế layout trang chủ, khách rất ưng ý tông màu xanh Navy.', rating: 5 },
  { id: 'cskh-2', customerName: 'Trần Thị B', date: '2026-05-20', channel: 'Gọi điện thoại', content: 'Hỏi thăm trải nghiệm sau 2 tuần bàn giao. Khách đề xuất thêm tài liệu hướng dẫn nhanh.', rating: 4 },
  { id: 'cskh-3', customerName: 'Lê Hoàng C', date: '2026-05-28', channel: 'Email', content: 'Gửi bản dự thảo điều khoản thanh toán & tiến độ triển khai CRM đợt 2.', rating: 5 }
];

const DEFAULT_TASKS = [
  { id: 'task-1', title: 'Hoàn thiện thiết kế UI/UX Dashboard bán hàng', deadline: '2026-05-15', priority: 'Cao', status: 'Đã xong', linkedOkrId: 'okr-1' },
  { id: 'task-2', title: 'Phát triển module API kết nối cổng thanh toán', deadline: '2026-05-22', priority: 'Cao', status: 'Đang làm', linkedOkrId: 'okr-1' },
  { id: 'task-3', title: 'Viết bài blog chia sẻ kinh nghiệm thiết kế Responsive', deadline: '2026-05-30', priority: 'Trung bình', status: 'Chưa làm', linkedOkrId: 'okr-2' },
  { id: 'task-4', title: 'Nghiệm thu dự án Landing Page & gửi hóa đơn', deadline: '2026-05-29', priority: 'Thấp', status: 'Đã xong', linkedOkrId: 'okr-1' },
  { id: 'task-5', title: 'Hoàn thành khóa học Advanced Micro-interactions', deadline: '2026-05-25', priority: 'Cao', status: 'Đã xong', linkedOkrId: 'okr-2' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // States tải dữ liệu an toàn từ LocalStorage
  const [okrs, setOkrs] = useState(() => {
    try {
      const saved = localStorage.getItem('okr_data');
      return saved ? JSON.parse(saved) : DEFAULT_OKRS;
    } catch (e) {
      console.error('Lỗi đọc dữ liệu OKRs từ localStorage:', e);
      return DEFAULT_OKRS;
    }
  });
  
  const [sales, setSales] = useState(() => {
    try {
      const saved = localStorage.getItem('sales_data');
      return saved ? JSON.parse(saved) : DEFAULT_SALES;
    } catch (e) {
      console.error('Lỗi đọc dữ liệu bán hàng từ localStorage:', e);
      return DEFAULT_SALES;
    }
  });
  
  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem('customers_data');
      return saved ? JSON.parse(saved) : DEFAULT_CUSTOMERS;
    } catch (e) {
      console.error('Lỗi đọc dữ liệu khách hàng từ localStorage:', e);
      return DEFAULT_CUSTOMERS;
    }
  });
  
  const [cskh, setCskh] = useState(() => {
    try {
      const saved = localStorage.getItem('cskh_data');
      return saved ? JSON.parse(saved) : DEFAULT_CSKH;
    } catch (e) {
      console.error('Lỗi đọc dữ liệu CSKH từ localStorage:', e);
      return DEFAULT_CSKH;
    }
  });
  
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('tasks_data');
      return saved ? JSON.parse(saved) : DEFAULT_TASKS;
    } catch (e) {
      console.error('Lỗi đọc dữ liệu tác vụ từ localStorage:', e);
      return DEFAULT_TASKS;
    }
  });

  // Bộ lọc thời gian Dashboard (Mặc định lọc tháng 5 năm 2026)
  const [startDate, setStartDate] = useState('2026-05-01');
  const [endDate, setEndDate] = useState('2026-05-31');

  // Ô tìm kiếm cho các danh mục
  const [searchTerm, setSearchTerm] = useState('');
  
  // Trạng thái modal
  const [showModal, setShowModal] = useState(null); // 'okr' | 'sale' | 'customer' | 'cskh' | 'task'
  const [editingItem, setEditingItem] = useState(null);
  
  // Trạng thái thông báo Toast
  const [toast, setToast] = useState(null);

  // Đồng bộ hóa dữ liệu vào LocalStorage mỗi khi có thay đổi
  useEffect(() => {
    localStorage.setItem('okr_data', JSON.stringify(okrs));
  }, [okrs]);
  
  useEffect(() => {
    localStorage.setItem('sales_data', JSON.stringify(sales));
  }, [sales]);
  
  useEffect(() => {
    localStorage.setItem('customers_data', JSON.stringify(customers));
  }, [customers]);
  
  useEffect(() => {
    localStorage.setItem('cskh_data', JSON.stringify(cskh));
  }, [cskh]);
  
  useEffect(() => {
    localStorage.setItem('tasks_data', JSON.stringify(tasks));
  }, [tasks]);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Cập nhật tiến trình Key Results một cách tự động khi thay đổi giao dịch, khách hàng, hay task công việc
  useEffect(() => {
    const totalRevenuePaid = sales
      .filter(s => s.status === 'Đã thanh toán')
      .reduce((sum, item) => sum + item.amount, 0);

    const vipCustomerCount = customers.filter(c => c.segment === 'VIP').length;

    const avgRating = cskh.length > 0 
      ? parseFloat((cskh.reduce((sum, item) => sum + item.rating, 0) / cskh.length).toFixed(1)) 
      : 0;

    const completedHighTasks = tasks.filter(t => t.priority === 'Cao' && t.status === 'Đã xong').length;

    setOkrs(prevOkrs => {
      let changed = false;
      const updated = prevOkrs.map(okr => {
        const updatedKrs = okr.keyResults.map(kr => {
          let nextVal = kr.current;
          if (kr.autoLink === 'sales') {
            nextVal = totalRevenuePaid;
          } else if (kr.autoLink === 'customers-vip') {
            nextVal = vipCustomerCount;
          } else if (kr.autoLink === 'cskh-rating') {
            nextVal = avgRating;
          } else if (kr.autoLink === 'tasks-high') {
            nextVal = completedHighTasks;
          }
          if (nextVal !== kr.current) {
            changed = true;
            return { ...kr, current: nextVal };
          }
          return kr;
        });
        return { ...okr, keyResults: updatedKrs };
      });
      return changed ? updated : prevOkrs;
    });
  }, [sales, customers, cskh, tasks]);

  // Bộ lọc mảng dữ liệu theo thời gian hiển thị trên Dashboard
  const filteredSales = useMemo(() => {
    return sales.filter(s => s.date >= startDate && s.date <= endDate);
  }, [sales, startDate, endDate]);

  const filteredCskh = useMemo(() => {
    return cskh.filter(c => c.date >= startDate && c.date <= endDate);
  }, [cskh, startDate, endDate]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => t.deadline >= startDate && t.deadline <= endDate);
  }, [tasks, startDate, endDate]);

  // Tính toán số liệu thống kê trong khoảng thời gian đã lọc
  const metrics = useMemo(() => {
    const totalSalesRevenue = filteredSales.reduce((sum, s) => sum + s.amount, 0);
    const paidSalesRevenue = filteredSales.filter(s => s.status === 'Đã thanh toán').reduce((sum, s) => sum + s.amount, 0);
    const orderCount = filteredSales.length;
    
    const uniqueCustInSales = new Set(filteredSales.map(s => s.customerName));
    const activeClientsCount = uniqueCustInSales.size;
    
    const cskhCount = filteredCskh.length;
    const avgCskhRating = filteredCskh.length > 0 
      ? (filteredCskh.reduce((sum, c) => sum + c.rating, 0) / filteredCskh.length).toFixed(1)
      : 'N/A';

    const completedTasks = filteredTasks.filter(t => t.status === 'Đã xong').length;
    const totalTasksInRange = filteredTasks.length;
    const taskCompletionRate = totalTasksInRange > 0 
      ? Math.round((completedTasks / totalTasksInRange) * 100) 
      : 0;

    // Tính tiến trình trung bình của OKRs
    let totalOkrProgress = 0;
    okrs.forEach(okr => {
      let krSum = 0;
      okr.keyResults.forEach(kr => {
        const pct = Math.min(100, Math.round((kr.current / kr.target) * 100));
        krSum += pct;
      });
      const okrPct = okr.keyResults.length > 0 ? Math.round(krSum / okr.keyResults.length) : 0;
      totalOkrProgress += okrPct;
    });
    const avgOkrProgress = okrs.length > 0 ? Math.round(totalOkrProgress / okrs.length) : 0;

    return {
      totalSalesRevenue,
      paidSalesRevenue,
      orderCount,
      activeClientsCount,
      cskhCount,
      avgCskhRating,
      taskCompletionRate,
      totalTasksInRange,
      completedTasks,
      avgOkrProgress
    };
  }, [filteredSales, filteredCskh, filteredTasks, okrs]);

  const handleSaveOkr = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const objective = formData.get('objective');
    const start = formData.get('startDate');
    const end = formData.get('endDate');

    const krTexts = formData.getAll('krText');
    const krTargets = formData.getAll('krTarget');
    const krUnits = formData.getAll('krUnit');
    const krAutos = formData.getAll('krAutoLink');

    const keyResults = krTexts.map((text, idx) => ({
      id: editingItem ? (editingItem.keyResults[idx]?.id || `kr-${Date.now()}-${idx}`) : `kr-${Date.now()}-${idx}`,
      text,
      current: editingItem ? (editingItem.keyResults[idx]?.current || 0) : 0,
      target: parseFloat(krTargets[idx]) || 0,
      unit: krUnits[idx] || '',
      autoLink: krAutos[idx] || 'manual'
    }));

    if (editingItem) {
      setOkrs(okrs.map(o => o.id === editingItem.id ? { ...o, objective, startDate: start, endDate: end, keyResults } : o));
      triggerToast('Đã cập nhật OKR thành công!');
    } else {
      const newOkr = {
        id: `okr-${Date.now()}`,
        objective,
        startDate: start,
        endDate: end,
        keyResults
      };
      setOkrs([...okrs, newOkr]);
      triggerToast('Đã thêm mới mục tiêu OKR!');
    }
    setShowModal(null);
    setEditingItem(null);
  };

  const handleSaveSale = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const saleData = {
      id: editingItem ? editingItem.id : `sale-${Date.now()}`,
      customerName: formData.get('customerName'),
      amount: parseFloat(formData.get('amount')) || 0,
      date: formData.get('date'),
      product: formData.get('product'),
      status: formData.get('status')
    };

    if (editingItem) {
      setSales(sales.map(s => s.id === editingItem.id ? saleData : s));
      triggerToast('Cập nhật giao dịch bán hàng thành công!');
    } else {
      setSales([saleData, ...sales]);
      triggerToast('Ghi nhận giao dịch bán hàng mới!');
    }
    setShowModal(null);
    setEditingItem(null);
  };

  const handleSaveCustomer = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const custData = {
      id: editingItem ? editingItem.id : `cust-${Date.now()}`,
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      segment: formData.get('segment'),
      notes: formData.get('notes')
    };

    if (editingItem) {
      setCustomers(customers.map(c => c.id === editingItem.id ? custData : c));
      triggerToast('Cập nhật thông tin khách hàng thành công!');
    } else {
      setCustomers([custData, ...customers]);
      triggerToast('Thêm khách hàng thành công!');
    }
    setShowModal(null);
    setEditingItem(null);
  };

  const handleSaveCskh = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const cskhData = {
      id: editingItem ? editingItem.id : `cskh-${Date.now()}`,
      customerName: formData.get('customerName'),
      date: formData.get('date'),
      channel: formData.get('channel'),
      content: formData.get('content'),
      rating: parseInt(formData.get('rating')) || 5
    };

    if (editingItem) {
      setCskh(cskh.map(c => c.id === editingItem.id ? cskhData : c));
      triggerToast('Cập nhật nhật ký chăm sóc thành công!');
    } else {
      setCskh([cskhData, ...cskh]);
      triggerToast('Lưu nhật ký chăm sóc mới!');
    }
    setShowModal(null);
    setEditingItem(null);
  };

  const handleSaveTask = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const taskData = {
      id: editingItem ? editingItem.id : `task-${Date.now()}`,
      title: formData.get('title'),
      deadline: formData.get('deadline'),
      priority: formData.get('priority'),
      status: formData.get('status'),
      linkedOkrId: formData.get('linkedOkrId')
    };

    if (editingItem) {
      setTasks(tasks.map(t => t.id === editingItem.id ? taskData : t));
      triggerToast('Cập nhật công việc thành công!');
    } else {
      setTasks([taskData, ...tasks]);
      triggerToast('Đã thêm công việc mới!');
    }
    setShowModal(null);
    setEditingItem(null);
  };

  const deleteItem = (category, id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mục này?')) {
      if (category === 'okr') {
        setOkrs(okrs.filter(o => o.id !== id));
        triggerToast('Đã xóa OKR mục tiêu', 'info');
      } else if (category === 'sale') {
        setSales(sales.filter(s => s.id !== id));
        triggerToast('Đã xóa giao dịch', 'info');
      } else if (category === 'customer') {
        setCustomers(customers.filter(c => c.id !== id));
        triggerToast('Đã xóa thông tin khách hàng', 'info');
      } else if (category === 'cskh') {
        setCskh(cskh.filter(c => c.id !== id));
        triggerToast('Đã xóa nhật ký chăm sóc', 'info');
      } else if (category === 'task') {
        setTasks(tasks.filter(t => t.id !== id));
        triggerToast('Đã xóa công việc', 'info');
      }
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* Toast Alert Header */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg text-white transition-all transform duration-300 ${toast.type === 'error' ? 'bg-rose-600' : toast.type === 'info' ? 'bg-sky-600' : 'bg-emerald-600'}`}>
          <span className="font-medium mr-2">{toast.type === 'error' ? '⚡' : toast.type === 'info' ? 'ℹ️' : '✓'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white font-bold text-xl tracking-wider shadow">
              🚀 OKR
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Hệ Thống OKR & CRM Cá Nhân</h1>
              <p className="text-xs text-indigo-200">Bản phát hành tối ưu hóa chạy độc lập trên GitHub</p>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="flex flex-wrap items-center gap-4 bg-slate-800/60 p-2 rounded-lg border border-slate-700">
            <div className="text-center px-3 border-r border-slate-700">
              <span className="block text-xs text-slate-400">Tiến độ OKR</span>
              <span className="text-sm font-semibold text-emerald-400">{metrics.avgOkrProgress}%</span>
            </div>
            <div className="text-center px-3 border-r border-slate-700">
              <span className="block text-xs text-slate-400">Doanh thu đạt</span>
              <span className="text-sm font-semibold text-sky-400">{formatCurrency(metrics.paidSalesRevenue)}</span>
            </div>
            <div className="text-center px-3">
              <span className="block text-xs text-slate-400">Độ hài lòng CSKH</span>
              <span className="text-sm font-semibold text-yellow-400">⭐ {metrics.avgCskhRating}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-[72px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 md:space-x-4 py-3 overflow-x-auto scrollbar-none" aria-label="Tabs">
            <button
              onClick={() => { setActiveTab('dashboard'); setSearchTerm(''); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors shrink-0 ${activeTab === 'dashboard' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              📊 Báo cáo & Dashboard
            </button>
            <button
              onClick={() => { setActiveTab('okrs'); setSearchTerm(''); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors shrink-0 ${activeTab === 'okrs' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              🎯 Quản lý OKR
            </button>
            <button
              onClick={() => { setActiveTab('sales'); setSearchTerm(''); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors shrink-0 ${activeTab === 'sales' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              💰 Bán hàng (Doanh số)
            </button>
            <button
              onClick={() => { setActiveTab('customers'); setSearchTerm(''); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors shrink-0 ${activeTab === 'customers' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              👥 Khách hàng (CRM)
            </button>
            <button
              onClick={() => { setActiveTab('cskh'); setSearchTerm(''); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors shrink-0 ${activeTab === 'cskh' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              🤝 Chăm sóc KH (CSKH)
            </button>
            <button
              onClick={() => { setActiveTab('tasks'); setSearchTerm(''); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors shrink-0 ${activeTab === 'tasks' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              📋 Công việc (Tasks)
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Date Filters Container */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span>📅 Bộ lọc dữ liệu Dashboard</span>
                </h2>
                <p className="text-xs text-slate-500">Các chỉ số Doanh thu, Khách hàng hoạt động, CSKH, Task sẽ tính toán trong khoảng này.</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 w-full sm:w-auto">
                  <span className="text-xs text-slate-500 px-2 font-medium">Từ ngày</span>
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-white border-0 text-xs rounded p-1.5 focus:ring-1 focus:ring-indigo-500 font-semibold"
                  />
                </div>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 w-full sm:w-auto">
                  <span className="text-xs text-slate-500 px-2 font-medium">Đến ngày</span>
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-white border-0 text-xs rounded p-1.5 focus:ring-1 focus:ring-indigo-500 font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Metric Summary Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Tổng doanh thu kỳ lọc</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">{formatCurrency(metrics.totalSalesRevenue)}</p>
                    <p className="text-xs text-slate-400 mt-1">Đã thanh toán: {formatCurrency(metrics.paidSalesRevenue)}</p>
                  </div>
                  <span className="text-3xl bg-emerald-100 text-emerald-600 p-2.5 rounded-xl">💰</span>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 font-medium">
                  <span>📈 Phát sinh {metrics.orderCount} hóa đơn</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Đạt mục tiêu OKR</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">{metrics.avgOkrProgress}%</p>
                    <p className="text-xs text-slate-400 mt-1">Trung bình cộng của {okrs.length} OKRs</p>
                  </div>
                  <span className="text-3xl bg-indigo-100 text-indigo-600 p-2.5 rounded-xl">🎯</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-5">
                  <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${metrics.avgOkrProgress}%` }}></div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="absolute top-0 left-0 w-2 h-full bg-yellow-500"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Đánh giá & Chăm sóc</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">⭐ {metrics.avgCskhRating}</p>
                    <p className="text-xs text-slate-400 mt-1">{metrics.cskhCount} lượt liên hệ trong kỳ lọc</p>
                  </div>
                  <span className="text-3xl bg-yellow-100 text-yellow-600 p-2.5 rounded-xl">🤝</span>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <span>Hoạt động tương tác: <strong className="text-slate-800">{metrics.activeClientsCount} khách hàng</strong></span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="absolute top-0 left-0 w-2 h-full bg-pink-500"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Hoàn thành công việc</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">{metrics.taskCompletionRate}%</p>
                    <p className="text-xs text-slate-400 mt-1">{metrics.completedTasks} / {metrics.totalTasksInRange} đầu việc hoàn tất</p>
                  </div>
                  <span className="text-3xl bg-pink-100 text-pink-600 p-2.5 rounded-xl">📋</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-5">
                  <div className="bg-pink-600 h-1.5 rounded-full" style={{ width: `${metrics.taskCompletionRate}%` }}></div>
                </div>
              </div>

            </div>

            {/* Detailed Graphs / Analytics widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: OKR Overview list */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center justify-between">
                  <span>🎯 Tiến độ Mục tiêu Hiện hành (OKRs)</span>
                  <button onClick={() => setActiveTab('okrs')} className="text-xs text-indigo-600 hover:underline">Chi tiết OKRs →</button>
                </h3>
                
                <div className="space-y-6">
                  {okrs.map((okr) => {
                    const okrProgressPct = okr.keyResults.length > 0 
                      ? Math.round(okr.keyResults.reduce((sum, kr) => sum + Math.min(100, Math.round((kr.current / kr.target) * 100)), 0) / okr.keyResults.length)
                      : 0;

                    return (
                      <div key={okr.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-slate-800 text-sm md:text-base">{okr.objective}</h4>
                          <span className="px-2 py-1 rounded bg-indigo-100 text-indigo-700 font-bold text-xs">{okrProgressPct}% Đạt</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full mb-4">
                          <div className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-2 rounded-full" style={{ width: `${okrProgressPct}%` }}></div>
                        </div>

                        {/* Tiny indicators of Key Results */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                          {okr.keyResults.map(kr => {
                            const krPct = Math.min(100, Math.round((kr.current / kr.target) * 100));
                            return (
                              <div key={kr.id} className="bg-white p-2 rounded border border-slate-100 shadow-2xs">
                                <span className="block text-slate-500 font-medium truncate" title={kr.text}>{kr.text}</span>
                                <div className="flex justify-between items-center mt-1">
                                  <span className="text-slate-900 font-semibold">{kr.current.toLocaleString()}/{kr.target.toLocaleString()}{kr.unit}</span>
                                  <span className={`font-bold ${krPct >= 80 ? 'text-emerald-600' : krPct >= 50 ? 'text-indigo-600' : 'text-slate-500'}`}>{krPct}%</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Mini CRM activity & Care Logs */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center justify-between">
                  <span>💬 Tương tác CSKH gần đây</span>
                  <button onClick={() => setActiveTab('cskh')} className="text-xs text-indigo-600 hover:underline">Nhật ký →</button>
                </h3>

                <div className="space-y-4">
                  {filteredCskh.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <p className="text-sm">Không có tương tác CSKH nào trong kỳ lọc đã chọn.</p>
                      <button 
                        onClick={() => { setShowModal('cskh'); setEditingItem(null); }} 
                        className="mt-3 px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-lg hover:bg-indigo-100"
                      >
                        Thêm CSKH mới
                      </button>
                    </div>
                  ) : (
                    filteredCskh.slice(0, 4).map(c => (
                      <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex gap-3">
                        <div className="text-2xl mt-1">
                          {c.channel === 'Gặp trực tiếp' ? '🧑‍🤝‍🧑' : c.channel === 'Gọi điện thoại' ? '📞' : '📧'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-800 truncate">{c.customerName}</span>
                            <span className="text-[10px] text-slate-400">{c.date}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{c.content}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">{c.channel}</span>
                            <span className="text-xs text-yellow-500 font-semibold">{'⭐'.repeat(c.rating)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Bottom Row: Tasks vs Revenue breakdown list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Sales transactions during this period */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center justify-between">
                  <span>💰 Giao dịch Bán hàng (Kỳ lọc)</span>
                  <button onClick={() => setActiveTab('sales')} className="text-xs text-indigo-600 hover:underline">Chi tiết bán hàng →</button>
                </h3>
                
                <div className="space-y-3">
                  {filteredSales.length === 0 ? (
                    <p className="text-sm text-slate-400 py-6 text-center">Không có giao dịch bán hàng nào phát sinh trong kỳ lọc.</p>
                  ) : (
                    filteredSales.slice(0, 5).map(s => (
                      <div key={s.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="min-w-0 flex-1 pr-3">
                          <p className="font-semibold text-xs text-slate-900 truncate">{s.product}</p>
                          <p className="text-[11px] text-slate-500">KH: {s.customerName} | {s.date}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-xs text-slate-900">{formatCurrency(s.amount)}</p>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${s.status === 'Đã thanh toán' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {s.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Task progress overview within period */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center justify-between">
                  <span>📋 Công việc của Kỳ lọc</span>
                  <button onClick={() => setActiveTab('tasks')} className="text-xs text-indigo-600 hover:underline">Bảng công việc →</button>
                </h3>
                
                <div className="space-y-3">
                  {filteredTasks.length === 0 ? (
                    <p className="text-sm text-slate-400 py-6 text-center">Không có công việc nào trong khoảng ngày đã chọn.</p>
                  ) : (
                    filteredTasks.slice(0, 5).map(t => (
                      <div key={t.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="min-w-0 flex-1 pr-2">
                          <p className="font-semibold text-xs text-slate-900 truncate">{t.title}</p>
                          <p className="text-[11px] text-slate-500">Hạn: {t.deadline}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${t.priority === 'Cao' ? 'bg-rose-100 text-rose-800' : t.priority === 'Trung bình' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-800'}`}>
                            {t.priority}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${t.status === 'Đã xong' ? 'bg-emerald-100 text-emerald-800' : t.status === 'Đang làm' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-500'}`}>
                            {t.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: OKRs */}
        {activeTab === 'okrs' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Mục tiêu & Kết quả then chốt (OKRs)</h2>
                <p className="text-sm text-slate-500">Đặt mục tiêu đột phá và bám sát các hành động thực thi bằng số liệu rõ ràng.</p>
              </div>
              <button 
                onClick={() => { setEditingItem(null); setShowModal('okr'); }}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors self-start sm:self-auto"
              >
                <span>➕ Tạo OKR Mục Tiêu Mới</span>
              </button>
            </div>

            <div className="space-y-6">
              {okrs.map((okr) => {
                const totalProgress = okr.keyResults.length > 0 
                  ? Math.round(okr.keyResults.reduce((sum, kr) => sum + Math.min(100, Math.round((kr.current / kr.target) * 100)), 0) / okr.keyResults.length)
                  : 0;

                return (
                  <div key={okr.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-slate-900 text-white p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded font-semibold uppercase tracking-wider">Mục tiêu quý</span>
                          <span className="text-xs text-slate-400">({okr.startDate} đến {okr.endDate})</span>
                        </div>
                        <h3 className="text-lg font-bold">{okr.objective}</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="block text-xs text-slate-400">Tiến độ chung</span>
                          <span className="text-2xl font-black text-emerald-400">{totalProgress}%</span>
                        </div>
                        <div className="flex gap-1.5">
                          <button 
                            onClick={() => { setEditingItem(okr); setShowModal('okr'); }}
                            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                            title="Sửa OKR"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => deleteItem('okr', okr.id)}
                            className="p-2 bg-slate-800 hover:bg-rose-950 rounded-lg text-rose-400 hover:text-rose-300 transition-colors"
                            title="Xóa OKR"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Kết quả then chốt (Key Results)</h4>
                      
                      <div className="space-y-4">
                        {okr.keyResults.map((kr) => {
                          const krProgress = Math.min(100, Math.round((kr.current / kr.target) * 100));
                          
                          return (
                            <div key={kr.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <div className="space-y-1">
                                  <span className="font-semibold text-slate-800 text-sm">{kr.text}</span>
                                  {kr.autoLink !== 'manual' && (
                                    <span className="inline-flex items-center text-[10px] bg-sky-50 text-sky-700 border border-sky-100 px-2 py-0.5 rounded-full font-semibold">
                                      🔗 Đồng bộ dữ liệu: {kr.autoLink === 'sales' ? 'Doanh thu bán hàng' : kr.autoLink === 'customers-vip' ? 'Khách hàng VIP' : kr.autoLink === 'cskh-rating' ? 'Đánh giá CSKH' : 'Tasks ưu tiên cao'}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center justify-between md:justify-end gap-4">
                                  <div className="text-right">
                                    <span className="text-xs text-slate-500">Đạt được: </span>
                                    <span className="font-bold text-slate-900 text-sm">
                                      {kr.current.toLocaleString()} / {kr.target.toLocaleString()}{kr.unit}
                                    </span>
                                  </div>
                                  <div className="w-16 text-right shrink-0">
                                    <span className={`font-black text-sm ${krProgress >= 80 ? 'text-emerald-600' : krProgress >= 50 ? 'text-indigo-600' : 'text-slate-500'}`}>{krProgress}%</span>
                                  </div>
                                </div>
                              </div>

                              {/* Progress Track bar */}
                              <div className="w-full bg-slate-200 h-2 rounded-full relative overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${krProgress >= 85 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : krProgress >= 50 ? 'bg-gradient-to-r from-indigo-400 to-indigo-600' : 'bg-gradient-to-r from-amber-400 to-amber-500'}`} 
                                  style={{ width: `${krProgress}%` }}
                                ></div>
                              </div>

                              {/* Manual slider updater if autoLink is manual */}
                              {kr.autoLink === 'manual' && (
                                <div className="flex items-center gap-4 mt-2 bg-white p-2 border border-slate-100 rounded-lg">
                                  <label className="text-[11px] font-medium text-slate-500 shrink-0">Kéo để tăng tiến độ:</label>
                                  <input 
                                    type="range" 
                                    min="0" 
                                    max={kr.target} 
                                    value={kr.current} 
                                    onChange={(e) => {
                                      const nextVal = parseFloat(e.target.value) || 0;
                                      setOkrs(okrs.map(o => {
                                        if (o.id === okr.id) {
                                          return {
                                            ...o,
                                            keyResults: o.keyResults.map(k => k.id === kr.id ? { ...k, current: nextVal } : k)
                                          };
                                        }
                                        return o;
                                      }));
                                    }}
                                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                  <input 
                                    type="number" 
                                    value={kr.current}
                                    onChange={(e) => {
                                      const val = parseFloat(e.target.value) || 0;
                                      setOkrs(okrs.map(o => {
                                        if (o.id === okr.id) {
                                          return {
                                            ...o,
                                            keyResults: o.keyResults.map(k => k.id === kr.id ? { ...k, current: Math.min(k.target, val) } : k)
                                          };
                                        }
                                        return o;
                                      }));
                                    }}
                                    className="w-16 text-center border text-xs rounded font-bold"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* TAB 3: SALES */}
        {activeTab === 'sales' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Doanh số & Giao dịch bán hàng</h2>
                <p className="text-sm text-slate-500">Nơi cập nhật doanh thu thực tế. Tự động đồng bộ với tiến độ OKRs tài chính liên kết.</p>
              </div>
              <button 
                onClick={() => { setEditingItem(null); setShowModal('sale'); }}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors self-start sm:self-auto"
              >
                <span>➕ Ghi Nhận Giao Dịch Mới</span>
              </button>
            </div>

            {/* Quick Summary in Sales Tab */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <span className="block text-xs text-emerald-800 font-medium uppercase">Doanh thu đạt (Đã thanh toán)</span>
                <span className="text-xl font-bold text-emerald-950 mt-1 block">
                  {formatCurrency(sales.filter(s => s.status === 'Đã thanh toán').reduce((sum, s) => sum + s.amount, 0))}
                </span>
              </div>
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                <span className="block text-xs text-amber-800 font-medium uppercase">Chờ thanh toán</span>
                <span className="text-xl font-bold text-amber-950 mt-1 block">
                  {formatCurrency(sales.filter(s => s.status === 'Chờ thanh toán').reduce((sum, s) => sum + s.amount, 0))}
                </span>
              </div>
              <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
                <span className="block text-xs text-slate-700 font-medium uppercase">Tổng cộng tích lũy</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">
                  {formatCurrency(sales.reduce((sum, s) => sum + s.amount, 0))}
                </span>
              </div>
            </div>

            {/* Sales Table list */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Danh sách tất cả hóa đơn / giao dịch</span>
                <div className="relative w-full sm:w-auto">
                  <input 
                    type="text" 
                    placeholder="Tìm tên khách hàng, sản phẩm..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-3 pr-8 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 w-full sm:w-60"
                  />
                  {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-2 text-slate-400 text-xs">✕</button>}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-semibold border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Giao dịch / Dự án</th>
                      <th className="px-6 py-4">Khách hàng</th>
                      <th className="px-6 py-4">Ngày giao dịch</th>
                      <th className="px-6 py-4 text-right">Giá trị</th>
                      <th className="px-6 py-4 text-center">Trạng thái</th>
                      <th className="px-6 py-4 text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sales
                      .filter(s => s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || s.product.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((sale) => (
                        <tr key={sale.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 font-semibold text-slate-950">{sale.product}</td>
                          <td className="px-6 py-4">{sale.customerName}</td>
                          <td className="px-6 py-4">{sale.date}</td>
                          <td className="px-6 py-4 text-right font-bold text-slate-900">{formatCurrency(sale.amount)}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${sale.status === 'Đã thanh toán' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                              {sale.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button 
                                onClick={() => { setEditingItem(sale); setShowModal('sale'); }}
                                className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-indigo-600 transition-colors"
                                title="Sửa"
                              >
                                ✏️
                              </button>
                              <button 
                                onClick={() => deleteItem('sale', sale.id)}
                                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-rose-600 transition-colors"
                                title="Xóa"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: CUSTOMERS */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Quản lý Khách hàng (CRM)</h2>
                <p className="text-sm text-slate-500">Phân loại tệp khách hàng, ghi chú thông tin để phục vụ chăm sóc và duy trì mục tiêu OKRs VIP.</p>
              </div>
              <button 
                onClick={() => { setEditingItem(null); setShowModal('customer'); }}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors self-start sm:self-auto"
              >
                <span>➕ Thêm Khách Hàng Mới</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tất cả thông tin liên hệ</span>
                <div className="relative w-full sm:w-auto">
                  <input 
                    type="text" 
                    placeholder="Tìm tên, sđt, email, ghi chú..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-3 pr-8 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 w-full sm:w-60"
                  />
                  {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-2 text-slate-400 text-xs">✕</button>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {customers
                  .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase())) || c.phone.includes(searchTerm) || (c.notes && c.notes.toLowerCase().includes(searchTerm.toLowerCase())))
                  .map(c => (
                    <div key={c.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${c.segment === 'VIP' ? 'bg-red-100 text-red-800 border border-red-200' : c.segment === 'Mới' ? 'bg-teal-100 text-teal-800' : 'bg-slate-200 text-slate-700'}`}>
                            {c.segment}
                          </span>
                          <div className="flex gap-1.5">
                            <button 
                              onClick={() => { setEditingItem(c); setShowModal('customer'); }}
                              className="text-xs text-indigo-600 hover:underline font-semibold"
                            >
                              Sửa
                            </button>
                            <span className="text-slate-300">|</span>
                            <button 
                              onClick={() => deleteItem('customer', c.id)}
                              className="text-xs text-rose-600 hover:underline font-semibold"
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base">{c.name}</h3>
                        
                        <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                          <p className="flex items-center gap-2">
                            <span>📞 SĐT:</span>
                            <span className="font-medium text-slate-800">{c.phone}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <span>📧 Email:</span>
                            <span className="font-medium text-slate-800">{c.email || 'Chưa cung cấp'}</span>
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/50">
                        <span className="block text-[10px] text-slate-400 uppercase font-semibold">Ghi chú đối tác</span>
                        <p className="text-xs text-slate-600 italic mt-1">{c.notes || 'Không có ghi chú bổ sung.'}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: CSKH */}
        {activeTab === 'cskh' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Chăm sóc khách hàng (CSKH)</h2>
                <p className="text-sm text-slate-500">Nhật ký theo dõi các tương tác. Đảm bảo hỗ trợ khách hàng nhanh chóng và đạt độ hài lòng tối ưu.</p>
              </div>
              <button 
                onClick={() => { setEditingItem(null); setShowModal('cskh'); }}
                className="px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-semibold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors self-start sm:self-auto"
              >
                <span>➕ Thêm Nhật Ký Chăm Sóc</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tất cả lịch sử chăm sóc khách hàng</span>
                <div className="relative w-full sm:w-auto">
                  <input 
                    type="text" 
                    placeholder="Tìm theo tên khách hàng..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-3 pr-8 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 w-full sm:w-60"
                  />
                  {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-2 text-slate-400 text-xs">✕</button>}
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {cskh
                  .filter(c => c.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(log => (
                    <div key={log.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">
                            {log.channel === 'Gặp trực tiếp' ? '🧑‍🤝‍🧑' : log.channel === 'Gọi điện thoại' ? '📞' : '📧'}
                          </span>
                          <div>
                            <h3 className="font-bold text-slate-900 text-base">{log.customerName}</h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <span className="text-xs text-slate-500">{log.date}</span>
                              <span className="text-slate-300">•</span>
                              <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] rounded-full font-bold">{log.channel}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-4">
                          <div className="bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100 flex items-center gap-1.5">
                            <span className="text-xs text-slate-500 font-medium">Hài lòng:</span>
                            <span className="text-xs text-yellow-500 font-bold">{'★'.repeat(log.rating)}{'☆'.repeat(5 - log.rating)}</span>
                          </div>

                          <div className="flex gap-1.5">
                            <button 
                              onClick={() => { setEditingItem(log); setShowModal('cskh'); }}
                              className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600 transition-colors"
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => deleteItem('cskh', log.id)}
                              className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-rose-600 transition-colors"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">{log.content}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 6: TASKS */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Task Công việc & Hành động</h2>
                <p className="text-sm text-slate-500">Chi tiết hóa hành động, kết nối trực tiếp đến các Mục tiêu lớn (OKR) của bạn.</p>
              </div>
              <button 
                onClick={() => { setEditingItem(null); setShowModal('task'); }}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors self-start sm:self-auto"
              >
                <span>➕ Tạo Task Công Việc Mới</span>
              </button>
            </div>

            {/* Kanban Columns (To Do, In Progress, Done) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Column 1: Chưa làm */}
              <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200/50 min-h-[400px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                    <span>CHƯA LÀM</span>
                  </h3>
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full text-xs font-bold">
                    {tasks.filter(t => t.status === 'Chưa làm').length}
                  </span>
                </div>

                <div className="space-y-3">
                  {tasks.filter(t => t.status === 'Chưa làm').map(t => (
                    <TaskCard key={t.id} task={t} onEdit={() => { setEditingItem(t); setShowModal('task'); }} onDelete={() => deleteItem('task', t.id)} okrs={okrs} />
                  ))}
                </div>
              </div>

              {/* Column 2: Đang làm */}
              <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 min-h-[400px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                    <span>ĐANG LÀM</span>
                  </h3>
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                    {tasks.filter(t => t.status === 'Đang làm').length}
                  </span>
                </div>

                <div className="space-y-3">
                  {tasks.filter(t => t.status === 'Đang làm').map(t => (
                    <TaskCard key={t.id} task={t} onEdit={() => { setEditingItem(t); setShowModal('task'); }} onDelete={() => deleteItem('task', t.id)} okrs={okrs} />
                  ))}
                </div>
              </div>

              {/* Column 3: Đã xong */}
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 min-h-[400px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span>ĐÃ XONG</span>
                  </h3>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                    {tasks.filter(t => t.status === 'Đã xong').length}
                  </span>
                </div>

                <div className="space-y-3">
                  {tasks.filter(t => t.status === 'Đã xong').map(t => (
                    <TaskCard key={t.id} task={t} onEdit={() => { setEditingItem(t); setShowModal('task'); }} onDelete={() => deleteItem('task', t.id)} okrs={okrs} />
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400">
          <p>© 2026 OKR & CRM Personal Workspace. Được tối ưu hóa cho môi trường lưu trữ GitHub Pages.</p>
        </div>
      </footer>

      {/* MODAL 1: OKR Modal Form */}
      {showModal === 'okr' && (
        <OkrModalForm 
          item={editingItem} 
          onClose={() => { setShowModal(null); setEditingItem(null); }} 
          onSave={handleSaveOkr}
        />
      )}

      {/* MODAL 2: Sale Transaction Modal Form */}
      {showModal === 'sale' && (
        <SaleModalForm 
          item={editingItem} 
          onClose={() => { setShowModal(null); setEditingItem(null); }} 
          onSave={handleSaveSale}
          customers={customers}
        />
      )}

      {/* MODAL 3: Customer CRM Modal Form */}
      {showModal === 'customer' && (
        <CustomerModalForm 
          item={editingItem} 
          onClose={() => { setShowModal(null); setEditingItem(null); }} 
          onSave={handleSaveCustomer}
        />
      )}

      {/* MODAL 4: CSKH Log Modal Form */}
      {showModal === 'cskh' && (
        <CskhModalForm 
          item={editingItem} 
          onClose={() => { setShowModal(null); setEditingItem(null); }} 
          onSave={handleSaveCskh}
          customers={customers}
        />
      )}

      {/* MODAL 5: Task Work Modal Form */}
      {showModal === 'task' && (
        <TaskModalForm 
          item={editingItem} 
          onClose={() => { setShowModal(null); setEditingItem(null); }} 
          onSave={handleSaveTask}
          okrs={okrs}
        />
      )}

    </div>
  );
}

function TaskCard({ task, onEdit, onDelete, okrs }) {
  const linkedOkr = okrs.find(o => o.id === task.linkedOkrId);

  return (
    <div className="p-4 bg-white rounded-xl border border-slate-200 hover:shadow-sm transition-shadow space-y-3">
      <div className="flex justify-between items-start gap-2">
        <h4 className="font-semibold text-slate-900 text-sm leading-snug">{task.title}</h4>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${task.priority === 'Cao' ? 'bg-rose-100 text-rose-800' : task.priority === 'Trung bình' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-800'}`}>
          {task.priority}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <span>🕒 Hạn:</span>
        <span className="font-semibold text-slate-800">{task.deadline}</span>
      </div>

      {linkedOkr && (
        <div className="bg-indigo-50/50 p-2 rounded-lg border border-indigo-100/50 text-[10px]">
          <span className="block text-slate-400 font-semibold uppercase">Đóng góp OKR:</span>
          <span className="text-slate-700 line-clamp-1 font-medium">{linkedOkr.objective}</span>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
        <button onClick={onEdit} className="text-xs text-indigo-600 hover:underline">Sửa</button>
        <span className="text-slate-300 text-xs">|</span>
        <button onClick={onDelete} className="text-xs text-rose-600 hover:underline">Xóa</button>
      </div>
    </div>
  );
}

// 1. OKR Modal Component
function OkrModalForm({ item, onClose, onSave }) {
  const [keyResults, setKeyResults] = useState(() => {
    return item ? item.keyResults : [{ text: '', target: 10, unit: '', autoLink: 'manual' }];
  });

  const addKrField = () => {
    setKeyResults([...keyResults, { text: '', target: 10, unit: '', autoLink: 'manual' }]);
  };

  const removeKrField = (index) => {
    setKeyResults(keyResults.filter((_, idx) => idx !== index));
  };

  const updateKrField = (idx, field, val) => {
    setKeyResults(keyResults.map((kr, i) => i === idx ? { ...kr, [field]: val } : kr));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center pb-4 border-b">
          <h3 className="text-lg font-bold text-slate-900">{item ? 'Sửa OKR Mục tiêu' : 'Thêm OKR Mục tiêu mới'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
        </div>

        <form onSubmit={onSave} className="space-y-4 mt-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Mục tiêu tổng quan (Objective)</label>
            <input 
              required 
              type="text" 
              name="objective"
              defaultValue={item?.objective || ''}
              placeholder="VD: Đạt 150 triệu doanh thu & Nâng cao sự hài lòng CSKH"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Ngày bắt đầu</label>
              <input 
                required 
                type="date" 
                name="startDate"
                defaultValue={item?.startDate || '2026-04-01'}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Ngày kết thúc</label>
              <input 
                required 
                type="date" 
                name="endDate"
                defaultValue={item?.endDate || '2026-06-30'}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="space-y-3 pt-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-500 uppercase">Kết quả then chốt (Key Results)</label>
              <button 
                type="button" 
                onClick={addKrField} 
                className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg font-bold"
              >
                + Thêm Key Result
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {keyResults.map((kr, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2 relative">
                  {keyResults.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeKrField(idx)}
                      className="absolute top-1 right-2 text-rose-500 text-xs hover:underline font-bold"
                    >
                      Xóa
                    </button>
                  )}
                  
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Mô tả KR #{idx + 1}</span>
                    <input 
                      required 
                      type="text" 
                      name="krText"
                      value={kr.text}
                      onChange={(e) => updateKrField(idx, 'text', e.target.value)}
                      placeholder="VD: Ký mới 5 khách hàng VIP"
                      className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[9px] text-slate-400 font-semibold block">Chỉ tiêu (Mục tiêu)</span>
                      <input 
                        required 
                        type="number" 
                        name="krTarget"
                        value={kr.target}
                        onChange={(e) => updateKrField(idx, 'target', parseFloat(e.target.value) || 0)}
                        className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-semibold block">Đơn vị</span>
                      <input 
                        required 
                        type="text" 
                        name="krUnit"
                        value={kr.unit}
                        onChange={(e) => updateKrField(idx, 'unit', e.target.value)}
                        placeholder="đ, khách, bài..."
                        className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-semibold block">Kết nối nguồn</span>
                      <select
                        name="krAutoLink"
                        value={kr.autoLink}
                        onChange={(e) => updateKrField(idx, 'autoLink', e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs bg-white"
                      >
                        <option value="manual">Tự cập nhật</option>
                        <option value="sales">Doanh thu bán hàng</option>
                        <option value="customers-vip">Số khách hàng VIP</option>
                        <option value="cskh-rating">Đánh giá CSKH</option>
                        <option value="tasks-high">Số Task Cao hoàn thành</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-semibold"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-xs"
            >
              Lưu OKR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 2. Sales Form
function SaleModalForm({ item, onClose, onSave, customers }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
        <div className="flex justify-between items-center pb-4 border-b">
          <h3 className="text-lg font-bold text-slate-900">{item ? 'Sửa giao dịch' : 'Ghi nhận Doanh số Bán hàng'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
        </div>

        <form onSubmit={onSave} className="space-y-4 mt-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Sản phẩm / Tên dự án</label>
            <input 
              required 
              type="text" 
              name="product"
              defaultValue={item?.product || ''}
              placeholder="VD: Phát triển Website Thương mại điện tử"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Khách hàng</label>
            <select 
              name="customerName" 
              defaultValue={item?.customerName || ''}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white"
            >
              <option value="">Chọn khách hàng...</option>
              {customers.map(c => (
                <option key={c.id} value={c.name}>{c.name} ({c.segment})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Giá trị (VND)</label>
              <input 
                required 
                type="number" 
                name="amount"
                defaultValue={item?.amount || ''}
                placeholder="VD: 15000000"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Ngày ghi nhận</label>
              <input 
                required 
                type="date" 
                name="date"
                defaultValue={item?.date || '2026-05-29'}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Trạng thái thanh toán</label>
            <div className="flex gap-4 pt-1">
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input 
                  type="radio" 
                  name="status" 
                  value="Đã thanh toán" 
                  defaultChecked={item?.status !== 'Chờ thanh toán'}
                  className="accent-indigo-600"
                />
                <span>Đã thanh toán</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input 
                  type="radio" 
                  name="status" 
                  value="Chờ thanh toán" 
                  defaultChecked={item?.status === 'Chờ thanh toán'}
                  className="accent-indigo-600"
                />
                <span>Chờ thanh toán</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-semibold"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold"
            >
              Lưu giao dịch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 3. Customer CRM Form
function CustomerModalForm({ item, onClose, onSave }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
        <div className="flex justify-between items-center pb-4 border-b">
          <h3 className="text-lg font-bold text-slate-900">{item ? 'Sửa thông tin khách hàng' : 'Thêm Khách hàng mới'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
        </div>

        <form onSubmit={onSave} className="space-y-4 mt-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Họ và Tên khách hàng</label>
            <input 
              required 
              type="text" 
              name="name"
              defaultValue={item?.name || ''}
              placeholder="VD: Nguyễn Văn A"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Số điện thoại</label>
              <input 
                required 
                type="text" 
                name="phone"
                defaultValue={item?.phone || ''}
                placeholder="VD: 0901234567"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
              <input 
                type="email" 
                name="email"
                defaultValue={item?.email || ''}
                placeholder="nva@company.com"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Phân khúc khách hàng</label>
            <select 
              name="segment" 
              defaultValue={item?.segment || 'Mới'}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white"
            >
              <option value="Mới">Khách hàng Mới</option>
              <option value="Thường">Khách hàng Thường</option>
              <option value="VIP">Khách hàng VIP (Trọng tâm)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Ghi chú đặc điểm / sở thích</label>
            <textarea 
              name="notes"
              defaultValue={item?.notes || ''}
              rows="3"
              placeholder="Nhu cầu thiết kế, lịch sử tương tác, thói quen thanh toán..."
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-semibold"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold"
            >
              Lưu Khách hàng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 4. CSKH Form
function CskhModalForm({ item, onClose, onSave, customers }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
        <div className="flex justify-between items-center pb-4 border-b">
          <h3 className="text-lg font-bold text-slate-900">{item ? 'Sửa lịch sử chăm sóc' : 'Ghi nhận Lịch sử CSKH'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
        </div>

        <form onSubmit={onSave} className="space-y-4 mt-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Khách hàng liên hệ</label>
            <select 
              name="customerName" 
              defaultValue={item?.customerName || ''}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white"
            >
              <option value="">Chọn khách hàng...</option>
              {customers.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Ngày tương tác</label>
              <input 
                required 
                type="date" 
                name="date"
                defaultValue={item?.date || '2026-05-29'}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Kênh Chăm Sóc</label>
              <select 
                name="channel" 
                defaultValue={item?.channel || 'Gọi điện thoại'}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white"
              >
                <option value="Gọi điện thoại">Gọi điện thoại</option>
                <option value="Email">Email</option>
                <option value="Gặp trực tiếp">Gặp trực tiếp</option>
                <option value="Zalo/Chat">Zalo/Tin nhắn</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Nội dung cuộc trò chuyện</label>
            <textarea 
              required
              name="content"
              defaultValue={item?.content || ''}
              rows="4"
              placeholder="VD: Gọi điện hỗ trợ lỗi hiển thị banner. Khách hàng cảm thấy rất vui vì thời gian xử lý nhanh dưới 15 phút."
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
            ></textarea>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Mức độ hài lòng của khách hàng (1-5 sao)</label>
            <select 
              name="rating" 
              defaultValue={item?.rating || 5}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white font-bold text-yellow-600"
            >
              <option value="5">⭐⭐⭐⭐⭐ (Rất tốt)</option>
              <option value="4">⭐⭐⭐⭐ (Tốt)</option>
              <option value="3">⭐⭐⭐ (Bình thường)</option>
              <option value="2">⭐⭐ (Kém)</option>
              <option value="1">⭐ (Rất kém)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-semibold"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-semibold rounded-xl text-sm"
            >
              Lưu nhật ký
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 5. Task Form
function TaskModalForm({ item, onClose, onSave, okrs }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
        <div className="flex justify-between items-center pb-4 border-b">
          <h3 className="text-lg font-bold text-slate-900">{item ? 'Sửa công việc' : 'Thêm Công việc mới'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
        </div>

        <form onSubmit={onSave} className="space-y-4 mt-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Tiêu đề công việc</label>
            <input 
              required 
              type="text" 
              name="title"
              defaultValue={item?.title || ''}
              placeholder="VD: Kiểm thử tương thích trên Safari"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Hạn hoàn thành</label>
              <input 
                required 
                type="date" 
                name="deadline"
                defaultValue={item?.deadline || '2026-05-29'}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Độ ưu tiên</label>
              <select 
                name="priority" 
                defaultValue={item?.priority || 'Trung bình'}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white"
              >
                <option value="Thấp">Thấp</option>
                <option value="Trung bình">Trung bình</option>
                <option value="Cao">Cao 🔥</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Trạng thái công việc</label>
            <select 
              name="status" 
              defaultValue={item?.status || 'Chưa làm'}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white"
            >
              <option value="Chưa làm">Chưa làm</option>
              <option value="Đang làm">Đang làm</option>
              <option value="Đã xong">Đã xong</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Liên kết tới OKR Mục tiêu</label>
            <select 
              name="linkedOkrId" 
              defaultValue={item?.linkedOkrId || ''}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white"
            >
              <option value="">Không liên kết (General Task)</option>
              {okrs.map(o => (
                <option key={o.id} value={o.id}>{o.objective}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-semibold"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold"
            >
              Lưu công việc
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}