export interface ArchivButtonProps {
  label?: string;
  onClick: () => void;
}

export default function ArchivButton({
  label = "Zum Archiv",
  onClick,
}: ArchivButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full mb-5 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg shadow-sm transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
    >
      {label}
    </button>
  );
}
