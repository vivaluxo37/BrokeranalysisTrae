/**
 * AI Chatbot Component
 * 
 * Intelligent chatbot interface for broker recommendations and platform assistance
 * Integrates with AIGateway service and supports real-time streaming responses
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { ScrollArea } from "@/components/ui/scroll-area"; // Component not available
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Bot,
  Send,
  MessageCircle,
  Minimize2,
  Maximize2,
  RotateCcw,
  Loader2,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Shield,
  DollarSign,
  X
} from 'lucide-react';
import { useAIChatState } from '@/hooks/useHomepageState';
import { AIGateway } from '@/services/ai/AIGateway';
import { AIFallback } from '@/components/common/FallbackComponents';

interface AIChatbotProps {
  className?: string;
  variant?: 'floating' | 'embedded' | 'fullscreen';
  initialPrompts?: string[];
  onBrokerRecommendation?: (brokerIds: string[]) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  brokerRecommendations?: string[];
}

const DEFAULT_PROMPTS = [
  "What's the best broker for beginners?",
  "Compare crypto trading platforms",
  "Help me find a low-fee broker",
  "What should I know about forex trading?"
];

const BROKER_CONTEXT_PROMPT = `You are an expert broker analysis assistant for a cryptocurrency and forex trading platform. 
Your role is to help users find the best brokers based on their needs, provide trading education, and answer questions about our platform.

Key guidelines:
- Always provide accurate, helpful information about brokers and trading
- When recommending brokers, explain why they're suitable for the user's needs
- Include disclaimers that trading involves risk and this is not financial advice
- Be conversational but professional
- If you don't know something specific about a broker, say so
- Focus on helping users make informed decisions`;

export const AIChatbot: React.FC<AIChatbotProps> = ({
  className = '',
  variant = 'floating',
  initialPrompts = DEFAULT_PROMPTS,
  onBrokerRecommendation
}) => {
  const {
    currentChat,
    allMessages,
    updateChat,
    addTempMessage,
    saveMessage,
    clearChatHistory
  } = useAIChatState();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [aiGateway] = useState(() => new AIGateway());
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || currentChat.isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    // Add user message immediately
    addTempMessage(userMessage);
    setInputValue('');
    setError(null);
    updateChat({ isLoading: true });

    try {
      // Prepare messages for AI with context
      const messages = [
        { role: 'system' as const, content: BROKER_CONTEXT_PROMPT },
        ...allMessages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })),
        { role: 'user' as const, content: content.trim() }
      ];

      // Send to AI service with streaming
      const response = await aiGateway.chat(messages, {
        stream: true,
        temperature: 0.7,
        maxTokens: 1000
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date()
      };

      // Add assistant response
      addTempMessage(assistantMessage);
      
      // Save both messages to persistent storage
      saveMessage({ ...userMessage, context: currentChat.context });
      saveMessage({ ...assistantMessage, context: currentChat.context });
      
      // Check for broker recommendations in response
      const brokerMentions = extractBrokerRecommendations(response.content);
      if (brokerMentions.length > 0 && onBrokerRecommendation) {
        onBrokerRecommendation(brokerMentions);
      }
      
    } catch (error) {
      console.error('AI Chat Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to get AI response');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Please try again or contact support if the issue persists.",
        timestamp: new Date()
      };
      
      addTempMessage(errorMessage);
    } finally {
      updateChat({ isLoading: false });
    }
  }, [currentChat, allMessages, addTempMessage, saveMessage, updateChat, aiGateway, onBrokerRecommendation]);

  const handleRetry = useCallback(async () => {
    setIsRetrying(true);
    setError(null);
    
    // Retry the last user message if available
    const lastUserMessage = allMessages.filter(msg => msg.role === 'user').pop();
    if (lastUserMessage) {
      await sendMessage(lastUserMessage.content);
    }
    
    setIsRetrying(false);
  }, [allMessages, sendMessage]);

  const extractBrokerRecommendations = (content: string): string[] => {
    // Simple pattern matching for broker names - could be enhanced with NLP
    const brokerPatterns = [
      /\b(eToro|Binance|Coinbase|Kraken|Bitfinex|Bybit|OKX|KuCoin)\b/gi,
      /\b(Interactive Brokers|TD Ameritrade|E\*TRADE|Charles Schwab|Fidelity)\b/gi,
      /\b(MetaTrader|Plus500|AvaTrade|XM|FXCM|IG|CMC Markets)\b/gi
    ];
    
    const matches = new Set<string>();
    brokerPatterns.forEach(pattern => {
      const found = content.match(pattern);
      if (found) {
        found.forEach(match => matches.add(match.toLowerCase()));
      }
    });
    
    return Array.from(matches);
  };

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
    sendMessage(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.role === 'user';
    
    return (
      <div
        key={message.id}
        className={`flex gap-3 p-4 ${isUser ? 'justify-end' : 'justify-start'}`}
      >
        {!isUser && (
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
        
        <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
          <div
            className={`rounded-lg px-4 py-2 ${
              isUser
                ? 'bg-blue-600 text-white ml-auto'
                : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            {message.isStreaming && (
              <div className="flex items-center gap-1 mt-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span className="text-xs opacity-70">AI is typing...</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {message.brokerRecommendations && message.brokerRecommendations.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                Broker Recommendations
              </Badge>
            )}
          </div>
        </div>
        
        {isUser && (
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">U</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderFloatingButton = () => {
    if (variant !== 'floating') return null;
    
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 z-50"
        size="lg"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  };

  const renderChatInterface = () => {
    const isFloating = variant === 'floating';
    const isFullscreen = variant === 'fullscreen';
    
    const containerClasses = isFloating
      ? `fixed bottom-20 right-6 w-96 h-[500px] z-40 shadow-2xl ${
          isMinimized ? 'h-14' : 'h-[500px]'
        }`
      : isFullscreen
      ? 'w-full h-full'
      : 'w-full h-[600px]';

    return (
      <Card className={`${containerClasses} ${className} flex flex-col`}>
        <CardHeader className="flex-shrink-0 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-lg">AI Broker Assistant</CardTitle>
              <Badge variant="secondary" className="text-xs">
                Online
              </Badge>
            </div>
            
            <div className="flex items-center gap-1">
              {isFloating && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChatHistory}
                title="Clear chat history"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              
              {isFloating && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="flex-1 flex flex-col p-0">
              {error && (
                <Alert className="mx-4 mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error}
                    <Button
                      variant="link"
                      size="sm"
                      onClick={handleRetry}
                      disabled={isRetrying}
                      className="ml-2 p-0 h-auto"
                    >
                      {isRetrying ? 'Retrying...' : 'Try Again'}
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="flex-1 px-4 overflow-y-auto">
                {allMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <Bot className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Welcome to AI Broker Assistant!
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                      I can help you find the perfect broker, answer trading questions, and guide you through our platform.
                    </p>
                    
                    <div className="grid grid-cols-1 gap-2 w-full">
                      {initialPrompts.map((prompt, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handlePromptClick(prompt)}
                          className="text-left justify-start h-auto py-2 px-3"
                        >
                          <span className="text-xs">{prompt}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {allMessages.map(renderMessage)}
                    {currentChat.isLoading && (
                      <div className="flex gap-3 p-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">AI is thinking...</span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </CardContent>

            <div className="flex-shrink-0 p-4 border-t">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about brokers, trading, or our platform..."
                  disabled={currentChat.isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={() => sendMessage(inputValue)}
                  disabled={!inputValue.trim() || currentChat.isLoading}
                  size="sm"
                >
                  {currentChat.isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              <div className="flex items-center justify-center mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Powered by AI • Not financial advice
                </span>
              </div>
            </div>
          </>
        )}
      </Card>
    );
  };

  // Handle different variants
  if (variant === 'floating') {
    return (
      <>
        {!isOpen && renderFloatingButton()}
        {isOpen && renderChatInterface()}
      </>
    );
  }

  if (error && variant === 'embedded') {
    return (
      <AIFallback
        onRetry={handleRetry}
        isRetrying={isRetrying}
        errorMessage={error}
      />
    );
  }

  return renderChatInterface();
};

export default AIChatbot;