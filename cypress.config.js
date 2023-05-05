const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    chromeWebSecurity: false,
    watchForFileChanges :false,
    defaultCommandTimeout: 15000,
    viewportHeight: 960,
    viewportWidth: 1440
    },
});


