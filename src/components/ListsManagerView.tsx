import React, { useState } from 'react';
import {
  ListTree,
  Plus,
  Trash2,
  Edit3,
  Download,
  RotateCcw,
  Check,
  X,
  Layers,
  ChevronRight
} from 'lucide-react';
import { ListsData } from '../types';
import { exportSingleTableToExcel } from '../services/excelService';

interface ListsManagerViewProps {
  lists: ListsData;
  onUpdateLists: (newLists: ListsData) => void;
}

interface ListCategoryMeta {
  key: keyof ListsData;
  title: string;
  description: string;
}

const CATEGORIES: ListCategoryMeta[] = [
  { key: 'activityFields', title: 'حوزه فعالیت', description: 'سیاسی، انرژی، درمان، مالی، آموزشی، صنعتی، سایر...' },
  { key: 'jobTitles', title: 'سمت سازمانی', description: 'ریاست سازمان، مدیریت حراست، مدیریت فناوری اطلاعات...' },
  { key: 'units', title: 'واحد سازمانی', description: 'ریاست، حراست، فناوری اطلاعات، مالی، بازرسی...' },
  { key: 'workplaces', title: 'محل کار', description: 'اداره کل، شهرستان ۱ تا ۱۱' },
  { key: 'assetTypes', title: 'نوع دارایی', description: 'سرور، فایروال، سوئیچ، روتر، اکسس‌پوینت، سان استوریج...' },
  { key: 'geoLocations', title: 'محل جغرافیایی استقرار تجهیزات', description: 'ستاد استانی، شهرستان های تابعه' },
  { key: 'placementLocations', title: 'محل استقرار فیزیکی', description: 'مرکز داده، اتاق سرور، واحد IT، حراست، اتاق مانیتورینگ...' },
  { key: 'counties', title: 'شهرستان', description: 'شهرستان ۱ تا شهرستان ۱۱' },
  { key: 'operatingSystems', title: 'سیستم عامل', description: 'Windows Server, Ubuntu, CentOS, RedHat, ESXi, Cisco IOS...' },
  { key: 'systemTypes', title: 'نوع سامانه', description: 'اتوماسیون اداری، پرتال، مالی، مانیتورینگ، دوربین، ایمیل...' },
  { key: 'yesNo', title: 'بله/خیر', description: 'بله، خیر' },
  { key: 'dbTypes', title: 'نوع دیتابیس', description: 'SQL Server, MySQL, PostgreSQL, Oracle, MongoDB, SQLite...' },
  { key: 'statuses', title: 'وضعیت', description: 'فعال، غیرفعال، نامشخص' },
  { key: 'statuses1', title: 'وضعیت ۱ (سلامت فنی)', description: 'خوب، متوسط، ضعیف، بحرانی، نامشخص' }
];

export const ListsManagerView: React.FC<ListsManagerViewProps> = ({ lists, onUpdateLists }) => {
  const [selectedKey, setSelectedKey] = useState<keyof ListsData>('assetTypes');
  const [newItemText, setNewItemText] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const currentCategory = CATEGORIES.find((c) => c.key === selectedKey) || CATEGORIES[0];
  const currentItems = lists[selectedKey] || [];

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newItemText.trim();
    if (!trimmed) return;

    if (currentItems.includes(trimmed)) {
      alert('این آیتم قبلاً در لیست وجود دارد.');
      return;
    }

    const updated = {
      ...lists,
      [selectedKey]: [...currentItems, trimmed]
    };
    onUpdateLists(updated);
    setNewItemText('');
  };

  const handleDeleteItem = (index: number) => {
    const updated = {
      ...lists,
      [selectedKey]: currentItems.filter((_, i) => i !== index)
    };
    onUpdateLists(updated);
  };

  const handleSaveEdit = (index: number) => {
    const trimmed = editingValue.trim();
    if (!trimmed) return;

    const copy = [...currentItems];
    copy[index] = trimmed;
    onUpdateLists({
      ...lists,
      [selectedKey]: copy
    });
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleExportLists = () => {
    const maxLen = Math.max(...CATEGORIES.map((c) => (lists[c.key] || []).length));
    const rows: Record<string, string>[] = [];
    for (let i = 0; i < maxLen; i++) {
      const row: Record<string, string> = {};
      CATEGORIES.forEach((cat) => {
        row[cat.title] = (lists[cat.key] || [])[i] || '';
      });
      rows.push(row);
    }
    exportSingleTableToExcel('لیست‌های پایه', rows, 'لیست_های_پایه_سازمان.xlsx');
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>مدیریت دادگان مرجع (Lookups)</span>
              <span aria-hidden="true">·</span>
              <span>شیت ۱ در اکسل «اطلاعات پایه سازمان.xlsx»</span>
            </div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white">
              مدیریت لیست‌های پایه و مقادیر کشویی (Dropdown Lists)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              هر تغییری در این بخش بلافاصله در تمام منوهای کشویی تجهیزات، سامانه‌ها و پرسنل همه سازمان‌ها اعمال می‌شود.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportLists}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              <span>خروجی اکسل لیست‌های پایه</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Category Nav on Right, Items Manager on Left/Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Categories Sidebar */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-1 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 px-3 py-1.5 block">
            دسته‌بندی‌های پایه ({CATEGORIES.length})
          </span>
          {CATEGORIES.map((cat) => {
            const count = (lists[cat.key] || []).length;
            const isSelected = selectedKey === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => {
                  setSelectedKey(cat.key);
                  setEditingIndex(null);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-right ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div>
                  <span className="block">{cat.title}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-normal truncate max-w-[210px]">
                    {cat.description}
                  </span>
                </div>
                <span className="tabular-nums text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Category Detail & Items */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">{currentCategory.title}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{currentCategory.description}</p>
            </div>
            <span className="text-xs tabular-nums text-slate-500 dark:text-slate-400 font-semibold">
              {currentItems.length} گزینه موجود
            </span>
          </div>

          {/* Add Item Form */}
          <form onSubmit={handleAddItem} className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`افزودن گزینه جدید به «${currentCategory.title}»...`}
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              className="flex-1 px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن به لیست</span>
            </button>
          </form>

          {/* Items List */}
          <div className="border border-slate-100 dark:border-slate-800 rounded-lg divide-y divide-slate-100 dark:divide-slate-800 max-h-[500px] overflow-y-auto">
            {currentItems.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                هیچ گزینه‌ای در این لیست تعریف نشده است.
              </div>
            ) : (
              currentItems.map((item, idx) => (
                <div
                  key={`${item}-${idx}`}
                  className="flex items-center justify-between px-3 py-2 text-xs hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {editingIndex === idx ? (
                    <div className="flex items-center gap-2 flex-1 pl-2">
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="flex-1 px-2.5 py-1 text-xs border border-indigo-400 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEdit(idx)}
                        className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded"
                        title="ذخیره"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                        title="انصراف"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="tabular-nums text-slate-300 dark:text-slate-600 text-[11px] w-5 text-center font-medium">
                          {idx + 1}
                        </span>
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{item}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingIndex(idx);
                            setEditingValue(item);
                          }}
                          className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded"
                          title="ویرایش نام"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`آیا از حذف گزینه «${item}» مطمئن هستید؟`)) {
                              handleDeleteItem(idx);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded"
                          title="حذف از لیست"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
