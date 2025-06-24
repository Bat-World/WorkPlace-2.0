import React from "react";

type SidebarNavProps = {
  items: { id: string; label: string; icon?: any }[];
  activeTab: string;
  setActiveTab: (id: string) => void;
};

const SidebarNav: React.FC<SidebarNavProps> = ({ items, activeTab, setActiveTab }) => (
  <div className="w-50 flex-shrink-0">
    <nav className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg transition-colors text-sm ${
              activeTab === item.id
                ? "bg-[var(--background)]/10 text-white"
                : "hover:bg-[var(--background)]/10 text-[var(--background)]/50"
            }`}
          >
            {Icon && <Icon className="w-4 h-auto aspect-square" />}
            <span className="font-semibold">{item.label}</span>
          </button>
        );
      })}
    </nav>
  </div>
);

export default SidebarNav; 