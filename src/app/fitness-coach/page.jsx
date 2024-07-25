"use client"

import { useState } from "react";
import styles from "../page.module.css";
import { useFitness } from "@/hooks/useFitness";

const FitnessCoachPage = () => {
    const { createFitness, broadcastResponse } = useFitness();


    const [message, setMessage] = useState("");
    const [body, setBody] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitForm = async event => {
        event.preventDefault()

        if (isSubmitting) return;

        setBody((prevMessages) => [
        ...prevMessages,
        { type: "question", content: body },
        ]);

        setIsSubmitting(true);

        await createFitness({
        message,
        setErrors,
        })

        setMessage("")
        setIsSubmitting(false)

    }
    return (
        <>
            {broadcastResponse  && (
                <div className="mb-8 mt-6 min-h-[20px] text-message flex w-full flex-col items-end gap-2 whitespace-pre-wrap break-words [.text-message+&]:mt-5 overflow-x-auto">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Response:</h3>
                <div className="flex w-full flex-col gap-1 empty:hidden first:pt-[3px]">
                    <div className="markdown prose w-full break-words dark:prose-invert dark">
                    <p className="rounded-md bg-gray-100 p-4">{broadcastResponse}</p>
                    </div>
                </div>
                </div>
            )}
            <form onSubmit={submitForm}>
                <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <div className="col-span-full">
                    <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                        AI-Powered Fitness Coach
                    </label>
                    <div className="mt-2">
                        <textarea
                        id="message"
                        name="message"
                        value={message}
                        rows={3}
                        onChange={event => setMessage(event.target.value)}
                        className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        error={errors?.message}
                        />
                        <span
                            messages={errors.message}
                            className={styles.error}>
                            {errors.message}
                        </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-600">Enter details about fitness level you want to achieve.</p>
                    </div>
                </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    disabled={isSubmitting}
                    className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                    type="submit"
                >
                    {isSubmitting ? 'Sending...' : 'Send'}
                </button>
                </div>
            </form>

        </>
    )
}

export default FitnessCoachPage