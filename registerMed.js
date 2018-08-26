const util = require("./util");
const puppeteer = require("puppeteer");
const config = require("./.config.registerMed.js");
(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  // await page.clickAndWaitForNavigation = util.clickAndWaitForNavigation;
  await page.goto("http://59.124.174.66:82/MobileGO.aspx?Code=3807320406");
  //remove popup menu
  if (await page.$(".ui-button-text")) {
    await page.click(".ui-button-text");
  }

  // click to 掛號
  await util.clickAndWaitForNavigation(page, "input#ImageButton2", {
    waitUntil: "load"
  });

  // click to 複診
  await util.clickAndWaitForNavigation(page, "input#ImageButton1", {
    waitUntil: "load"
  });
  // fill out 身分證字號
  await page.type("#TextBox1", config.personalID);
  // fill out 出生年月日
  await page.type("#TextBox2", config.bday);
  // enter 驗證碼
  // use google cloud vision api
  // https://cloud.google.com/vision/docs/detecting-text#vision-text-detection-nodejs
  const capImage = await page.$("#captcha");
  await capImage.screenshot({ path: "capImage.png" });

  await page.screenshot({ path: "register.png", fullPage: true });
  // if login modal pops up, close it

  ////div[contains(@class, 'table-row')]
  await browser.close();
})();
