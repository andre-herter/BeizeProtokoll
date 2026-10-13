import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Note {
  text: string;
  timestamp: string;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem("notizen");
      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          return parsed.map((item): Note => {
            if (typeof item === "string") {
              return { text: item, timestamp: "" };
            }
            if (
              item !== null &&
              typeof item === "object" &&
              "text" in item &&
              "timestamp" in item &&
              typeof (item as Record<string, unknown>).text === "string" &&
              typeof (item as Record<string, unknown>).timestamp === "string"
            ) {
              return item as Note;
            }
            return { text: String(item), timestamp: "" };
          });
        }
      }
    } catch (e) {
      console.error("Fehler beim Laden aus dem LocalStorage:", e);
    }
    return [];
  });

  const [inputText, setInputText] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("notizen", JSON.stringify(notes));
    } catch (e) {
      console.error("Fehler beim Speichern im LocalStorage:", e);
    }
  }, [notes]);

  const createTimestamp = (): string => {
    const jetzt = new Date();
    const datumZeit = jetzt.toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    return `🕒 ${datumZeit} Uhr`;
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const newNote: Note = {
      text: trimmed,
      timestamp: createTimestamp(),
    };

    setNotes((prevNotes) => [...prevNotes, newNote]);
    setInputText("");
  };

  const handleDelete = (originalIndex: number) => {
    if (window.confirm("Sind Sie sicher?")) {
      setNotes((prevNotes) =>
        prevNotes.filter((_, index) => index !== originalIndex),
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-xl">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
        >
          <span aria-hidden="true">←</span> Zurück
        </Link>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 mb-8 border border-gray-100"
        >
          <h2 className="text-center text-xl font-bold text-gray-800 mb-4">
            Notiz erfassen
          </h2>

          <div className="mb-4">
            <label
              htmlFor="notiz_text"
              className=" block text-sm font-medium text-gray-700 mb-1"
            >
              Deine Notiz
            </label>
            <input
              type="text"
              id="notiz_text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Was gibt es Neues?..."
              required
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400"
            />
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

        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-slate-900">
              Gespeicherte Notizen
            </h3>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
              {notes.length}
            </span>
          </div>

          {notes.length === 0 ? (
            <p className="text-gray-400 italic text-sm">
              Noch keine Notizen vorhanden.
            </p>
          ) : (
            <ol className="space-y-3 list-decimal list-inside">
              {notes
                .map((note, originalIndex) => ({ note, originalIndex }))
                .reverse()
                .map(({ note, originalIndex }) => (
                  <li
                    key={originalIndex}
                    className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors p-3 rounded-md border border-gray-200 text-gray-800"
                  >
                    <div className="flex flex-col flex-1 mr-3 overflow-hidden">
                      {note.timestamp && (
                        <small className="text-xs text-gray-400 mb-0.5">
                          {note.timestamp}
                        </small>
                      )}
                      <span className="wrap-break-word text-gray-700 font-medium">
                        {note.text}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(originalIndex)}
                      title="Notiz löschen"
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
                  </li>
                ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
