import { MessageSquare, FileImage, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type MobileTab = 'chat' | 'evidence' | 'analysis';

interface MobileTabBarProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
  showAnalysisTab?: boolean; // Only show when S8 analysis is available
  hasNewAnalysis?: boolean; // Show "NEW" badge on analysis tab
  className?: string;
}

export function MobileTabBar({
  activeTab,
  onTabChange,
  showAnalysisTab = false,
  hasNewAnalysis = false,
  className,
}: MobileTabBarProps) {
  const tabs = [
    {
      id: 'chat' as MobileTab,
      label: 'Chat',
      icon: MessageSquare,
    },
    {
      id: 'evidence' as MobileTab,
      label: 'Evidencia',
      icon: FileImage,
    },
  ];

  // Add analysis tab if S8 is available
  if (showAnalysisTab) {
    tabs.push({
      id: 'analysis' as MobileTab,
      label: 'Análisis',
      icon: BarChart3,
    });
  }

  return (
    <div className={cn('flex border-b border-border bg-background', className)}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const showBadge = tab.id === 'analysis' && hasNewAnalysis;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'relative flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors',
              'border-b-2',
              isActive
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{tab.label}</span>
            {showBadge && (
              <span className="absolute -top-1 right-1/4 flex h-5 w-10 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                NEW
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
