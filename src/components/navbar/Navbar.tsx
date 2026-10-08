export default function Navbar() {
  return (
    <nav className="mb-5 rounded-xl flex items-center justify-between gap-6 bg-slate-900 p-4 shadow-md">
      <a
        href="#"
        aria-label="Tankwagen HCI Anlieferung"
        className="text-slate-300 hover:text-white transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-10 h-8"
        >
          <line x1="2" y1="15" x2="22" y2="15"></line>
          <rect x="2" y="5" width="13" height="8" rx="4"></rect>
          <path d="M1 11h1"></path>
          <path d="M15 15V8h3.5L22 11.5V15H15z"></path>
          <path d="M16 10h2.5l1.5 2H16v-2z"></path>
          <circle cx="6" cy="18" r="2.5"></circle>
          <circle cx="18" cy="18" r="2.5"></circle>
        </svg>
      </a>

      <a
        href="#"
        aria-label="Notizen"
        className="text-slate-300 hover:text-white transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-10 h-8"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
          <line x1="7" y1="14" x2="17" y2="14"></line>
          <line x1="7" y1="18" x2="13" y2="18"></line>
        </svg>
      </a>
    </nav>
  );
}
