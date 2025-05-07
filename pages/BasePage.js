const fs = require('fs');
const path = require('path');

class BasePage {
  constructor(driver) {
    this.driver = driver;
  }

  async visit(url) {
    await this.driver.get(url);
  }

  async waitUntilVisible(locator, timeout = 30000, retries = 3) {
    const { until } = require('selenium-webdriver');
    let lastError;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await this.driver.wait(until.elementLocated(locator), timeout);
        const element = await this.driver.findElement(locator);
        await this.driver.wait(until.elementIsVisible(element), timeout);
        return element;
      } catch (err) {
        lastError = err;
        console.warn(`⏳ Attempt ${attempt} failed to find element. Retrying...`);
        await this.driver.sleep(1000);
      }
    }
    console.error("❌ Element not found after retries. Taking screenshot...");
    await this.takeScreenshot('element_not_found');
    throw lastError;
  }

  async click(locator) {
    const element = await this.waitUntilVisible(locator);
    await element.click();
  }

  async getText(locator) {
    const element = await this.waitUntilVisible(locator);
    return element.getText();
  }

  async takeScreenshot(label = 'error') {
    const image = await this.driver.takeScreenshot();
    const file = path.join(__dirname, `../screenshots/${label}-${Date.now()}.png`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, image, 'base64');
    console.log(`📸 Screenshot saved: ${file}`);
  }

  async dismissPopupIfPresent() {
    try {
      const { By } = require('selenium-webdriver');
      const popupSelectors = [
        '[data-testid="modal"]',
        '.bx-close-button',
        '.c-button-icon',
        '#bx-element-modal',
        '[aria-label="Close"]',
        '.opt-out-button'
      ];

      for (const selector of popupSelectors) {
        const elements = await this.driver.findElements(By.css(selector));
        if (elements.length > 0) {
          const button = elements[0];
          await this.driver.executeScript("arguments[0].scrollIntoView(true);", button);
          await button.click();
          console.log(`🧹 Dismissed popup with: ${selector}`);
          await this.driver.sleep(1000);
        }
      }
    } catch (err) {
      console.log("✅ No modal or popup to dismiss.");
    }
  }
}

module.exports = BasePage;