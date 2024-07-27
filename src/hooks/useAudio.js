import axios from "@/libs/axios";
import echo from "@/libs/echo";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export const useAudio = () => {
    const router = useRouter();
    const [broadcastResponses, setBroadcastResponses] = useState([]);

    const csrf = () => axios.get('/sanctum/csrf-cookie');

    useEffect(() => {
        const channel = echo.channel('audio-transcribe');

        channel.listen('AudioTranscribeEvent', (e) => {

            setBroadcastResponses(prevResponses => {
                const lastResponse = prevResponses[prevResponses.length - 1];
                if (lastResponse !== e.message) {
                    return [...prevResponses, e.message];
                }
                return prevResponses;
            });
        });

        return () => {
            echo.leaveChannel('audio-transcribe');
        };
    }, []);


    const createAudio = async ({ setErrors,setResponse, ...props  }) => {
        try {
            await csrf();
            setErrors([]);
            
            await axios.post('/api/audio-transcribe', props)
            .then(response => {
                setResponse(response.data.audio);
            });
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            }
        }
    }

    return {
        createAudio,
        broadcastResponse: broadcastResponses,
    };
};
