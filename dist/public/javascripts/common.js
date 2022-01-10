"use strict";
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.do-delete').forEach(element => {
        element.addEventListener('click', e => {
            if (!confirm('削除してもよろしいですか？')) {
                e.preventDefault();
                return false;
            }
            return true;
        });
    });
});
