const clickText = async function(page, htmlTag, text) {
  const link = await page.$x(`//${htmlTag}[contains(text(), ${text})]`);
  console.log("link found", link.length);
  if (link.length > 0) {
    await link[0].click();
    return;
  } else {
    await Promise.reject(new Error("Link not found"));
  }
};

const clickAndWaitForNavigation = async function(
  page,
  selector,
  clickOptions,
  waitOptions
) {
  await Promise.all([
    page.waitForNavigation(waitOptions),
    page.click(selector, clickOptions)
  ]).then(value => {
    return value[0];
  });
};

module.exports = {
  clickText,
  clickAndWaitForNavigation
};
