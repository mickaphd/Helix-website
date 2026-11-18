const lightbox = document.querySelector('.lightbox');
if (lightbox) {
    const image = lightbox.querySelector('img');
    const shots = [...document.querySelectorAll('.shot img')];
    const count = document.createElement('p');
    count.className = 'lb-count';
    lightbox.append(count);
    let current = 0;
    const show = (index) => {
        current = (index + shots.length) % shots.length;
        image.src = shots[current].src;
        image.alt = shots[current].alt;
        count.textContent = (current + 1) + ' / ' + shots.length;
    };
    shots.forEach((source, index) => source.closest('.shot').addEventListener('click', () => {
        show(index);
        lightbox.showModal();
    }));
    const step = (delta) => (event) => { event.stopPropagation(); show(current + delta); };
    lightbox.querySelector('.lb-prev').addEventListener('click', step(-1));
    lightbox.querySelector('.lb-next').addEventListener('click', step(1));
    lightbox.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') show(current - 1);
        if (event.key === 'ArrowRight') show(current + 1);
    });
    let touchX = null;
    let swiped = false;
    lightbox.addEventListener('touchstart', (event) => { touchX = event.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', (event) => {
        if (touchX === null) return;
        const dx = event.changedTouches[0].clientX - touchX;
        touchX = null;
        if (Math.abs(dx) > 50) { show(current + (dx < 0 ? 1 : -1)); swiped = true; }
    });
    lightbox.addEventListener('click', () => {
        if (swiped) { swiped = false; return; }
        lightbox.close();
    });
}

const versionSlots = document.querySelectorAll('[data-latest-version]');
if (versionSlots.length) {
    fetch('https://api.github.com/repos/mickaphd/Helix/releases/latest')
        .then((response) => response.ok ? response.json() : Promise.reject())
        .then(({ tag_name }) => {
            if (!tag_name) return;
            versionSlots.forEach((slot) => {
                slot.textContent = 'Version ' + tag_name.replace(/^v/, '');
                slot.hidden = false;
            });
        })
        .catch(() => {});
}

document.querySelector('.signature')?.addEventListener('click', (event) => event.currentTarget.classList.toggle('active'));

const linked = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)));
if (linked instanceof HTMLDetailsElement) linked.open = true;
