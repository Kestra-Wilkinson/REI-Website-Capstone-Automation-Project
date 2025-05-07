const getDriver = require('./setup');
const HomePage = require('../pages/HomePage');
const SnowClothingPage = require('../pages/SnowClothingPage');

describe('Color Filter SKU Validation', function () {
  let driver, home, snow;

  before(function () {
    driver = getDriver();
    home = new HomePage(driver);
    snow = new SnowClothingPage(driver);
  });

  it('Validates all color SKUs match unfiltered list', async function () {
    await home.visit('https://www.rei.com/');
    await home.hoverMainMenu('Snow');
    await home.clickSubMenu('Snow Clothing');

    await snow.applyFilter("Kids");
    await snow.applyFilter("4 & up");
    await snow.applyFilter("Snowsports");
    await snow.applyFilter("$20.00 to $49.99");

    const originalSkus = new Set(await snow.getAllSkus());
    const colorLabels = await snow.getColorLabels();
    const allColorSkus = new Set();

    for (let label of colorLabels) {
      const labelText = await label.getText();

      await home.visit(driver.getCurrentUrl());
      await snow.applyFilter("Kids");
      await snow.applyFilter("4 & up");
      await snow.applyFilter("Snowsports");
      await snow.applyFilter("$20.00 to $49.99");
      await snow.clickColorByLabelText(labelText);

      (await snow.getAllSkus()).forEach(sku => allColorSkus.add(sku));
    }

    const diff = [...originalSkus].filter(sku => !allColorSkus.has(sku));
    if (diff.length > 0) {
      throw new Error(`Missing SKUs: ${diff.join(', ')}`);
    }
  });

  after(() => driver.quit());
});