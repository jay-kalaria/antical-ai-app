import { transcribeAudio } from "@/utils/whisper";
import { AudioModule, RecordingPresets, useAudioRecorder } from "expo-audio";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useMeal } from "./MealContext";

const RecordingContext = createContext();

export function RecordingProvider({ children }) {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [transcript, setTranscript] = useState("");
    const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

    const record = async () => {
        await audioRecorder.prepareToRecordAsync();
        audioRecorder.record();
        setIsRecording(true);
    };

    const { saveMeal } = useMeal();

    const stopRecording = async () => {
        try {
            await audioRecorder.stop();
            setIsRecording(false);
            setIsProcessing(true);
            const recordingUri = audioRecorder.uri;
            const text = await transcribeAudio(recordingUri);
            setTranscript(text || "No speech detected. Please try again.");
            await saveMeal(text);
            setShowFeedback(true);
        } catch (error) {
            setTranscript("Error processing recording. Please try again.");
            setShowFeedback(true);
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        (async () => {
            const status = await AudioModule.requestRecordingPermissionsAsync();
            if (!status.granted) {
                Alert.alert("Permission to access microphone was denied");
            }
        })();
    }, []);

    return (
        <RecordingContext.Provider
            value={{
                isRecording,
                isProcessing,
                showFeedback,
                setShowFeedback,
                transcript,
                record,
                stopRecording,
            }}
        >
            {children}
        </RecordingContext.Provider>
    );
}

export function useRecording() {
    return useContext(RecordingContext);
}
