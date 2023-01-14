import { router, publicProcedure } from "@/meta/trpc";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { Router, Response, Request } from "express";
import {
  createShortenedUrl,
  getAllShortenedLinks,
  getOriginalUrl,
} from "./service";

export const linkHandlerRouter = Router().get(
  "/:hash",
  (req: Request, res: Response) => {
    const { hash } = req.params;
    const originalUrl = getOriginalUrl(hash);

    if (originalUrl) {
      res.redirect(originalUrl);
    } else {
      res.status(404).send("Shortened URL not found");
    }
  }
);

export const linkShortnerRouter = router({
  getAllShortedLinks: publicProcedure.query(async () => {
    return getAllShortenedLinks();
  }),
  getOriginalUrl: publicProcedure
    .input(
      z.object({
        hash: z.string(),
      })
    )
    .output(z.string({ invalid_type_error: "No URL found" }).url())
    .query(({ input }) => {
      const res = getOriginalUrl(input.hash);

      if (!res)
        return new TRPCError({ code: "BAD_REQUEST", message: "No URL found" });

      return res;
    }),
  createShortenedLink: publicProcedure
    .input(
      z.object({
        link: z.string().url(),
      })
    )
    .output(z.string().url())
    .mutation(({ input }) => {
      return createShortenedUrl(input.link);
    }),
});
