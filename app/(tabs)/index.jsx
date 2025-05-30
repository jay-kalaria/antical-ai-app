import FeedbackModal from "@/components/home/FeedbackModal";
import InsightsPanel from "@/components/home/InsightsPanel";
import MealGauge from "@/components/home/MealGauge";
import RecentlyAdded from "@/components/home/RecentlyAdded";
import { useMeal } from "@/contexts/MealContext";
import { useRecording } from "@/contexts/RecordingContext";
import { mockTips } from "@/utils/archive/mockData_old";
import { AudioModule } from "expo-audio";
import React, { useEffect } from "react";
import { Alert, SafeAreaView, TouchableOpacity, View } from "react-native";
import "../../global.css";

export default function HomeScreen() {
    const todaysTips = mockTips.slice(0, 3);

    const {
        transcript,
        setTranscript,
        mealScore,
        cycleMealScore,
        isProcessing,
        saveMeal,
        getMealMetrics,
        setMealData,
    } = useMeal();

    // Use only recording context for recording state
    const {
        showFeedback,
        setShowFeedback,
        isRecording,
        record,
        stopRecording,
    } = useRecording();

    useEffect(() => {
        (async () => {
            const status = await AudioModule.requestRecordingPermissionsAsync();
            if (!status.granted) {
                Alert.alert("Permission to access microphone was denied");
            }
        })();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-gray-50 ">
            {/* <View className="p-2 items-center">
                <Text className="text-3xl font-semibold text-primary">
                    Hello Max, ready to score?
                </Text>
            </View> */}
            <View className="flex-1 items-center justify-end">
                <RecentlyAdded />
                {/* If you want to show the CaptureButton here, use only context state/handlers */}
                {/*
                <CaptureButton
                    onPress={isProcessing ? null : isRecording ? stopRecording : record}
                    size={240}
                    isRecording={isRecording}
                    isProcessing={isProcessing}
                />
                */}
                <TouchableOpacity onPress={cycleMealScore} activeOpacity={0.8}>
                    {/* <AvocadoRing size={230} /> */}
                    <MealGauge />
                </TouchableOpacity>
                <View className="w-full bg-white rounded-t-3xl shadow-lg pt-4 pb-14 px-2">
                    <InsightsPanel tips={todaysTips} />
                </View>
            </View>
            <FeedbackModal
                visible={showFeedback}
                tip={null}
                onClose={() => setShowFeedback(false)}
                onEdit={() => setShowFeedback(false)}
            />
        </SafeAreaView>
    );
}
