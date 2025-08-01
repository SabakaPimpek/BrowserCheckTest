import { UAParser } from 'ua-parser-js';

function openPdfInNewWindow() {
    // Otwiera okno z PDF bez paska adresu i innych elementów
    window.open('pan-tadeusz.pdf', 'PDFWindow', 'width=800,height=600,toolbar=no,scrollbars=yes,location=no,status=no,resizable=yes');
}

window.addEventListener('DOMContentLoaded', () => {
  // const userAgentInfo = document.getElementById('userAgentInfo');
  const { browser, cpu, device } = UAParser(navigator.userAgent);
  // userAgentInfo.textContent = `Twoja przeglądarka: ${browser, cpu, device}`;
})