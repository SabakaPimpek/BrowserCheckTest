function openPdfInNewWindow() {
    // Otwiera okno z PDF bez paska adresu i innych elementów
    window.open('pan-tadeusz.pdf', 'PDFWindow', 'width=800,height=600,toolbar=no,scrollbars=yes,location=no,status=no,resizable=yes');
}

const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("./sw.js")
      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

window.addEventListener('DOMContentLoaded', () => {
  registerServiceWorker();
})