const getDriver = require('./setup');
const HomePage = require('../pages/HomePage');
const SnowClothingPage = require('../pages/SnowClothingPage');

describe('Color Filter SKU Validation', function () {
  this.timeout(20000);
  let driver, home, snow;

  before(function () {
    console.log("🚀 Launching browser for color filter test...");
    driver = getDriver();
    home = new HomePage(driver);
    snow = new SnowClothingPage(driver);
  });

  it('Validates all color SKUs match unfiltered list', async function () {
    console.log("🌐 Navigating to Snow Clothing...");
    await home.visit('https://www.rei.com/');
    await home.dismissPopupIfPresent('[data-testid="modal"], .bx-close-button, .c-button-icon');
    await home.hoverMainMenu('Snow');
    await home.clickSubMenu('Snow Clothing');

    console.log("🔧 Applying filters: Kids, 4 & up, Snowsports, $20.00 to $49.99...");
    await snow.applyFilter("Kids");
    await snow.applyFilter("4 & up");
    await snow.applyFilter("Snowsports");
    await snow.applyFilter("$20.00 to $49.99");

    const originalSkus = new Set(await snow.getAllSkus());
    console.log(`🧾 SKUs with all filters (no color): ${originalSkus.size}`);

    const colorLabels = await snow.getColorLabels();
    const allColorSkus = new Set();

    for (let label of colorLabels) {
      const labelText = await label.getText();
      console.log(`🎨 Applying color filter: ${labelText}`);

      await home.visit('https://www.rei.com/');
      await home.dismissPopupIfPresent('[data-testid="modal"], .bx-close-button, .c-button-icon');
      await home.hoverMainMenu('Snow');
      await home.clickSubMenu('Snow Clothing');
      await snow.applyFilter("Kids");
      await snow.applyFilter("4 & up");
      await snow.applyFilter("Snowsports");
      await snow.applyFilter("$20.00 to $49.99");
      await snow.clickColorByLabelText(labelText);

      const skus = await snow.getAllSkus();
      console.log(`   📦 SKUs found for ${labelText}: ${skus.length}`);
      skus.forEach(sku => allColorSkus.add(sku));
    }

    console.log(`🔁 Comparing total SKUs (${originalSkus.size}) vs color-aggregated (${allColorSkus.size})`);
    const diff = [...originalSkus].filter(sku => !allColorSkus.has(sku));
    if (diff.length > 0) {
      throw new Error(`❌ Missing SKUs: ${diff.join(', ')}`);
    } else {
      console.log("✅ All color combinations accounted for.");
    }
  });

  after(() => driver.quit());
});