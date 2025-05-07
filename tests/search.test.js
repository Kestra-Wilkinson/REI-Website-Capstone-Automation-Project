const getDriver = require('./setup');
const SearchPage = require('../pages/SearchPage');
const assert = require('assert');

describe('REI Search Functionality', function () {
  let driver, search;
  const terms = ["tent", "backpack", "snowshoes", "lantern", "nonexistentitem12345"];

  before(function () {
    driver = getDriver();
    search = new SearchPage(driver);
  });

  terms.forEach(term => {
    it(`should search for ${term}`, async function () {
      await search.visit('https://www.rei.com/');
      await search.search(term);
      const results = await search.getProductResults();

      if (term === "nonexistentitem12345") {
        assert.strictEqual(results, 0, "Expected no results");
      } else {
        assert(results > 0, "Expected results to be found");
      }
    });
  });

  after(() => driver.quit());
});