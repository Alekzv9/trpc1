import express from 'express';
import * as trpc from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import cors from 'cors';
import { z } from 'zod';

type Message = {
  username: string;
  message: string;
};

const messages: Array<Message> = [
  { username: 'Jon Snow', message: 'King in the noth' },
  { username: 'Greyjoy', message: 'Oh no my cock' },
];

const appRouter = trpc
  .router()
  .query('hello-world', {
    resolve: () => {
      return 'hello world';
    },
  })
  .query('fetch-messages', {
    input: z.number().default(10),
    resolve: ({ input }) => {
      return messages.slice(-input);
    },
  })
  .mutation('post-message', {
    input: z.object({
      username: z.string(),
      message: z.string().min(1),
    }),
    resolve: ({ input }) => {
      messages.push(input);
    },
  });
export type AppRouter = typeof appRouter;
const app = express();
app.use(cors());
const port = 8080;

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: () => null,
  })
);

app.get('/', (req, res) => {
  res.send('hello world');
});

app.listen(port, () => {
  console.log(`server listening in port: ${port}`);
});
