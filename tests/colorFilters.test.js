const getDriver = require('./setup');
const BasePage = require('../pages/BasePage');
const assert = require('assert');

describe('Color Filter SKU Validation', function () {
  this.timeout(60000);
  let driver, page;

  before(() => {
    console.log("🚀 Launching browser for color filter test...");
    driver = getDriver();
    page = new BasePage(driver);
  });

  it('🎨 Checks SKU consistency across color filters', async function () {
    await page.visit('https://www.rei.com/');
    await page.dismissPopupIfPresent('[data-testid="modal"], .bx-close-button, .c-button-icon');

    const snowMenu = await page.waitUntilVisible({ css: 'a[data-testid="gnav-header-link-Snow"]' });
    await driver.actions({ async: true }).move({ origin: snowMenu }).perform();
    const snowClothing = await page.waitUntilVisible({ xpath: "//a[text()='Snow Clothing']" });
    await snowClothing.click();

    const applyFilters = async () => {
      for (let label of ["Kids", "4 & up", "Snowsports", "$20.00 to $49.99"]) {
        const filter = await page.waitUntilVisible({ xpath: `//label[contains(., "${label}")]//input` });
        await driver.executeScript("arguments[0].click();", filter);
      }
    };

    await applyFilters();
    const allItems = await driver.findElements({ css: '[data-sku]' });
    const originalSkus = new Set(await Promise.all(allItems.map(i => i.getAttribute("data-sku"))));
    console.log(`🧾 Found ${originalSkus.size} unique SKUs with filters, before color applied.`);

    const colorLabels = await driver.findElements({ xpath: '//fieldset[legend[contains(text(), "Color")]]//label' });
    const aggregatedSkus = new Set();

    for (const label of colorLabels) {
      const text = await label.getText();
      console.log(`🎨 Applying color: ${text}`);
      await page.visit('https://www.rei.com/');
      await page.dismissPopupIfPresent('[data-testid="modal"], .bx-close-button, .c-button-icon');
      const snowMenu = await page.waitUntilVisible({ css: 'a[data-testid="gnav-header-link-Snow"]' });
      await driver.actions({ async: true }).move({ origin: snowMenu }).perform();
      const snowClothing = await page.waitUntilVisible({ xpath: "//a[text()='Snow Clothing']" });
      await snowClothing.click();
      await applyFilters();
      const colorInput = await page.waitUntilVisible({ xpath: `//label[contains(., "${text}")]//input` });
      await driver.executeScript("arguments[0].click();", colorInput);
      const skus = await driver.findElements({ css: '[data-sku]' });
      for (const s of skus) {
        const val = await s.getAttribute("data-sku");
        if (val) aggregatedSkus.add(val);
      }
    }

    const missing = [...originalSkus].filter(sku => !aggregatedSkus.has(sku));
    console.log(`🔁 Total deduped SKUs: ${aggregatedSkus.size}`);
    if (missing.length > 0) {
      throw new Error(`❌ Missing SKUs after filtering: ${missing.join(', ')}`);
    } else {
      console.log("✅ All original SKUs found across colors.");
    }
  });

  after(() => driver.quit());
});