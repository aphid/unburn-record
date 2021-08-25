const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');

console.log(process.argv);
var name = process.argv[2] || "1d1002";
var lo = process.argv[3] || null;
var hi = process.argv[4] || null;
var interval = process.argv[5] || null;
const duration = 3600;

let thing = {};
thing.name = name;
thing.lo = lo;
thing.hi = hi;
thing.interval = interval;


let gather = async function (thing) {
  let name = thing.name;
  let lo = thing.lo;
  let hi = thing.hi;
  let interval = thing.interval;
  let url = 'http://localhost/unburn/difference.html?id=' + name;

  if (interval) {
    url += "&interval=" + interval;
  }
  if (lo) {
    url += "&low=" + lo;
  }

  if (hi) {
    url += "&high=" + hi;
  }

  if (interval && lo && hi){
    name = `${name}_${lo}_${hi}_${interval}`;
    console.log(name);
  }

  let browser = await puppeteer.launch({ timeout: 0, headless: false, args: ["--no-sandbox", '--start-maximized'], defaultViewport: null });
  let page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });

  await page.goto(url);
  await page.screenshot({ path: 'example.png' });
  await sleep(15000);
  await page.click("#main");
  await page.focus("#display");
  await page.mouse.click(500, 500, { clickCount: 2 });

  await page.mouse.click(502,502, { button: 'right'
  }); 

  await sleep(5000);
  await page.keyboard.type("#display", 'F');
  console.log("F");
  let recorder = new PuppeteerScreenRecorder(page, Config);

  await recorder.start(name + ".mp4");
  console.log("recording for ", duration * 100);
  await sleep(duration * 100);
  console.log("done");
  let asdf = await recorder.stop();
  
  await page.mouse.click(501, 501, {
    button: 'right',
  }); 
  console.log("b again");
  await sleep(500);
  console.log("w");
  console.log("recording for ", duration * 100);

  recorder = new PuppeteerScreenRecorder(page);
  await recorder.start(name + "_w.mp4");
  await sleep(duration * 100);
  await recorder.stop();

  console.log("done");
  await page.close();
  await browser.close();
};

gather(thing);
const Config = {
  followNewTab: true,
  fps: 30,
  ffmpeg_Path: '/usr/bin/ffmpeg' || null,
  videoFrame: {
    width: 1920,
    height: 1080,
  },
  aspectRatio: '16:9',
};

async function sleep(ms) {

  await new Promise(r => setTimeout(r, ms));
}
