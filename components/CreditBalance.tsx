import { formatCredits } from '@/lib/credits';

interface CreditBalanceProps {
  credits: number;
}

export function CreditBalance({ credits }: CreditBalanceProps) {
  const percentage = (credits / 10) * 100;
  
  const getColorClass = () => {
    if (credits >= 7) return 'var(--color-fm-aqua-500)';
    if (credits >= 4) return 'var(--color-fm-warning)';
    return 'var(--color-fm-critical)';
  };
  
  return (
    <div className="flex items-center gap-4 px-5 py-3 rounded-xl border" style={{ 
      backgroundColor: 'var(--color-fm-surface)',
      borderColor: 'var(--color-fm-border)'
    }}>
      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-fm-text-secondary)' }}>
        Credits
      </span>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold" style={{ color: getColorClass() }}>
          {formatCredits(credits)}
        </span>
        <span className="text-lg" style={{ color: 'var(--color-fm-text-secondary)' }}>
          / 10
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="w-28 h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-fm-surface-elevated)' }}>
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

