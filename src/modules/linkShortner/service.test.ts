import {
  createShortenedUrl,
  getOriginalUrl,
  getAllShortenedLinks,
  UrlStore,
} from "./service";

describe("createShortenedUrl", () => {
  it("should return a shortened url string", () => {
    const url = "https://www.google.com";
    const shortenedUrl = createShortenedUrl(url);
    expect(shortenedUrl).toEqual(
      expect.stringMatching(/http:\/\/localhost:3000\/\w{10}/)
    );
  });

  it("should store the original url in the UrlStore", () => {
    const url = "https://www.google.com";
    const shortenedUrl = createShortenedUrl(url);
    const hash = shortenedUrl.split("/")[3];
    expect(getOriginalUrl(hash)).toEqual(url);
  });
});

describe("getOriginalUrl", () => {
  it("should return the original url for the given hash", () => {
    const url = "https://www.google.com";
    const shortenedUrl = createShortenedUrl(url);
    const hash = shortenedUrl.split("/")[3];
    expect(getOriginalUrl(hash)).toEqual(url);
  });

  it("should return undefined for an invalid hash", () => {
    expect(getOriginalUrl("invalid")).toBeUndefined();
  });
});

describe("getAllShortedLinks", () => {
  it("should return the UrlStore object", () => {
    expect(getAllShortenedLinks()).toEqual(UrlStore);
  });
});
