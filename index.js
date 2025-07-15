function openPdfInNewWindow() {
    // Otwiera okno z PDF bez paska adresu i innych elementów
    window.open('pan-tadeusz.pdf', 'PDFWindow', 'width=800,height=600,toolbar=no,scrollbars=yes,location=no,status=no,resizable=yes');
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js')
      .then(function(registration) {
        console.log('ServiceWorker registered with scope:', registration.scope);
      }, function(err) {
        console.log('ServiceWorker registration failed:', err);
      });
  });
}