import * as cheerio from "cheerio";

export class SummaryResuponse {
  constructor(
    public totalResults: number,
    public imageDetails: ImageDetail[]
  ) {}

  static parseJson(json: any): SummaryResuponse {
    return new SummaryResuponse(
      +json.feed.openSearch$totalResults.$t,
      json.feed.entry ? json.feed.entry.map((e, i) => ImageDetail.parseJsonEntry(e)) : []
    );
  }
}

export class ImageDetail {
  constructor(
    public title: string,
    public imageUrl: string,
    public description: string,
    public categories: string[]
  ) {}

  static parseJsonEntry(entry: any): ImageDetail {
    return new ImageDetail(
      entry.title.$t,
      entry.media$thumbnail.url.replace("/s72-c/", "/"),
      entry.summary.$t,
      entry.category.map((e, i) => e.term)
    );
  }

  static __parseJsonEntryForDefault(entry: any): ImageDetail {
    const $ = cheerio.load(entry.content.$t, {xmlMode: true});
    return new ImageDetail(
      entry.title.$t,
      $("img").attr("src"),
      $("div").last().text(),
      entry.category.map((e, i) => e.term)
    );
  }
}
