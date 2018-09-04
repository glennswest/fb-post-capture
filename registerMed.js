const puppeteer = require("puppeteer");
const vision = require("@google-cloud/vision");
const util = require("./util");
const config = require("./.config.registerMed.js");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  // await page.clickAndWaitForNavigation = util.clickAndWaitForNavigation;
  await page.goto("http://59.124.174.66:82/MobileGO.aspx?Code=3807320406");

  //remove popup menu if it appears
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
  const client = new vision.ImageAnnotatorClient();
  try {
    const capTextDetection = await client.textDetection("capImage.png");
    capTextDetection[0].textAnnotations.forEach(text =>
      console.log(text.description)
    );
    // 123/n -> 123
    const captcha = capTextDetection[0].textAnnotations[0].description.replace(
      /[^0-9]/g,
      ""
    );
    await page.type("#TextBox5", captcha);
  } catch (err) {
    console.log(err);
  }

  // submit the page
  await page.click("#ImageButton3");

  // select the last 郭哲彰 on the page

  // wait for 10sec
  await page.waitFor(10000);

  await page.screenshot({ path: "register.png", fullPage: true });
  ////div[contains(@class, 'table-row')]
  await browser.close();
})();
