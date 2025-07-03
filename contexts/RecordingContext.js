import { transcribeAudio } from "@/private-core/whisper";
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

            if (!text || text.trim() === "") {
                setTranscript("No speech detected. Please try again.");
                return;
            }

            setTranscript(text);
            await saveMeal(text);
            // Only show feedback modal on successful meal processing
            setShowFeedback(true);
        } catch (error) {
            // Don't show feedback modal on errors - let ErrorBanner handle it
            setTranscript("Error processing recording. Please try again.");
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
