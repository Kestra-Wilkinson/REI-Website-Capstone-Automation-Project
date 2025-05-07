const getDriver = require('./setup');
const SearchPage = require('../pages/BasePage');
const assert = require('assert');

describe('REI Search Functionality', function () {
  this.timeout(60000);
  let driver, page;
  const terms = ["tent", "backpack", "snowshoes", "lantern", "nonexistentitem12345"];

  before(function () {
    console.log("🚀 Launching browser for search tests...");
    driver = getDriver();
    page = new SearchPage(driver);
  });

  terms.forEach(term => {
    it(`🔍 Searching for: ${term}`, async function () {
      await page.visit('https://www.rei.com/');
      await page.dismissPopupIfPresent('[data-testid="modal"], .bx-close-button, .c-button-icon');
      const input = await page.waitUntilVisible({ css: '#search-input' });
      await input.sendKeys(term, require('selenium-webdriver').Key.RETURN);
      await new Promise(r => setTimeout(r, 2000));
      const products = await driver.findElements({ css: '[data-testid="product-card"]' });
      const count = products.length;
      console.log(`📦 Found ${count} product(s) for "${term}"`);

      if (term === "nonexistentitem12345") {
        assert.strictEqual(count, 0, "Expected no results for a fake term");
      } else {
        assert(count > 0, "Expected some results");
      }
    });
  });

  after(() => driver.quit());
});