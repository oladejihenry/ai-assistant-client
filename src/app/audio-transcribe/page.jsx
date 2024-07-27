"use client"

import { useState } from "react";
import styles from "../page.module.css";
import { useAudio } from "@/hooks/useAudio";
import { FilePond, registerPlugin } from "react-filepond";
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import axios from "@/libs/axios";

registerPlugin(FilePondPluginFileValidateType);

const AudioSummarisePage = () => {
    
    const { createAudio, broadcastResponse } = useAudio();

    const [audio, setAudio] = useState([]);
    const [body, setBody] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [response , setResponse] = useState("");

    const handleFileChange = (event) => {
        setAudio(event.target.files[0]);
    }

    async function handleAudioUpload(fieldName, file, metadata, load, error, progress, abort, transfer, options) {
        const formData = new FormData();
        formData.append(fieldName, file, file.name);

        await axios.post('/api/audio-process', formData, {

            onUploadProgress: (progressEvent) => {
                progress(true, progressEvent.loaded, progressEvent.total);
            }
        })
        .then(response => {
            // Handle successful upload
            load(response.data.url);

            return response.data.url
        })
        .catch(err => {
            if (axios.isCancel(err)) {
                // Upload cancelled
                console.log('Upload cancelled');
            } else {
                error('Upload failed');
            }
        });

        return {
            abort: () => {
         
                abort();
            }
        };
    }

    const submitForm = async event => {
        event.preventDefault()

        if (isSubmitting) return;

        setBody((prevMessages) => [
        ...prevMessages,
        { type: "question", content: body },
        ]);

        setIsSubmitting(true);

        const audioData = audio[0]?.serverId;

        await createAudio({
            audio: audioData,
            setErrors,
            setResponse
        })

        setAudio("")
        setIsSubmitting(false)

    }

    
    return (
        <>
            {response && (
                <div className="mb-8">
                    <audio controls autoPlay>
                        <source src={response} type="audio/mpeg" />
                    </audio>
                </div>
            )}

            
                <div className="mb-8 mt-6 min-h-[20px] text-message flex w-full flex-col items-end gap-2 whitespace-pre-wrap break-words [.text-message+&]:mt-5 overflow-x-auto">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Audio Transcribe:</h3>
                    <div className="flex w-full flex-col gap-1 empty:hidden first:pt-[3px]">
                        {broadcastResponse  && (
                            <div className="markdown prose w-full break-words dark:prose-invert dark">
                                <p className="rounded-md bg-gray-100 p-4">{broadcastResponse}</p>
                            </div>
                        )}
                    </div>
                </div>
            
            <form onSubmit={submitForm}>
                <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <div className="col-span-full">
                    <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                        Audio Transcribe
                    </label>
                    <div className="mt-2">
                        <FilePond
                            acceptedFileTypes={["audio/mpeg"]}
                            files={audio}
                            onupdatefiles={setAudio}
                            name="audio"
                            maxFiles={1}
                            instantUpload={true}
                            server={{
                                process:(fieldName, file, metadata, load, error, progress, abort) => {
                                    handleAudioUpload(fieldName, file, metadata, load, error, progress, abort);
                                } 
                            }}
                        />
                        <span
                            messages={errors.audio}
                            className={styles.error}>
                            {errors.audio}
                        </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-600">Choose audio (mp3) to transcribe.</p>
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

export default AudioSummarisePage