import { formatCredits } from '@/lib/credits';

interface CreditBalanceProps {
  credits: number;
}

export function CreditBalance({ credits }: CreditBalanceProps) {
  const percentage = (credits / 10) * 100;
  
  const getColorClass = () => {
    if (credits >= 7) return 'var(--color-fm-success)';
    if (credits >= 4) return 'var(--color-fm-warning)';
    return 'var(--color-fm-critical)';
  };
  
  return (
    <div className="flex items-center gap-2 md:gap-3">
      <div className="text-right">
        <div className="hidden md:block text-micro uppercase tracking-wide" style={{ color: 'var(--color-fm-text-tertiary)' }}>
          Credits
        </div>
        <div className="text-lg md:text-section-header font-bold" style={{ color: getColorClass() }}>
          {formatCredits(credits)}
          <span className="text-sm md:text-body" style={{ color: 'var(--color-fm-text-tertiary)' }}> / 10</span>
        </div>
      </div>
      
      <div className="hidden sm:block w-16 md:w-20 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-fm-surface-elevated)' }}>
        <div
          className="h-full transition-all duration-300 rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: getColorClass()
          }}
        />
      </div>
    </div>
  );
}

