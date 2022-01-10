"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeHTML = void 0;
function escapeHTML(str) {
    return str.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, "&#x27;")
        .replace(/\n/g, '<br>');
}
exports.escapeHTML = escapeHTML;
