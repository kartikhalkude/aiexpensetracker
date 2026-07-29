import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useExpenseStore } from '../../store/useExpenseStore';

export default function AIAssistantScreen() {
  const { darkMode, chatMessages, sendChatMessage } = useExpenseStore();
  const [queryInput, setQueryInput] = useState('');
  const [loading, setLoading] = useState(false);

  const bgStyle = darkMode ? 'bg-dark-bg' : 'bg-slate-50';
  const cardStyle = darkMode ? 'bg-dark-card border-dark-subtle' : 'bg-white border-slate-200';
  const textPrimary = darkMode ? 'text-white' : 'text-slate-900';
  const textSecondary = darkMode ? 'text-slate-400' : 'text-slate-500';

  const quickPrompts = [
    'How much did I spend on food?',
    'Can I spend another ₹5,000?',
    'Which category did I spend the most on?',
    'Show summary'
  ];

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || queryInput;
    if (!prompt.trim()) return;
    
    setQueryInput('');
    setLoading(true);
    await sendChatMessage(prompt);
    setLoading(false);
  };

  return (
    <SafeAreaView className={`flex-1 ${bgStyle}`}>
      {/* Top Bar */}
      <View className="px-4 pt-3 pb-3 flex-row items-center border-b border-slate-700/30">
        <View className="w-9 h-9 rounded-full bg-purple-600 justify-center items-center mr-3 shadow-sm">
          <Text className="text-white text-base">🤖</Text>
        </View>
        <View>
          <Text className={`text-lg font-bold ${textPrimary}`}>AI Financial Assistant</Text>
          <Text className="text-emerald-500 text-xs font-semibold">● Python NLP Engine Active</Text>
        </View>
      </View>

      {/* Suggested Quick Chips */}
      <View className="py-2.5 px-4 border-b border-slate-700/20">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {quickPrompts.map((chip, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => handleSend(chip)}
              className="bg-purple-500/10 border border-purple-500/30 px-3 py-1.5 rounded-full mr-2"
            >
              <Text className="text-purple-400 text-xs font-medium">{chip}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Chat Messages Area */}
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {chatMessages.map((msg) => (
          <View
            key={msg.id}
            className={`mb-4 max-w-[85%] ${
              msg.sender === 'user' ? 'self-end bg-indigo-600 rounded-2xl rounded-tr-none' : `${cardStyle} border rounded-2xl rounded-tl-none`
            } p-4 shadow-sm`}
          >
            <Text className={`text-sm leading-5 ${msg.sender === 'user' ? 'text-white font-medium' : textPrimary}`}>
              {msg.text}
            </Text>
            
            {msg.recommendation && (
              <View className="mt-2.5 pt-2 border-t border-purple-500/20">
                <Text className="text-purple-400 text-xs font-medium">💡 Tip: {msg.recommendation}</Text>
              </View>
            )}

            <Text className={`text-[10px] mt-1.5 ${msg.sender === 'user' ? 'text-indigo-200 text-right' : textSecondary}`}>
              {msg.timestamp}
            </Text>
          </View>
        ))}

        {loading && (
          <View className={`self-start ${cardStyle} border rounded-2xl rounded-tl-none p-4 mb-4 flex-row items-center`}>
            <ActivityIndicator size="small" color="#9966FF" />
            <Text className={`text-xs ${textSecondary} ml-2.5`}>Analyzing your finances...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input Box */}
      <View className={`p-4 border-t border-slate-700/30 ${darkMode ? 'bg-dark-card' : 'bg-white'}`}>
        <View className="flex-row items-center bg-slate-800/50 border border-slate-700 rounded-2xl px-3.5 py-1">
          <TextInput
            placeholder="Ask AI about your spending or budgets..."
            placeholderTextColor="#94A3B8"
            value={queryInput}
            onChangeText={setQueryInput}
            onSubmitEditing={() => handleSend()}
            className={`flex-1 py-2.5 text-sm ${textPrimary}`}
          />
          <TouchableOpacity
            onPress={() => handleSend()}
            disabled={loading}
            className="w-9 h-9 rounded-xl bg-purple-600 justify-center items-center ml-2"
          >
            <Text className="text-white font-bold text-sm">➔</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
