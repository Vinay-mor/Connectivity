import { credentialRouter } from '@/features/credentials/server/routers';
import { createTRPCRouter } from '../init';
import { workflowsRouter } from '@/features/workflows/server/routers';
import { executionsRouter } from '@/features/executions/server/routers';
export const appRouter = createTRPCRouter({
  workflows:workflowsRouter,
  credentials:credentialRouter,
  executions:executionsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;