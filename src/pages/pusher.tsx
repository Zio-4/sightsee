import React, { useEffect } from 'react'
import Pusher from 'pusher-js';
import axios from 'axios';


function pusher() {
    const [messages, setMessages] = React.useState([])
    const [input, setInput] = React.useState('')

    useEffect(() => {
        // Handle incoming messages from pusher
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
            // encrypted: true
        })
        
        const channel = pusher.subscribe('test-channel');
            channel.bind('test-updated', function(msg) {;
            // Handle the received data, update the messages state
            updateItineraryState(msg.data);
        });
    
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [])

    function updateItineraryState(data) {
        setMessages(messages => [...messages, data]);
    }

    function sendMessage() {
        axios.post('/api/pusher', {
            message: input
        });
    }

  return (
    <section className='flex justify-center align-middle w-full'>
        <div>
            <div className="chat chat-start">
                <div className="chat-bubble">It's over Anakin, <br/>I have the high ground.</div>
            </div>
            <div className="chat chat-end">
                {messages.length > 0 && messages.map((message, index) => {
                    return (
                        <p className="chat-bubble" key={index} >{message}</p>
                    )
                })}
            </div>
            <input onChange={(e) => setInput(e.target.value)} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
            <button className="btn btn-primary" onClick={sendMessage} >Send</button>
        </div>
    </section>
  )
}

export default pusher