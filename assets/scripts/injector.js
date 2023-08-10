(() => {
  const inject = (regex, src) => {
    if (location.pathname.match(regex)) {
      const body = document.getElementsByTagName('body')[0];
      const script = document.createElement('script');
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('src', chrome.runtime.getURL(src));
      body.appendChild(script);
    }
  };

  inject(/^\/board\/(.*)/, '/scripts/board.bundle.js');
})();