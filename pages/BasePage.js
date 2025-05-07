class BasePage {
  constructor(driver) {
    this.driver = driver;
  }

  async visit(url) {
    await this.driver.get(url);
  }

  async waitUntilVisible(locator, timeout = 30000) {
    const { until } = require('selenium-webdriver');
    await this.driver.wait(until.elementLocated(locator), timeout);
    const element = await this.driver.findElement(locator);
    await this.driver.wait(until.elementIsVisible(element), timeout);
    return element;
  }

  async click(locator) {
    const element = await this.waitUntilVisible(locator);
    await element.click();
  }

  async getText(locator) {
    const element = await this.waitUntilVisible(locator);
    return element.getText();
  }

  async dismissPopupIfPresent(selector) {
    try {
      const { By, until } = require('selenium-webdriver');
      const popup = await this.driver.wait(until.elementLocated(By.css(selector)), 5000);
      const closeButton = await popup.findElement(By.css('button, .close, .dismiss, .x-close'));
      await this.driver.executeScript("arguments[0].scrollIntoView(true);", closeButton);
      await closeButton.click();
      console.log(`🧹 Popup dismissed using selector: ${selector}`);
    } catch (err) {
      console.log(`✅ No popup with selector ${selector} appeared (or already dismissed).`);
    }
  }
}

module.exports = BasePage;