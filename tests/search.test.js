const getDriver = require('./setup');
const SearchPage = require('../pages/SearchPage');
const assert = require('assert');

describe('REI Search Functionality', function () {
  this.timeout(15000);
  let driver, search;
  const terms = ["tent", "backpack", "snowshoes", "lantern", "nonexistentitem12345"];

  before(function () {
    console.log("🚀 Launching browser for search tests...");
    driver = getDriver();
    search = new SearchPage(driver);
  });

  terms.forEach(term => {
    it(`should search for ${term}`, async function () {
      console.log(`🔍 Searching for: ${term}`);
      await search.visit('https://www.rei.com/');
      await search.dismissPopupIfPresent('[data-testid="modal"], .bx-close-button, .c-button-icon');
      await search.search(term);
      await new Promise(res => setTimeout(res, 2000));
      const results = await search.getProductResults();
      console.log(`📦 Results found: ${results}`);

      if (term === "nonexistentitem12345") {
        assert.strictEqual(results, 0, "Expected no results");
      } else {
        assert(results > 0, "Expected results to be found");
      }
    });
  });

  after(() => driver.quit());
});