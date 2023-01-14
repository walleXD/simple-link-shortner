import * as trpcExpress from "@trpc/server/adapters/express";
import createApp from "express";
import { appRouter as router } from "@/meta";
import { linkHandlerRouter } from "@/linkShortner";
import { expressHandler } from "trpc-playground/handlers/express";

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({ req, res });

const main = async () => {
  const app = createApp();

  const trpcApiEndpoint = "/api/trpc/v0";
  const playgroundEndpoint = "/trpc/v0/playground";

  app.use(
    trpcApiEndpoint,
    trpcExpress.createExpressMiddleware({
      router,
      createContext,
    })
  );

  app.use(
    playgroundEndpoint,
    await expressHandler({
      trpcApiEndpoint,
      playgroundEndpoint,
      router,
    })
  );

  app.use("/", linkHandlerRouter);

  app.listen(3000, () => {
    console.log("Server started at http://localhost:3000");
  });
};

main();
