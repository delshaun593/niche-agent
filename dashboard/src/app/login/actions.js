'use server';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.signup = signup;
const cache_1 = require("next/cache");
const navigation_1 = require("next/navigation");
const server_1 = require("@/utils/supabase/server");
async function login(formData) {
    const supabase = await (0, server_1.createClient)();
    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
    };
    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) {
        (0, navigation_1.redirect)('/login?message=Could not authenticate user');
    }
    (0, cache_1.revalidatePath)('/', 'layout');
    (0, navigation_1.redirect)('/home');
}
async function signup(formData) {
    const supabase = await (0, server_1.createClient)();
    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
    };
    const { error } = await supabase.auth.signUp(data);
    if (error) {
        (0, navigation_1.redirect)('/login?message=Could not authenticate user');
    }
    (0, cache_1.revalidatePath)('/', 'layout');
    (0, navigation_1.redirect)('/home');
}
//# sourceMappingURL=actions.js.map