const getDriver = require('./setup');
const NavigationPage = require('../pages/NavigationPage');
const assert = require('assert');

describe('Navigation Menu Validation', function () {
  this.timeout(15000);
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
    console.log("🚀 Launching browser for navigation test...");
    driver = getDriver();
    nav = new NavigationPage(driver);
  });

  it('validates Hiking submenu under Camp & Hike', async function () {
    console.log("🧭 Navigating to REI homepage...");
    await nav.visit('https://www.rei.com/');
    await nav.dismissPopupIfPresent('[data-testid="modal"], .bx-close-button, .c-button-icon');
    console.log("📁 Hovering over Camp & Hike > Hiking...");
    await nav.hoverMenu('Camp & Hike');
    const submenuItems = await nav.getSubmenuItems();

    expectedSubmenus.forEach(expected => {
      console.log(`✅ Checking submenu: ${expected}`);
      assert(submenuItems.includes(expected), `Missing submenu: ${expected}`);
    });
  });

  after(() => driver.quit());
});