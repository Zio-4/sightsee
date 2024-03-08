import Pusher from 'pusher-js';
import { clientEnv } from '../env/schema.mjs';

console.log('client env in file', clientEnv)
console.log('Client env in instance file:', clientEnv.NEXT_PUBLIC_PUSHER_APP_KEY)
console.log('Client env in instance file:', clientEnv.NEXT_PUBLIC_PUSHER_APP_CLUSTER!)
const pusherInstance = new Pusher(clientEnv.NEXT_PUBLIC_PUSHER_APP_KEY!, {
  cluster: clientEnv.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
});

export default pusherInstance;