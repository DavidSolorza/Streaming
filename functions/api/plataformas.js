import { PlatformD1Repository } from './repositories/PlatformD1Repository.js';
import { PlatformService } from './services/PlatformService.js';
import { PlatformController } from './controllers/PlatformController.js';

function createController(env) {
  if (!env.DB) throw { status: 500, code: 'D1_NOT_CONFIGURED', message: 'Base de datos Cloudflare D1 no vinculada.' };
  const repo = new PlatformD1Repository(env.DB);
  const service = new PlatformService(repo);
  return new PlatformController(service);
}

export async function onRequestGet(context) {
  try {
    return await createController(context.env).getPlatforms();
  } catch (err) {
    return new PlatformController().handleError(err);
  }
}

export async function onRequestPut(context) {
  try {
    return await createController(context.env).updatePlatform(context.request);
  } catch (err) {
    return new PlatformController().handleError(err);
  }
}

export async function onRequestPost(context) {
  return onRequestPut(context);
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: PlatformController.corsHeaders() });
}
