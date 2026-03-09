import { useState } from "react";

const ShoppingBagIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

const BankIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="10" width="18" height="11" />
    <path d="M3 10l9-7 9 7" />
    <line x1="7" y1="15" x2="7" y2="21" />
    <line x1="12" y1="15" x2="12" y2="21" />
    <line x1="17" y1="15" x2="17" y2="21" />
  </svg>
);

const BlogIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ChatIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    <line x1="9" y1="10" x2="15" y2="10" />
    <line x1="9" y1="14" x2="13" y2="14" />
  </svg>
);

const FilesIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
  </svg>
);

const MailIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="2,4 12,13 22,4" />
  </svg>
);

const TaskIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9,11 12,14 22,4" />
    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
  </svg>
);

const FormIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="21" x2="9" y2="9" />
  </svg>
);

const InputIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <line x1="6" y1="12" x2="18" y2="12" />
  </svg>
);

const FloatIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
  </svg>
);

const ChevronDown = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6,9 12,15 18,9" />
  </svg>
);

const ApolloLogo = () => (
  <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
    <polygon
      points="20,2 38,38 2,38"
      stroke="#6366f1"
      strokeWidth="3"
      fill="none"
    />
    <line x1="20" y1="2" x2="20" y2="38" stroke="#6366f1" strokeWidth="2.5" />
  </svg>
);

const navData = [
  {
    section: "DASHBOARDS",
    items: [
      { label: "E-Commerce", icon: ShoppingBagIcon, active: false },
      { label: "Banking", icon: BankIcon, active: false },
    ],
  },
  {
    section: "APPS",
    items: [
      { label: "Blog", icon: BlogIcon, active: false, expandable: true },
      { label: "Calendar", icon: CalendarIcon, active: true },
      { label: "Chat", icon: ChatIcon, active: false },
      { label: "Files", icon: FilesIcon, active: false },
      { label: "Mail", icon: MailIcon, active: false, expandable: true },
      { label: "Task List", icon: TaskIcon, active: false },
    ],
  },
  {
    section: "UI KIT",
    items: [
      { label: "Form Layout", icon: FormIcon, active: false },
      { label: "Input", icon: InputIcon, active: false },
      { label: "Float Label", icon: FloatIcon, active: false },
    ],
  },
];

export default function SideBar() {
  const [activeItem, setActiveItem] = useState("Calendar");
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (label) => {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="flex h-screen bg-gray-100 items-center justify-center font-sans">
      <div
        className="bg-white h-screen overflow-y-auto"
        style={{
          width: "260px",
          fontFamily: "'Nunito', 'Segoe UI', sans-serif",
          borderRight: "1px solid #e9ecef",
          scrollbarWidth: "thin",
          scrollbarColor: "#c1c9d4 transparent",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2 px-6 py-5"
          style={{ paddingTop: "28px" }}
        >
          <ApolloLogo />
          <span
            className="font-bold tracking-widest"
            style={{
              color: "#6366f1",
              fontSize: "17px",
              letterSpacing: "0.18em",
            }}
          >
            APOLLO
          </span>
        </div>

        {/* Nav sections */}
        <nav className="px-3 pb-8">
          {navData.map((group) => (
            <div key={group.section} className="mt-5">
              {/* Section label */}
              <div
                className="px-3 mb-2 font-bold tracking-widest"
                style={{
                  fontSize: "11px",
                  color: "#6366f1",
                  letterSpacing: "0.13em",
                }}
              >
                {group.section}
              </div>

              {/* Items */}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.label;
                const isExpanded = expanded[item.label];

                return (
                  <div key={item.label}>
                    <button
                      onClick={() => {
                        setActiveItem(item.label);
                        if (item.expandable) toggleExpand(item.label);
                      }}
                      className="w-full flex items-center justify-between rounded-lg px-3 py-2 mb-0.5 transition-all duration-150 group"
                      style={{
                        backgroundColor: isActive ? "#eef2ff" : "transparent",
                        color: isActive ? "#4f46e5" : "#4b5563",
                        fontWeight: isActive ? "700" : "500",
                        fontSize: "14.5px",
                        cursor: "pointer",
                        border: "none",
                        outline: "none",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive)
                          e.currentTarget.style.backgroundColor = "#f5f5f5";
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive)
                          e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          style={{
                            color: isActive ? "#4f46e5" : "#6b7280",
                            flexShrink: 0,
                          }}
                        >
                          <Icon />
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {item.expandable && (
                        <span
                          style={{
                            color: "#9ca3af",
                            transform: isExpanded
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.2s",
                          }}
                        >
                          <ChevronDown />
                        </span>
                      )}
                    </button>

                    {/* Expandable sub-items placeholder */}
                    {item.expandable && isExpanded && (
                      <div className="ml-8 mb-1">
                        {["Overview", "Detail", "Edit"].map((sub) => (
                          <button
                            key={sub}
                            className="w-full text-left px-3 py-1.5 rounded text-sm"
                            style={{
                              color: "#6b7280",
                              fontSize: "13.5px",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.color = "#4f46e5")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.color = "#6b7280")
                            }
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
