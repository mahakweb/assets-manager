import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  Download,
  Edit2,
  Trash2,
  X,
  Phone,
  Mail,
  Building,
  Briefcase
} from 'lucide-react';
import { Employee, ListsData } from '../types';
import { exportSingleTableToExcel } from '../services/excelService';

interface EmployeesViewProps {
  employees: Employee[];
  lists: ListsData;
  onSaveEmployee: (employee: Employee) => void;
  onDeleteEmployee: (id: number) => void;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  employees,
  lists,
  onSaveEmployee,
  onDeleteEmployee
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [unitFilter, setUnitFilter] = useState('');
  const [jobFilter, setJobFilter] = useState('');
  const [workplaceFilter, setWorkplaceFilter] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Partial<Employee> | null>(null);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch =
        !searchTerm ||
        emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.nationalCode.includes(searchTerm) ||
        emp.mobile.includes(searchTerm) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.unit.toLowerCase().includes(searchTerm.toLowerCase());

      const matchUnit = !unitFilter || emp.unit === unitFilter;
      const matchJob = !jobFilter || emp.jobTitle === jobFilter;
      const matchWorkplace = !workplaceFilter || emp.workplace === workplaceFilter;

      return matchSearch && matchUnit && matchJob && matchWorkplace;
    });
  }, [employees, searchTerm, unitFilter, jobFilter, workplaceFilter]);

  const handleOpenAdd = () => {
    const nextId = employees.length > 0 ? Math.max(...employees.map((e) => e.id)) + 1 : 1;
    setEditingEmployee({
      id: nextId,
      fullName: '',
      jobTitle: lists.jobTitles[0] || 'کارشناس فناوری اطلاعات',
      unit: lists.units[0] || 'فناوری اطلاعات',
      workplace: lists.workplaces[0] || 'اداره کل',
      nationalCode: '',
      mobile: '',
      landline: '',
      email: '',
      startDate: '',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingEmployee({ ...emp });
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee || !editingEmployee.fullName) return;

    onSaveEmployee(editingEmployee as Employee);
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleExportExcel = () => {
    const rows = filteredEmployees.map((emp) => ({
      'ردیف': emp.id,
      'نام و نام خانوادگی': emp.fullName,
      'سمت': emp.jobTitle,
      'واحد': emp.unit,
      'محل کار': emp.workplace,
      'کدملی': emp.nationalCode,
      'موبایل': emp.mobile,
      'تلفن ثابت': emp.landline,
      'ایمیل': emp.email,
      'تاریخ شروع به کار در این واحد و سمت': emp.startDate,
      'توضیحات': emp.description
    }));
    exportSingleTableToExcel('لیست کارکنان', rows, 'لیست_کارکنان_سازمان.xlsx');
  };

  return (
    <div className="space-y-4">
      {/* Top Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="جستجو در نام و نام خانوادگی، کدملی، موبایل، سمت، ایمیل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-3 pr-9 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>خروجی اکسل</span>
            </button>

            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن کارمند جدید</span>
            </button>
          </div>
        </div>

        {/* Filter Selectors */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
          <span className="text-slate-500">فیلتر:</span>

          <select
            value={unitFilter}
            onChange={(e) => setUnitFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-md bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">همه واحدها</option>
            {lists.units.map((u) => (
              <option key={u} value={u}>
                واحد {u}
              </option>
            ))}
          </select>

          <select
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-md bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">همه سمت‌ها</option>
            {lists.jobTitles.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </select>

          <select
            value={workplaceFilter}
            onChange={(e) => setWorkplaceFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-md bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">همه محل‌های کار</option>
            {lists.workplaces.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>

          {(unitFilter || jobFilter || workplaceFilter || searchTerm) && (
            <button
              onClick={() => {
                setUnitFilter('');
                setJobFilter('');
                setWorkplaceFilter('');
                setSearchTerm('');
              }}
              className="text-xs text-rose-600 hover:text-rose-800 underline underline-offset-2 ml-auto"
            >
              پاک‌کردن فیلترها
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="p-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            نمایش <strong className="font-mono tabular-nums text-slate-900">{filteredEmployees.length}</strong> نفر از{' '}
            <span className="font-mono tabular-nums">{employees.length}</span> کارمند ثبت شده
          </span>
          <span className="text-slate-400">جدول ۳: لیست کارکنان</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="py-2.5 px-3 font-semibold w-12 text-center">ردیف</th>
                <th className="py-2.5 px-3 font-semibold">نام و نام خانوادگی</th>
                <th className="py-2.5 px-3 font-semibold">سمت</th>
                <th className="py-2.5 px-3 font-semibold">واحد سازمانی</th>
                <th className="py-2.5 px-3 font-semibold">محل خدمت</th>
                <th className="py-2.5 px-3 font-semibold">کد ملی</th>
                <th className="py-2.5 px-3 font-semibold">تلفن و موبایل</th>
                <th className="py-2.5 px-3 font-semibold">ایمیل سازمانی</th>
                <th className="py-2.5 px-3 font-semibold">تاریخ شروع</th>
                <th className="py-2.5 px-3 font-semibold text-center w-20">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    کارمندی مطابق با شرایط جستجو یافت نشد
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2 px-3 text-center font-mono tabular-nums text-slate-400">
                      {emp.id}
                    </td>
                    <td className="py-2 px-3 font-medium text-slate-900">
                      {emp.fullName}
                    </td>
                    <td className="py-2 px-3 text-slate-700">
                      {emp.jobTitle}
                    </td>
                    <td className="py-2 px-3 text-slate-600">
                      {emp.unit}
                    </td>
                    <td className="py-2 px-3 text-slate-600">
                      {emp.workplace}
                    </td>
                    <td className="py-2 px-3 font-mono text-[11px] tabular-nums text-slate-600">
                      {emp.nationalCode || '---'}
                    </td>
                    <td className="py-2 px-3 font-mono text-[11px] dir-ltr text-slate-700">
                      <div>{emp.mobile || '---'}</div>
                      {emp.landline && <span className="text-slate-400 text-[10px] block">{emp.landline}</span>}
                    </td>
                    <td className="py-2 px-3 font-mono text-[11px] dir-ltr text-slate-600">
                      {emp.email || '---'}
                    </td>
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-600">
                      {emp.startDate || '---'}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(emp)}
                          title="ویرایش"
                          className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`آیا از حذف اطلاعات کارمند «${emp.fullName}» اطمینان دارید؟`)) {
                              onDeleteEmployee(emp.id);
                            }
                          }}
                          title="حذف"
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Employee Modal */}
      {isModalOpen && editingEmployee && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {editingEmployee.id ? `ویرایش کارمند (ردیف ${editingEmployee.id})` : 'ثبت کارمند جدید'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* نام و نام خانوادگی */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    نام و نام خانوادگی <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: علی رضایی"
                    value={editingEmployee.fullName || ''}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* سمت (FK) */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    سمت سازمانی <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={editingEmployee.jobTitle || ''}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, jobTitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {lists.jobTitles.map((j) => (
                      <option key={j} value={j}>
                        {j}
                      </option>
                    ))}
                  </select>
                </div>

                {/* واحد (FK) */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    واحد سازمانی <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={editingEmployee.unit || ''}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, unit: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {lists.units.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>

                {/* محل کار (FK) */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    محل کار <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={editingEmployee.workplace || ''}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, workplace: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {lists.workplaces.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>

                {/* کدملی */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">کد ملی</label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="مثال: 0071234567"
                    value={editingEmployee.nationalCode || ''}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, nationalCode: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* موبایل */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">شماره موبایل</label>
                  <input
                    type="text"
                    placeholder="09121234567"
                    value={editingEmployee.mobile || ''}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, mobile: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono dir-ltr border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* تلفن ثابت */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">تلفن ثابت داخلی</label>
                  <input
                    type="text"
                    placeholder="021-88123456"
                    value={editingEmployee.landline || ''}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, landline: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono dir-ltr border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* ایمیل */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">ایمیل سازمانی</label>
                  <input
                    type="email"
                    placeholder="rezaei@org.gov.ir"
                    value={editingEmployee.email || ''}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono dir-ltr border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* تاریخ شروع به کار */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    تاریخ شروع به کار در این واحد و سمت
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: 1400/01/15"
                    value={editingEmployee.startDate || ''}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* توضیحات */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">توضیحات و سوابق</label>
                <textarea
                  rows={2}
                  placeholder="سوابق، گواهینامه‌های تخصصی، شیفت کاری..."
                  value={editingEmployee.description || ''}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs"
                >
                  ذخیره اطلاعات کارمند
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
