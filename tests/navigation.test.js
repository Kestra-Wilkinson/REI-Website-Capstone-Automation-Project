const getDriver = require('./setup');
const BasePage = require('../pages/BasePage');
const assert = require('assert');

describe('Navigation Menu Validation', function () {
  this.timeout(60000);
  let driver, page;

  const expectedSubmenus = [
    "Hiking Backpacks",
    "Hiking Clothing",
    "Hiking Footwear",
    "Hiking Accessories",
    "Hiking Safety",
    "Hiking Staff Picks"
  ];

  before(async function () {
    console.log("🚀 Launching browser for navigation test...");
    driver = getDriver();
    page = new BasePage(driver);
  });

  it('🧭 Validates Hiking submenu under Camp & Hike', async function () {
    await page.visit('https://www.rei.com/');
    await page.dismissPopupIfPresent('[data-testid="modal"], .bx-close-button, .c-button-icon');
    const actions = driver.actions({ async: true });
    const campHike = await page.waitUntilVisible({ css: 'a[data-testid="gnav-header-link-Camp & Hike"]' });
    await actions.move({ origin: campHike }).perform();

    const submenuItems = await driver.findElements({ css: 'a[data-analytics-id*="Camp & Hike > Hiking"]' });
    const texts = await Promise.all(submenuItems.map(el => el.getText()));
    console.log(`📋 Found submenu items: ${texts.join(', ')}`);

    expectedSubmenus.forEach(item => {
      assert(texts.includes(item), `Missing submenu: ${item}`);
    });
  });

  after(() => driver.quit());
});