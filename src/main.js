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