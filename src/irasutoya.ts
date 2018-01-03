import * as cheerio from "cheerio";
import fetch from "node-fetch";

export class ImageDetail {
  constructor(
    public title: string,
    public imageUrl: string,
    public description: string
  ) {}
}

async function searchEntryUrls(query: string): Promise<string[]> {
  const url = `http://www.irasutoya.com/search?q=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const $ = cheerio.load(await res.text());
  return $(".boxim > a").map((i, e) => $(e).attr("href"));
}

async function fetchImageDetail(url: string): Promise<ImageDetail> {
  const entries = await fetch(url);
  const $ = cheerio.load(await entries.text());

  let detail = new ImageDetail(
    $(".title h2").text().trim(),
    $(".entry .separator a").attr("href"),
    $(".entry .separator").text().trim()
  );

  return detail;
}

export async function searchImage(query: string): Promise<ImageDetail> {
  try {
    const urls = await searchEntryUrls(query);
    if (urls.length === 0) {
      throw new Error("Not found");
    }

    const entryUrl = urls[Math.floor(Math.random() * urls.length)];
    const imageDetail = await fetchImageDetail(entryUrl);
    console.log(imageDetail);

    return imageDetail;
  } catch (error) {
    console.log(error);
  }
}
