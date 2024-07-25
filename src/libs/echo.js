import Echo from 'laravel-echo';

import Pusher from 'pusher-js';

if (typeof window !== "undefined") {
    window.Pusher = Pusher;
}
 
const echo  = new Echo({
    broadcaster: 'reverb',
    Pusher: Pusher,
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
    wsPort: process.env.NEXT_PUBLIC_REVERB_PORT,
    wssPort: process.env.NEXT_PUBLIC_REVERB_PORT,
    forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
});

export default echo