document.addEventListener('DOMContentLoaded', () => {

  const header = document.querySelector('header');
  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const cards = document.querySelectorAll('.project-card');
  if (cards.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.style.animationDelay = `${i * 60}ms`;
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    cards.forEach(c => io.observe(c));
  } else {
    cards.forEach(c => c.style.opacity = '1');
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const terminal = document.getElementById('terminalBody');
  if (terminal) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const codeLines = [
      "const kyllian = {",
      "  role: 'Développeur FullStack',",
      "  formation: 'Coding Factory · ESIEE-IT',",
      "  stack: ['HTML', 'CSS', 'JS', 'SQL', 'PHP', 'Java', 'C#', 'Python', 'Bash', 'PowerShell'],",
      "  recherche: 'Alternance',",
      "};",
      "",
      "// statut → disponible ✔"
    ];

    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

    const highlight = (line) => {
      let safe = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      if (safe.trim().startsWith('//')) {
        return `<span class="tk tk-com">${safe}</span>`;
      }

      safe = safe.replace(/'([^']*)'/g, '<span class="tk tk-str">&#39;$1&#39;</span>');
      safe = safe.replace(/\bconst\b/g, '<span class="tk tk-kw">const</span>');
      safe = safe.replace(/^(\s*)([a-zA-Z_]+)(:)/, (m, sp, key, colon) => `${sp}<span class="tk tk-prop">${key}</span>${colon}`);
      safe = safe.replace(/([{}\[\],;])/g, '<span class="tk tk-punct">$1</span>');
      return safe || '&nbsp;';
    };

    const runTerminalAnimation = async () => {
      while (true) {
        terminal.innerHTML = '';
        for (const text of codeLines) {
          const lineEl = document.createElement('div');
          lineEl.className = 'line';
          terminal.appendChild(lineEl);

          if (reduceMotion) {
            lineEl.innerHTML = highlight(text);
            continue;
          }

          let current = '';
          for (const ch of text) {
            current += ch;
            lineEl.textContent = current;
            await sleep(40 + Math.random() * 40);
          }
          lineEl.innerHTML = highlight(text);
        }

        const caret = document.createElement('span');
        caret.className = 'caret';
        if (terminal.lastElementChild) {
          terminal.lastElementChild.appendChild(caret);
        }

        await sleep(3000);

        if (!reduceMotion) {
          const caretEl = terminal.querySelector('.caret');
          if (caretEl) caretEl.remove();

          for (let i = codeLines.length - 1; i >= 0; i--) {
            const text = codeLines[i];
            const lineEl = terminal.children[i];
            for (let j = text.length; j > 0; j--) {
              lineEl.textContent = text.substring(0, j - 1);
              await sleep(20);
            }
            lineEl.remove();
          }
        }

        await sleep(700);
      }
    };

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(runTerminalAnimation, 300);
            obs.disconnect();
          }
        });
      }, { threshold: 0.3 });
      io.observe(terminal);
    } else {
      runTerminalAnimation();
    }
  }

});
