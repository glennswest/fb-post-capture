const util = require("./util");
const puppeteer = require("puppeteer");
const config = require("./.config.js");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  // log in FB
  await page.goto("http://www.facebook.com/");
  await page.type("#email", config.email);
  await page.type("#pass", config.pass);
  await page.click("#loginbutton");
  await page.waitForNavigation({
    waitUntil: "load"
  });

  // Go to fan page
  await page.goto(
    "https://www.facebook.com/LinCY.TheThinker/posts/1936566219686949",
    {
      waitUntil: "networkidle2"
    }
  );

  // expand the comments to capture all commments
  // const moreCommentLink = await page.$x("//span[contains(text(), 'Comments')]");
  // if (moreCommentLink.length > 0) {
  //   await moreCommentLink[0].click();
  // } else {
  //   throw new Error("Link not found");
  // }
  await util.clickText(page, "span", "Comments");
  await page.waitForSelector(".UFICommentContent");
  const commentSelector = await page.$x(`//*[@class="UFICommentContent"]`);
  console.log("commentSelector found", commentSelector.length);
  await page.screenshot({ path: "example.png", fullPage: true });
  // if login modal pops up, close it

  ////div[contains(@class, 'table-row')]
  await browser.close();
})();
