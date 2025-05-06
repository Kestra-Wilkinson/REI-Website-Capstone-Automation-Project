const { Builder } = require('selenium-webdriver');
require('chromedriver');

module.exports = function getDriver() {
  return new Builder().forBrowser('chrome').build();
};