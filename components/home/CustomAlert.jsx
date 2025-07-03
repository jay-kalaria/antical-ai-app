import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

export default function CustomAlert({
    visible,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "OK",
    cancelText = "Cancel",
    showCancel = false,
}) {
    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <BlurView
                intensity={20}
                tint="dark"
                className="flex-1 justify-center px-6"
            >
                <View className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                    {/* Header */}
                    <View className="p-6 pb-4">
                        <View className="flex-row items-center mb-3">
                            <Ionicons
                                name="alert-circle-outline"
                                size={24}
                                color="#ef4444"
                                style={{ marginRight: 12 }}
                            />
                            <Text className="text-lg font-bold text-gray-900 flex-1">
                                {title}
                            </Text>
                        </View>
                        <Text className="text-gray-600 text-base leading-6">
                            {message}
                        </Text>
                    </View>

                    {/* Actions */}
                    <View className="border-t border-gray-100 flex-row">
                        {showCancel && (
                            <TouchableOpacity
                                onPress={onCancel}
                                className="flex-1 py-4 items-center border-r border-gray-100"
                                activeOpacity={0.7}
                            >
                                <Text className="text-gray-600 font-medium text-base">
                                    {cancelText}
                                </Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            onPress={onConfirm}
                            className={`${
                                showCancel ? "flex-1" : "w-full"
                            } py-4 items-center`}
                            activeOpacity={0.7}
                        >
                            <Text className="text-red-500 font-semibold text-base">
                                {confirmText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BlurView>
        </Modal>
    );
}
