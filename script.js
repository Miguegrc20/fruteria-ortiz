document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger");
    if (hamburger) {
        hamburger.addEventListener("click", () => {
            const navLinks = document.getElementById("nav-links");
            if (!navLinks) return;
            navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
        });
    }

    initFAQ();
    initChat();
    initContactForm();
    initRatings();
    initThemeToggle();
});

function initFAQ() {
    const questions = document.querySelectorAll('.faq-question');
    questions.forEach(btn => {
        btn.addEventListener('click', () => {
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', String(!expanded));
            const answer = btn.nextElementSibling;
            if (answer) {
                if (expanded) {
                    answer.hidden = true;
                } else {
                    answer.hidden = false;
                }
            }
        });
    });
}

function initChat() {
    const toggle = document.getElementById('chat-toggle');
    const windowEl = document.querySelector('.chat-window');
    const closeBtn = document.getElementById('chat-close');
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const messagesEl = document.getElementById('chat-messages');
    if (!toggle || !windowEl || !form || !input || !messagesEl) return;

    const STORAGE_KEY = 'chatMessages';
    const OPEN_KEY = 'chatOpen';
    let messages = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    const renderMessages = () => {
        messagesEl.innerHTML = '';
        messages.forEach(m => {
            const div = document.createElement('div');
            div.className = 'chat-message me';
            div.textContent = `${m.text} \n${m.time}`;
            messagesEl.appendChild(div);
        });
        messagesEl.scrollTop = messagesEl.scrollHeight;
    };
    renderMessages();

    const openChat = () => {
        if (toggle.getAttribute('aria-expanded') === 'true') return;
        toggle.setAttribute('aria-expanded', 'true');
        windowEl.hidden = false;
        localStorage.setItem(OPEN_KEY, 'true');
        input.focus();
        windowEl.dispatchEvent(new CustomEvent('chat:open'));
    };
    const closeChat = () => {
        if (toggle.getAttribute('aria-expanded') === 'false') return;
        windowEl.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
        localStorage.setItem(OPEN_KEY, 'false');
        windowEl.dispatchEvent(new CustomEvent('chat:close'));
    };

    toggle.addEventListener('click', () => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        isOpen ? closeChat() : openChat();
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeChat();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
            closeChat();
        }
    });

    document.addEventListener('click', (e) => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        if (!isOpen) return;
        if (windowEl.contains(e.target) || toggle.contains(e.target)) return;
        closeChat();
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        messages.push({ text, time: new Date().toLocaleTimeString() });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        input.value = '';
        renderMessages();
    });

    const persisted = localStorage.getItem(OPEN_KEY) === 'true';
    if (persisted) openChat();

    window.ChatWidget = {
        open: openChat,
        close: closeChat,
        toggle: () => {
            const isOpen = toggle.getAttribute('aria-expanded') === 'true';
            isOpen ? closeChat() : openChat();
        },
        sendMessage: (text) => {
            if (!text || typeof text !== 'string') return;
            messages.push({ text: text.trim(), time: new Date().toLocaleTimeString() });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
            renderMessages();
        },
        clear: () => {
            messages = [];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
            renderMessages();
        },
        isOpen: () => toggle.getAttribute('aria-expanded') === 'true'
    };
}

function initContactForm() {
    const form = document.getElementById('form-contacto');
    if (!form) return;
    const successMsg = form.querySelector('.form-exito');
    form.addEventListener('submit', e => {
        e.preventDefault();
        let valid = true;
        const fields = ['nombre', 'email', 'mensaje'];
        fields.forEach(f => {
            const input = form.querySelector(`#${f}`);
            const errorSpan = form.querySelector(`.error[data-error-for="${f}"]`);
            if (!input) return;
            let error = '';
            if (!input.value.trim()) {
                error = 'Campo requerido';
            } else if (f === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value)) {
                error = 'Email inválido';
            }
            if (error) {
                valid = false;
                if (errorSpan) errorSpan.textContent = error;
            } else if (errorSpan) {
                errorSpan.textContent = '';
            }
        });
        if (valid) {
            successMsg && (successMsg.hidden = false);
            setTimeout(() => { successMsg && (successMsg.hidden = true); }, 4000);
            form.reset();
        }
    });
}

function initRatings() {
    const ratingContainers = document.querySelectorAll('.rating');
    ratingContainers.forEach(container => {
        const product = container.getAttribute('data-product');
        if (!product) return;
        for (let i = 1; i <= 5; i++) {
            const span = document.createElement('span');
            span.className = 'star';
            span.innerHTML = '★';
            span.dataset.value = String(i);
            container.appendChild(span);
        }
        const resultEl = document.querySelector(`.rating-result[data-product="${product}"]`);
        const STORAGE_KEY = 'productRatings';
        let ratings = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        const current = ratings[product] || 0;
        updateVisual(container, current);
        if (resultEl) updateResult(resultEl, current);

        container.querySelectorAll('.star').forEach(star => {
            star.addEventListener('mouseenter', () => {
                const val = Number(star.dataset.value);
                updateHover(container, val);
            });
            star.addEventListener('mouseleave', () => {
                updateVisual(container, ratings[product] || 0);
            });
            star.addEventListener('click', () => {
                const val = Number(star.dataset.value);
                ratings[product] = val;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
                updateVisual(container, val);
                if (resultEl) updateResult(resultEl, val);
            });
        });
    });
}

function updateHover(container, val) {
    container.querySelectorAll('.star').forEach(star => {
        const sVal = Number(star.dataset.value);
        star.classList.toggle('hovered', sVal <= val);
    });
}

function updateVisual(container, val) {
    container.querySelectorAll('.star').forEach(star => {
        const sVal = Number(star.dataset.value);
        star.classList.remove('hovered');
        star.classList.toggle('selected', sVal <= val);
    });
}

function updateResult(el, val) {
    el.textContent = val ? `Tu calificación: ${val}/5` : 'Sin calificación aún';
}

function initThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const PREF_KEY = 'prefTheme';
    const stored = localStorage.getItem(PREF_KEY);
    if (stored === 'dark') {
        document.body.classList.add('dark-mode');
    }
    updateThemeButton(btn);
    btn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const mode = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem(PREF_KEY, mode);
        updateThemeButton(btn);
    });
}

function updateThemeButton(btn) {
    const dark = document.body.classList.contains('dark-mode');
    btn.textContent = dark ? '☀️ Claro' : '🌙 Oscuro';
    btn.setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
}
