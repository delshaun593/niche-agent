"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardLayout;
const jsx_runtime_1 = require("react/jsx-runtime");
const server_1 = require("@/utils/supabase/server");
const navigation_1 = require("next/navigation");
const link_1 = __importDefault(require("next/link"));
async function DashboardLayout({ children, }) {
    const supabase = await (0, server_1.createClient)();
    const { data: { user }, } = await supabase.auth.getUser();
    if (!user) {
        return (0, navigation_1.redirect)('/login');
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex min-h-screen", children: [(0, jsx_runtime_1.jsxs)("aside", { className: "w-64 bg-gray-50 border-r border-gray-200", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-gray-800", children: "Niche Agent" }) }), (0, jsx_runtime_1.jsxs)("nav", { className: "mt-6", children: [(0, jsx_runtime_1.jsx)(link_1.default, { href: "/home", className: "block px-6 py-3 text-gray-600 hover:bg-gray-100 font-medium", children: "Agent Config" }), (0, jsx_runtime_1.jsx)(link_1.default, { href: "/home/leads", className: "block px-6 py-3 text-gray-600 hover:bg-gray-100 font-medium", children: "Captured Leads" })] }), (0, jsx_runtime_1.jsx)("div", { className: "absolute bottom-0 w-64 p-6 border-t border-gray-200", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500 truncate", children: user.email }) })] }), (0, jsx_runtime_1.jsx)("main", { className: "flex-1 bg-white", children: children })] }));
}
//# sourceMappingURL=layout.js.map