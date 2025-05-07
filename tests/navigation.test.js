const getDriver = require('./setup');
const NavigationPage = require('../pages/NavigationPage');
const assert = require('assert');

describe('Navigation Menu Validation', function () {
  let driver, nav;

  const expectedSubmenus = [
    "Hiking Backpacks",
    "Hiking Clothing",
    "Hiking Footwear",
    "Hiking Accessories",
    "Hiking Safety",
    "Hiking Staff Picks"
  ];

  before(async function () {
    driver = getDriver();
    nav = new NavigationPage(driver);
  });

  it('validates Hiking submenu under Camp & Hike', async function () {
    await nav.visit('https://www.rei.com/');
    await nav.hoverMenu('Camp & Hike');
    const submenuItems = await nav.getSubmenuItems();

    expectedSubmenus.forEach(expected => {
      assert(submenuItems.includes(expected), `Missing submenu: ${expected}`);
    });
  });

  after(() => driver.quit());
});