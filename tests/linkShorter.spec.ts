import { appRouter } from "../src/modules/meta";
import { linkHandlerRouter } from "@/linkShortner/router";
import { createShortenedUrl } from "@/linkShortner/service";
import request from "supertest";
import createApp from "express";

describe("linkShorter", () => {
  describe("trpc", () => {
    const client = appRouter.createCaller({});

    const link = "https://www.google.com";
    let hash = "";

    it("should return a shortened url string", async () => {
      const res = await client.linkShortner.createShortenedLink({
        link,
      });
      hash = res.split("/")[3];
      expect(res).toEqual(
        expect.stringMatching(/http:\/\/localhost:3000\/\w{10}/)
      );
    });

    it("should return the original url from hash", async () => {
      const res = await client.linkShortner.getOriginalUrl({
        hash,
      });

      expect(res).toEqual(link);
    });
  });

  describe("express", () => {
    describe("GET /:hash", () => {
      const app = createApp();
      app.use("/", linkHandlerRouter);

      it("should redirect to the original URL if the hash is valid", async () => {
        const originalUrl = "https://www.google.com";
        const shortenedUrl = createShortenedUrl(originalUrl);
        const hash = shortenedUrl.split("/")[3];
        const response = await request(app).get(`/${hash}`);

        expect(response.status).toEqual(302);
        expect(response.header.location).toEqual(originalUrl);
      });

      it("should return a 404 status if the hash is invalid", async () => {
        const response = await request(app).get("/invalid");

        expect(response.status).toEqual(404);
        expect(response.text).toEqual("Shortened URL not found");
      });
    });
  });
});
