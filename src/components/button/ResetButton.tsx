export interface ResetButtonProps {
  storageKeys?: string[];
  confirmMessage?: string;
  onReset?: () => void;
  label?: string;
}

export default function ResetButton({
  storageKeys = [],
  confirmMessage = "Möchten Sie alle eingegebenen Daten wirklich löschen?",
  onReset,
  label = "Daten zurücksetzen",
}: ResetButtonProps) {
  const handleReset = (): void => {
    if (window.confirm(confirmMessage)) {
      storageKeys.forEach((key) => {
        localStorage.removeItem(key);
      });

      if (onReset) {
        onReset();
      } else {
        window.location.reload();
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleReset}
      className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
    >
      {label}
    </button>
  );
}
