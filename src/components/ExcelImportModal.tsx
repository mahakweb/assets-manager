import React, { useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  FileCheck,
  RefreshCw
} from 'lucide-react';
import { FullDatabase } from '../types';
import {
  importWorkbookFromExcel,
  exportFullWorkbookToExcel,
  ImportSummary
} from '../services/excelService';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDb: FullDatabase;
  onImportSuccess: (newDb: FullDatabase) => void;
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  isOpen,
  onClose,
  currentDb,
  onImportSuccess
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [parsedDb, setParsedDb] = useState<FullDatabase | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setErrorMsg('لطفاً یک فایل معتبر اکسل با پسوند xlsx. یا xls. انتخاب نمایید.');
      return;
    }

    setErrorMsg(null);
    setSelectedFile(file);
    setIsProcessing(true);

    try {
      const { updatedDb, summary } = await importWorkbookFromExcel(file, currentDb);
      setParsedDb(updatedDb);
      setImportSummary(summary);
    } catch (err) {
      console.error(err);
      setErrorMsg('خطا در خواندن فایل اکسل. لطفاً از سالم بودن فایل اکسل اطمینان حاصل فرمایید.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmImport = () => {
    if (parsedDb) {
      onImportSuccess(parsedDb);
      onClose();
    }
  };

  const handleDownloadTemplate = () => {
    exportFullWorkbookToExcel(currentDb, 'قالب_خام_اطلاعات_پایه_سازمان.xlsx');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                ایمپورت و بارگذاری فایل اکسل سازمان
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                پشتیبانی از شیت‌های ۵ گانه «اطلاعات پایه سازمان.xlsx»
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Instructions banner */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <div className="font-semibold text-slate-800 dark:text-slate-100">راهنمای تطابق ستون‌ها:</div>
            <p>
              سیستم به صورت خودکار شیت‌های فایل اکسل را بر اساس نام یا کلمات کلیدی (لیست‌های پایه، مشخصات سازمان، لیست کارکنان، تجهیزات یا دارایی‌ها، سامانه‌ها) تشخیص داده و ستون‌ها را نقشه‌برداری می‌کند.
            </p>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">نیاز به الگوی اولیه دارید؟</span>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>دانلود نمونه فایل اکسل خام</span>
              </button>
            </div>
          </div>

          {/* Upload Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
                : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-white dark:bg-slate-900'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx,.xls"
              className="hidden"
            />
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              <div className="text-xs">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">برای انتخاب فایل اکسل کلیک کنید</span>{' '}
                <span className="text-slate-500 dark:text-slate-400">یا فایل را به اینجا بکشید</span>
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">فرمت‌های مجاز: XLSX و XLS</span>
            </div>
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="flex items-center justify-center gap-2 py-4 text-xs text-slate-600 dark:text-slate-400">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
              <span>در حال آنالیز و استخراج شیت‌های اکسل...</span>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-lg text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Import Summary */}
          {importSummary && (
            <div className="p-3.5 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>فایل «{selectedFile?.name}» با موفقیت تحلیل شد</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-emerald-900 dark:text-emerald-200 pt-1 border-t border-emerald-200/60 dark:border-emerald-800">
                <div>
                  شیت‌های یافت‌شده:{' '}
                  <span className="font-medium">{importSummary.sheetsFound.join('، ')}</span>
                </div>
                <div>
                  تجهیزات استخراج شده:{' '}
                  <strong className="tabular-nums font-bold">{importSummary.assetsCount}</strong> مورد
                </div>
                <div>
                  سامانه‌های استخراج شده:{' '}
                  <strong className="tabular-nums font-bold">{importSummary.systemsCount}</strong> مورد
                </div>
                <div>
                  کارکنان استخراج شده:{' '}
                  <strong className="tabular-nums font-bold">{importSummary.employeesCount}</strong> نفر
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md"
          >
            انصراف
          </button>
          <button
            type="button"
            disabled={!parsedDb}
            onClick={handleConfirmImport}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md shadow-xs transition-colors"
          >
            <FileCheck className="w-4 h-4" />
            <span>تایید و ذخیره داده‌ها در سیستم</span>
          </button>
        </div>
      </div>
    </div>
  );
};
