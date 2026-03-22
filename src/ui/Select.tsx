export function Select({
    variant,
    onChange,
    items,
}: {
    variant?: 'primary' | 'secondary' | 'danger';
    onChange?: () => void,
    items?: any[]
}) {
    const base =
    'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60';
    const styles =
    variant === 'primary'
      ? 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white'
      : variant === 'danger'
        ? 'bg-rose-600 text-white hover:bg-rose-700'
        : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800';

    return (
        <select className={[base, styles].join(' ')} onChange={onChange}>
            {items?.map((i, index) => (
                <option key={index} value={i}>
                    {i}
                </option>
            ))}
        </select>
    )

}