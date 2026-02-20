import { Bell, Shield } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-200 border-slate-700 px-6 py-4">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-1">
          <button className="relative p-2 rounded-lg hover:bg-slate-10 transition-colors">
            <Bell size={20} className="text-white" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-1 pl-4 border-slate-200">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-600">
              <Shield size={18} />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-white">System Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
