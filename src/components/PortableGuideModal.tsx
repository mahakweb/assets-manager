import React, { useState } from 'react';
import {
  Laptop,
  Terminal,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  Check,
  Copy,
  X,
  FileCode,
  HardDrive
} from 'lucide-react';
import { FullDatabase } from '../types';

interface PortableGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDb: FullDatabase;
  onRestoreDb: (db: FullDatabase) => void;
  onResetDefaults: () => void;
}

export const PortableGuideModal: React.FC<PortableGuideModalProps> = ({
  isOpen,
  onClose,
  currentDb,
  onRestoreDb,
  onResetDefaults
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentDb, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'asset_management_backup.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.lists && parsed.assets) {
          onRestoreDb(parsed);
          alert('پشتیبان با موفقیت بازیابی شد.');
          onClose();
        } else {
          alert('ساختار فایل JSON پشتیبان نامعتبر است.');
        }
      } catch (err) {
        alert('خطا در خواندن فایل پشتیبان JSON.');
      }
    };
    reader.readAsText(file);
  };

  const tauriCommand = `# ۱. ایجاد پروژه توری (Tauri) برای ساخت فایل EXE مستقل
npx @tauri-apps/cli init
# ۲. ساخت فایل اجرایی پرتابل بدون نیاز به نصب هیچ ابزار خارجی
npm run build
npx @tauri-apps/cli build
# فایل خروجی در مسیر src-tauri/target/release/app.exe قرار خواهد گرفت`;

  const electronCommand = `# ۱. ایجاد پکیج Electron مستقل
npm install -D electron electron-builder
# ۲. بیلد و پکیج به صورت پرتابل (Portable EXE)
npx electron-builder --win portable`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Laptop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                راهنمای جامع اجرای پرتابل (Portable) و ساخت فایل EXE
              </h3>
              <span className="text-[11px] text-slate-500">
                اجرا در هر محیطی (ویندوز، مک، لینوکس) بدون نیاز به نصب Office یا Access
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6 text-xs text-slate-700">
          {/* Section 1: Portability Guarantee */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 mb-1">
                ویژگی ۱۰۰٪ مستقل و پرتابل (Self-Contained)
              </h4>
              <p className="text-slate-600 leading-relaxed">
                این سامانه به صورت کاملاً مستقل در سمت کلاینت (Client-Side) با موتور داخلی پردازش داده، کتابخانه توکار اکسل (SheetJS) و پایگاه داده محلی (LocalStorage / IndexedDB) کار می‌کند. شما می‌توانید بدون اتصال اینترنت و بدون نصب نرم‌افزارهای مایکروسافت آفیس، اکسس یا پیش‌نیازهای سنگین، آن را اجرا و مدیریت کنید.
              </p>
            </div>
          </div>

          {/* Section 2: Backup & Restore */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-indigo-600" />
              پشتیبان‌گیری کامل از داده‌ها (Backup / Restore)
            </h4>
            <p className="text-slate-500">
              داده‌های ثبت شده در سیستم در حافظه محلی ذخیره می‌شوند. برای جابجایی بین سیستم‌های مختلف یا ایجاد نسخه پشتیبان:
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportJson}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>دانلود نسخه پشتیبان کامل (JSON)</span>
              </button>

              <label className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer">
                <Upload className="w-4 h-4 text-slate-600" />
                <span>بازیابی پشتیبان JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJson}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => {
                  if (window.confirm('آیا مایل به بازگردانی داده‌ها به اطلاعات پیش‌فرض هستید؟')) {
                    onResetDefaults();
                    alert('داده‌ها به حالت اولیه بازگردانی شد.');
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors mr-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>بازنشانی به داده‌های دمو</span>
              </button>
            </div>
          </div>

          {/* Section 3: Tauri Instructions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-indigo-600" />
                روش اول: ساخت فایل EXE فوق‌سبک با Tauri (پیشنهادی - زیر ۱۰ مگابایت)
              </h4>
              <button
                onClick={() => handleCopy(tauriCommand, 1)}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 1 ? 'کپی شد' : 'کپی دستورات'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-[11px] font-mono dir-ltr overflow-x-auto leading-relaxed">
              {tauriCommand}
            </pre>
          </div>

          {/* Section 4: Electron Instructions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-indigo-600" />
                روش دوم: ساخت فایل Portable EXE با Electron
              </h4>
              <button
                onClick={() => handleCopy(electronCommand, 2)}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 2 ? 'کپی شد' : 'کپی دستورات'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-[11px] font-mono dir-ltr overflow-x-auto leading-relaxed">
              {electronCommand}
            </pre>
          </div>

          {/* Section 5: Web Browser Execution */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <h5 className="font-semibold text-slate-900 mb-1">اجرا در مرورگر بدون هیچ کامپایلری:</h5>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              با دستور <code className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono">npm run build</code>، پوشه <code className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono">dist</code> تولید می‌شود که به سادگی با دوبار کلیک یا قراردادن روی یک فلش مموری، روی هر کامپیوتری در Google Chrome، Edge، Safari یا Firefox به صورت آفلاین بالا می‌آید.
            </p>
          </div>
        </div>

        <div className="flex justify-end p-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
          >
            متوجه شدم و بستن
          </button>
        </div>
      </div>
    </div>
  );
};
