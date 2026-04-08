"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RootPage;
const navigation_1 = require("next/navigation");
function RootPage() {
    // Automatically redirect anyone visiting the bare domain straight to their dashboard
    (0, navigation_1.redirect)('/home');
}
//# sourceMappingURL=page.js.map