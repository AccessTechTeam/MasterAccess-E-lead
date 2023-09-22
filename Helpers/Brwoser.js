async function initializeBrowser() {
    return await puppeteer.launch({
      args: [
        '--enable-features=NetworkService',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--shm-size=3gb',
      ],
      ignoreHTTPSErrors: true,
      headless: true,
      defaultViewport: {
        width: 1300,
        height: 1000,
      },
      executablePath: "/usr/bin/chromium",
    });
  }
  