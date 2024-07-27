import axios from "axios";

  // Write API route to update activity
  // pass in the name of the event (itinerary-event-name) & channel
  // and the data to update the activity with
  // await triggerPusherEvent(channelName, 'itinerary-event-name', msg.data)

  // messaging system: we need to know what entitity
  // (itinerary, tripDay, activity) to update and how

  export async function triggerPusherEvent(channel: string, event: string, data: any) {
      const res = await axios.post('/api/pusher', {
        channel,
        event,
        data
      });

      console.log('pusher event response:', res)
  };