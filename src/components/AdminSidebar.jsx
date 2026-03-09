import React, { useState } from "react";
import { useSelector } from "react-redux";

const AdminLogo = () => (
  <svg width="22" height="22" viewBox="0 0 40 40" fill="none">``
    <polygon
      points="20,2 38,38 2,38"
      stroke="#2563eb"
      strokeWidth="3"
      fill="none"
    />
    <line x1="20" y1="2" x2="20" y2="38" stroke="#2563eb" strokeWidth="2.5" />
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

const navData = [
  {
    items: [
      { id: "dashboard", label: "Dashboard", icon: "pi-home" },
      { id: "category", label: "Categories", icon: "pi-tag" },
      { id: "providers", label: "Providers", icon: "pi-check-circle" },
      { id: "users", label: "Users", icon: "pi-users" },
    ],
  },
];

function AdminSidebar({
  activeTab,
  setActiveTab,
  showMobileMenu,
  setShowMobileMenu,
}) {
  const { user } = useSelector((state) => state.auth);
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (label) => {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleMenuClick = (tabId) => {
    setActiveTab(tabId);
    setShowMobileMenu(false);
  };

  const SidebarContent = () => (
    <>
      {/* Logo Section */}
      <div
        className="flex items-center gap-2 px-6 py-5"
        style={{ paddingTop: "28px" }}
      >
        <AdminLogo />
        <span
          className="font-bold tracking-widest"
          style={{
            color: "#2563eb",
            fontSize: "17px",
            letterSpacing: "0.18em",
          }}
        >
          ADMIN
        </span>
      </div>

      {/* Admin Info */}
      <div className="px-6 pb-4 border-b border-gray-200">
        <p className="text-sm font-medium text-gray-600">Welcome back,</p>
        <p className="text-lg font-bold text-gray-900">
          {user?.name || "Admin"}
        </p>
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
                color: "#2563eb",
                letterSpacing: "0.13em",
              }}
            >
              {group.section}
            </div>

            {/* Items */}
            {group.items.map((item) => {
              const isActive = activeTab === item.id;
              const isExpanded = expanded[item.id];

              return (
                <div key={item.id}>
                  <button
                    onClick={() => {
                      handleMenuClick(item.id);
                      if (item.expandable) toggleExpand(item.id);
                    }}
                    className="w-full flex items-center justify-between rounded-lg px-3 py-2 mb-0.5 transition-all duration-150 group"
                    style={{
                      backgroundColor: isActive ? "#eff6ff" : "transparent",
                      color: isActive ? "#2563eb" : "#475569",
                      fontWeight: isActive ? "700" : "500",
                      fontSize: "14.5px",
                      cursor: "pointer",
                      border: "none",
                      outline: "none",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        e.currentTarget.style.backgroundColor = "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive)
                        e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        style={{
                          color: isActive ? "#2563eb" : "#64748b",
                          flexShrink: 0,
                        }}
                      >
                        <i className={`pi ${item.icon} text-lg`}></i>
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.expandable && (
                      <span
                        style={{
                          color: "#cbd5e1",
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

                  {/* Expandable sub-items */}
                  {item.expandable && isExpanded && item.subItems && (
                    <div className="ml-8 mb-1">
                      {item.subItems.map((sub) => (
                        <button
                          key={sub}
                          className="w-full text-left px-3 py-1.5 rounded text-sm transition-colors duration-150"
                          style={{
                            color: "#64748b",
                            fontSize: "13.5px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = "#2563eb")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = "#64748b")
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
    </>
  );

  return (
    <>
      {/* SIDEBAR - Desktop */}
      <div
        className="hidden md:flex md:flex-col md:overflow-y-auto"
        style={{
          width: "260px",
          fontFamily: "'Nunito', 'Segoe UI', sans-serif",
          borderRight: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
          scrollbarWidth: "thin",
          scrollbarColor: "#cbd5e1 transparent",
        }}
      >
        <SidebarContent />
      </div>

      {/* SIDEBAR - Mobile */}
      <div
        className={`fixed left-0 top-0 h-full bg-white flex flex-col shadow-lg z-40 transform transition-transform duration-300 md:hidden overflow-y-auto ${
          showMobileMenu ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          width: "260px",
          fontFamily: "'Nunito', 'Segoe UI', sans-serif",
          borderRight: "1px solid #e2e8f0",
          top: "64px",
          height: "calc(100vh - 64px)",
          scrollbarWidth: "thin",
          scrollbarColor: "#cbd5e1 transparent",
        }}
      >
        <SidebarContent />
      </div>
    </>
  );
}

export default AdminSidebar;
