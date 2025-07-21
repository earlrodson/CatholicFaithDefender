import { HelpCircle, Shield, FileText, Book } from "lucide-react";
import { cn } from "@/lib/utils";

type ActiveTab = 'qa' | 'prayers' | 'documents' | 'bible';

interface BottomNavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'qa' as const, label: 'Q&A', icon: HelpCircle },
    { id: 'prayers' as const, label: 'Prayers', icon: Shield },
    { id: 'documents' as const, label: 'Documents', icon: FileText },
    { id: 'bible' as const, label: 'Bible', icon: Book },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center py-2 px-3 rounded-lg transition-all",
                isActive 
                  ? "active-tab bg-catholic-green text-white" 
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              )}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
