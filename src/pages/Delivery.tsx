import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "lkw_eintraege";

interface DeliveryEntry {
  id: string;
  auswahl: string;
  inhalt: string;
  gewicht: string;
  uhrzeit: string;
}

function createTimestamp(): string {
  return (
    new Date().toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " Uhr"
  );
}

function loadEntries(): DeliveryEntry[] {
  try {
    const storedEntries = localStorage.getItem(STORAGE_KEY);

    if (!storedEntries) {
      return [];
    }

    const parsed: unknown = JSON.parse(storedEntries);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (entry: unknown): entry is DeliveryEntry =>
        typeof entry === "object" &&
        entry !== null &&
        "id" in entry &&
        typeof entry.id === "string" &&
        "auswahl" in entry &&
        typeof entry.auswahl === "string" &&
        "inhalt" in entry &&
        typeof entry.inhalt === "string" &&
        "gewicht" in entry &&
        typeof entry.gewicht === "string" &&
        "uhrzeit" in entry &&
        typeof entry.uhrzeit === "string",
    );
  } catch {
    return [];
  }
}

export default function Delivery() {
  const [entries, setEntries] = useState<DeliveryEntry[]>(loadEntries);
  const [tank, setTank] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [weight, setWeight] = useState<string>("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error: unknown) {
      console.error("Einträge konnten nicht gespeichert werden:", error);
    }
  }, [entries]);

  function handleSubmit(event: React.SyntheticEvent): void {
    event.preventDefault();

    if (!tank || content === "" || weight === "") {
      return;
    }

    const newEntry: DeliveryEntry = {
      id: crypto.randomUUID(),
      auswahl: tank,
      inhalt: content,
      gewicht: weight,
      uhrzeit: createTimestamp(),
    };

    setEntries((previous) => [...previous, newEntry]);

    setTank("");
    setContent("");
    setWeight("");
  }

  function deleteEntry(id: string): void {
    if (
      window.confirm(
        "Sind Sie sicher, dass Sie diesen Eintrag löschen möchten?",
      )
    ) {
      setEntries((previous) => previous.filter((entry) => entry.id !== id));
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
        >
          <span aria-hidden="true">←</span> Zurück
        </Link>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-slate-900">
            Lieferung erfassen
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="tank"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Tank
                </label>

                <select
                  id="tank"
                  value={tank}
                  onChange={(event) => setTank(event.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="" disabled>
                    Bitte auswählen
                  </option>
                  <option value="B1">B1</option>
                  <option value="B24">B24</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Inhalt
                </label>

                <div className="relative">
                  <input
                    id="content"
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    placeholder="0"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center font-medium text-slate-500">
                    %
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="weight"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Gewicht
                </label>

                <div className="relative">
                  <input
                    id="weight"
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0"
                    value={weight}
                    onChange={(event) => setWeight(event.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-14 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center font-medium text-slate-500">
                    kg
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-7 flex justify-end">
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-[0.99] sm:w-auto"
              >
                Speichern
              </button>
            </div>
          </form>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-slate-900">
              Gespeicherte Einträge
            </h3>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
              {entries.length}
            </span>
          </div>

          <ol className="space-y-3">
            {[...entries].reverse().map((entry) => (
              <li
                key={entry.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300"
              >
                <p className="mb-3 text-xs text-slate-500">
                  🕒 {entry.uhrzeit}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <span aria-hidden="true">🛢️</span>
                    <span className="font-bold">{entry.auswahl}</span>
                    <span className="text-slate-400">=</span>
                    <span className="font-semibold">{entry.inhalt} %</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <span aria-hidden="true">🚛</span>
                    <span className="font-semibold">{entry.gewicht} kg</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteEntry(entry.id)}
                    aria-label={`Eintrag ${entry.auswahl} löschen`}
                    title="Eintrag löschen"
                    className="shrink-0 rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 6h18m-2 0-1 14H6L5 6m4 0V4h6v2m-5 4v6m4-6v6"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}
