import axios from "@/libs/axios";
import echo from "@/libs/echo";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export const useAudio = () => {
    const router = useRouter();
    const [broadcastResponses, setBroadcastResponses] = useState([]);

    const csrf = () => axios.get('/sanctum/csrf-cookie');

    useEffect(() => {
        const channel = echo.channel('audio-summarise');

        channel.listen('AudioSummariseEvent', (e) => {
            // setBroadcastResponses(prevResponse => prevResponse + e.message)
            // if (e && typeof e === 'object' && 'response' in e) {
                setBroadcastResponses(prevResponses => {
                    const lastResponse = prevResponses[prevResponses.length - 1];
                    if (lastResponse !== e.message) {
                        return [...prevResponses, e.message];
                    }
                    return prevResponses;
                });
            // } else {
            //     console.error('Invalid broadcast response:', e);
            // }
        });

        return () => {
            echo.leaveChannel('audio-summarise');
        };
    }, []);


    const createAudio = async ({ setErrors, formData, setResponse }) => {
        try {
            await csrf();
            setErrors([]);

            await axios.post('/api/audio-summarise', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then(response => {
                // console.log(response.data.audio);
                setResponse(response.data.audio);
                // console.log(response);
            });
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            }
        }
    }

    return {
        createAudio,
        broadcastResponse: broadcastResponses.join(""),
    };
};
