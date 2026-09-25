const lightbox = document.querySelector('.lightbox');
if (lightbox) {
    const image = lightbox.querySelector('img');
    document.querySelectorAll('.shot').forEach((shot) => shot.addEventListener('click', () => {
        const source = shot.querySelector('img');
        image.src = source.src;
        image.alt = source.alt;
        lightbox.showModal();
    }));
    lightbox.addEventListener('click', () => lightbox.close());
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
