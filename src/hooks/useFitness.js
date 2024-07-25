import axios from "@/libs/axios";
import echo from "@/libs/echo";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export const useFitness = () => {
    const router = useRouter();
    const [broadcastResponses, setBroadcastResponses] = useState([]);

    const csrf = () => axios.get('/sanctum/csrf-cookie');

    useEffect(() => {
        const channel = echo.channel('fitness-coach');

        channel.listen('FitnessCoachUpdated', (e) => {
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
            echo.leaveChannel('fitness-coach');
        };
    }, []);


    const createFitness = async ({ setErrors, ...props }) => {
        try {
            await csrf();
            setErrors([]);

            await axios.get('/api/fitness-coach', {
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
    }

    return {
        createFitness,
        broadcastResponse: broadcastResponses,
    };
};
