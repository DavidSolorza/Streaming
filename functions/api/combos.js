import { ComboD1Repository } from './repositories/ComboD1Repository.js';
import { ComboService } from './services/ComboService.js';
import { ComboController } from './controllers/ComboController.js';

function createController(env) {
  if (!env.DB) throw { status: 500, code: 'D1_NOT_CONFIGURED', message: 'Base de datos Cloudflare D1 no vinculada.' };
  const repo = new ComboD1Repository(env.DB);
  const service = new ComboService(repo);
  return new ComboController(service);
}

export async function onRequestGet(context) {
  try {
    return await createController(context.env).getCombos();
  } catch (err) {
    return new ComboController().handleError(err);
  }
}

export async function onRequestPut(context) {
  try {
    return await createController(context.env).updateCombo(context.request);
  } catch (err) {
    return new ComboController().handleError(err);
  }
}

export async function onRequestPost(context) {
  return onRequestPut(context);
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: ComboController.corsHeaders() });
}
