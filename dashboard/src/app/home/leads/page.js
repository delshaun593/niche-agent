"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LeadsPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const server_1 = require("@/utils/supabase/server");
const navigation_1 = require("next/navigation");
async function LeadsPage() {
    const supabase = await (0, server_1.createClient)();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return (0, navigation_1.redirect)('/login');
    }
    // Fetch leads. 
    // Real app: .from('leads').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    const leads = [
        { id: 1, name: 'John Doe', phone: '+1234567890', status: 'Interested', date: '2026-04-08' },
        { id: 2, name: 'Sarah Smith', phone: '+0987654321', status: 'Follow Up', date: '2026-04-07' }
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "p-10 max-w-6xl mx-auto", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-3xl font-bold mb-6 text-gray-900", children: "Captured Leads" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 mb-8", children: "View and manage all leads captured by your AI receptionist." }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden", children: (0, jsx_runtime_1.jsxs)("table", { className: "min-w-full divide-y divide-gray-200", children: [(0, jsx_runtime_1.jsx)("thead", { className: "bg-gray-50", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Name" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Phone" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Date" })] }) }), (0, jsx_runtime_1.jsxs)("tbody", { className: "bg-white divide-y divide-gray-200", children: [leads.map((lead) => ((0, jsx_runtime_1.jsxs)("tr", { className: "hover:bg-gray-50", children: [(0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900", children: lead.name }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: lead.phone }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: (0, jsx_runtime_1.jsx)("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${lead.status === 'Interested' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`, children: lead.status }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: lead.date })] }, lead.id))), leads.length === 0 && ((0, jsx_runtime_1.jsx)("tr", { children: (0, jsx_runtime_1.jsx)("td", { colSpan: 4, className: "px-6 py-10 text-center text-gray-500", children: "No leads captured yet. Your agent is waiting for calls!" }) }))] })] }) })] }));
}
//# sourceMappingURL=page.js.map