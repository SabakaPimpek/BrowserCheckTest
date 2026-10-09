import { UAParser } from 'ua-parser-js';

function openPdfInNewWindow() {
    // Otwiera okno z PDF bez paska adresu i innych elementów
    window.open('pan-tadeusz.pdf', 'PDFWindow', 'width=800,height=600,toolbar=no,scrollbars=yes,location=no,status=no,resizable=yes');
}

window.addEventListener('DOMContentLoaded', () => {
  // console.log("hello");
  const userAgentInfo = document.getElementById('userAgentInfo');
  userAgentInfo.textContent = `Twoja przeglądarka:`;
  const parsedUA = UAParser(navigator.userAgent);
  const jsonLines = JSON.stringify(parsedUA, null, 2).split("\n");

    jsonLines.forEach(line => {
      const div = document.createElement("div");
      div.className = "line";
      div.textContent = line;
      userAgentInfo.appendChild(div);
    });
});


const activePointers = new Map();
const seenInputTypes = new Set();

let maxSimultaneousFingers = 0;
let historyCount = 0;

function updateDiagnostic(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function addDiagnosticEvent(message) {
    const history = document.getElementById('diagHistory');
    if (!history) return;

    const row = document.createElement('div');
    row.textContent =
        `${new Date().toLocaleTimeString()} — ${message}`;

    history.prepend(row);

    // Ograniczamy historię, żeby nie zużywać niepotrzebnie pamięci.
    while (history.children.length > 30) {
        history.lastElementChild.remove();
    }

    historyCount++;
}

function getActiveFingerCount() {
    let count = 0;

    for (const pointer of activePointers.values()) {
        if (pointer.type === 'touch') {
            count++;
        }
    }

    return count;
}

function updateInputInfo(event, action) {
    const type = event.pointerType || 'unknown';
    const fingers = getActiveFingerCount();

    if (type !== 'unknown') {
        seenInputTypes.add(type);
    }

    maxSimultaneousFingers = Math.max(
        maxSimultaneousFingers,
        fingers
    );

    updateDiagnostic('diagAction', action);
    updateDiagnostic(
        'diagType',
        [...seenInputTypes].join(', ') || 'Nie wykryto'
    );
    updateDiagnostic('diagFingers', String(fingers));
    updateDiagnostic(
        'diagMaxFingers',
        String(maxSimultaneousFingers)
    );
    updateDiagnostic(
        'diagPosition',
        `${Math.round(event.clientX)} / ${Math.round(event.clientY)}`
    );
    updateDiagnostic(
        'diagButtons',
        event.buttons !== undefined ? String(event.buttons) : '—'
    );
}

document.addEventListener('pointerdown', event => {
    activePointers.set(event.pointerId, {
        type: event.pointerType || 'unknown'
    });

    updateInputInfo(event, 'pointerdown');
    addDiagnosticEvent(
        `START: ${event.pointerType || 'unknown'}, ID=${event.pointerId}`
    );
});

document.addEventListener('pointermove', event => {
    // Mysz poruszana bez wciśnięcia przycisku również jest wykrywana.
    if (event.pointerType === 'mouse' && event.buttons === 0) {
        updateDiagnostic('diagAction', 'Ruch myszy');
        updateDiagnostic('diagType', 'mouse');
        updateDiagnostic(
            'diagPosition',
            `${Math.round(event.clientX)} / ${Math.round(event.clientY)}`
        );
        return;
    }

    if (activePointers.has(event.pointerId)) {
        updateInputInfo(event, 'pointermove');
    }
});

function finishPointer(event, action) {
    const pointer = activePointers.get(event.pointerId);

    if (pointer) {
        activePointers.delete(event.pointerId);
        updateInputInfo(event, action);

        addDiagnosticEvent(
            `KONIEC: ${pointer.type}, ID=${event.pointerId}`
        );
    }

    updateDiagnostic('diagFingers', String(getActiveFingerCount()));
}

document.addEventListener('pointerup', event => {
    finishPointer(event, 'pointerup');
});

document.addEventListener('pointercancel', event => {
    finishPointer(event, 'pointercancel');
});

document.addEventListener('pointerover', event => {
    if (event.pointerType === 'mouse') {
        updateDiagnostic('diagType', 'mouse');
    }
});

document.addEventListener('keydown', event => {
    updateDiagnostic('diagAction', `Klawiatura: ${event.key}`);
    updateDiagnostic('diagType', 'keyboard');
    seenInputTypes.add('keyboard');
    updateDiagnostic('diagType', [...seenInputTypes].join(', '));
});

// Informacja o potencjalnej obsłudze dotyku.
updateDiagnostic(
    'diagTouchSupport',
    navigator.maxTouchPoints > 0
        ? `Tak, maxTouchPoints=${navigator.maxTouchPoints}`
        : 'Brak zgłoszonych punktów dotyku'
);

// Zwijanie okienka.
document.getElementById('diagToggle')?.addEventListener('click', () => {
    const panel = document.getElementById('inputDiagnostics');
    const collapsed = panel.classList.toggle('collapsed');

    document.getElementById('diagToggle').textContent =
        collapsed ? 'Rozwiń' : 'Zwiń';
});

// Reset statystyk.
document.getElementById('diagReset')?.addEventListener('click', () => {
    maxSimultaneousFingers = getActiveFingerCount();
    historyCount = 0;

    document.getElementById('diagHistory').replaceChildren();

    updateDiagnostic(
        'diagMaxFingers',
        String(maxSimultaneousFingers)
    );

    addDiagnosticEvent('Wyzerowano historię');
});