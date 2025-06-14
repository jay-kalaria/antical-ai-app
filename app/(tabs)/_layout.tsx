import CaptureButton from "@/components/home/CaptureButton";
import Colors from "@/constants/Colors";
import { useRecording } from "@/contexts/RecordingContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function TabLayout() {
    const { isRecording, isProcessing, record, stopRecording } = useRecording();
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.gray[400],
                tabBarStyle: {
                    borderTopWidth: 0,
                    //borderTopColor: Colors.gray[200],
                    backgroundColor: Colors.white,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarItemStyle: {
                    paddingVertical: 4,
                },
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size, focused }) => (
                        <View>
                            <Ionicons
                                name={focused ? "home" : "home-outline"}
                                size={size}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: "History",
                    tabBarIcon: ({ color, size, focused }) => (
                        <View>
                            <Ionicons
                                name={focused ? "time" : "time-outline"}
                                size={size}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="capture"
                options={{
                    title: "Capture",
                    tabBarIcon: ({ color, size }) => (
                        <View
                            style={{
                                top: -45,
                                zIndex: 1,
                            }}
                        >
                            <CaptureButton
                                size={130}
                                isRecording={isRecording}
                                isProcessing={isProcessing}
                                onPress={
                                    isProcessing
                                        ? null
                                        : isRecording
                                        ? stopRecording
                                        : record
                                }
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    title: "Favourites",
                    tabBarIcon: ({ color, size, focused }) => (
                        <View>
                            <Ionicons
                                name={focused ? "heart" : "heart-outline"}
                                size={size}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size, focused }) => (
                        <View>
                            <Ionicons
                                name={focused ? "person" : "person-outline"}
                                size={size}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}
