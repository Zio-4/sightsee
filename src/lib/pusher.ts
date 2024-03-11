import Pusher from 'pusher-js';
import { clientEnv } from '../env/schema.mjs';

const pusherInstance = new Pusher(clientEnv.NEXT_PUBLIC_PUSHER_APP_KEY!, {
  cluster: clientEnv.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
});

export default pusherInstance;