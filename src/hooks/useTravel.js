import axios from "@/libs/axios";
import echo from "@/libs/echo";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export const useTravel = () => {
    const router = useRouter();
    const [broadcastResponses, setBroadcastResponses] = useState([]);

    const csrf = () => axios.get('/sanctum/csrf-cookie');

    useEffect(() => {
        const channel = echo.channel('travel');

        channel.listen('TravelResponseUpdated', (e) => {
            if (e && typeof e === 'object' && 'response' in e) {
                setBroadcastResponses(prevResponses => {
                    const lastResponse = prevResponses[prevResponses.length - 1];
                    if (lastResponse !== e.response) {
                        return [...prevResponses, e.response];
                    }
                    return prevResponses;
                });
            } else {
                console.error('Invalid broadcast response:', e);
            }
        });

        return () => {
            echo.leaveChannel('travel');
        };
    }, []);

    const createTravel = async ({ setErrors, ...props }) => {
        try {
            await csrf();
            setErrors([]);

            await axios.get('/api/travel-assistant', {
                params: {
                    message: props.message,
                }
            }).then(response => {
                console.log(response);
            });
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            }
        }
    };

    return {
        createTravel,
        broadcastResponse: broadcastResponses.join(" "),
    };
};
