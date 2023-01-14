import { nanoid } from "nanoid";

export const UrlStore = {};

export const createShortenedUrl = (url: string) => {
  const hash = nanoid(10);
  UrlStore[hash] = url;

  return `http://localhost:3000/${hash}`;
};

export const getOriginalUrl = (hash: string) => {
  return UrlStore[hash];
};

export const getAllShortenedLinks = () => UrlStore;
