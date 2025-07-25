import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BottomNav from '@/components/BottomNav';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'wanderoo';
  timestamp: Date;
}

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi there! I\'m Wanderoo, your kids activity planner companion. How can I help you plan some fun activities today?',
      sender: 'wanderoo',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate Wanderoo response
    setTimeout(() => {
      const responses = [
        "That sounds like a great activity idea! Let me suggest some fun variations for kids.",
        "I love that! Here are some creative ways to make it even more engaging for children.",
        "What a wonderful choice! I can help you plan the perfect activity session.",
        "Excellent! Let me share some tips to make this activity both fun and educational."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'wanderoo',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    // Here you would implement actual voice recognition
    // For now, just toggle the state
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-background sticky top-0 z-10">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <Avatar className="h-10 w-10">
          <AvatarImage src="/lovable-uploads/abf06300-5c97-429a-87e0-169a856dbd21.png" />
          <AvatarFallback className="bg-purple-100">W</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h2 className="font-semibold text-foreground">Wanderoo</h2>
          <p className="text-sm text-muted-foreground">Your kids activity planner</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex gap-2 max-w-[80%]">
              {message.sender === 'wanderoo' && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">W</AvatarFallback>
                </Avatar>
              )}
              
              <Card className={`p-3 ${
                message.sender === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                <p className="text-sm">{message.text}</p>
                <span className={`text-xs mt-1 block ${
                  message.sender === 'user' 
                    ? 'text-primary-foreground/70' 
                    : 'text-muted-foreground'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </Card>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-2">
              <Avatar className="h-8 w-8 mt-1">
                <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">W</AvatarFallback>
              </Avatar>
              <Card className="p-3 bg-muted">
                <p className="text-sm text-muted-foreground">Wanderoo is typing...</p>
              </Card>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-background">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything about kids activities..."
              className="pr-12"
            />
          </div>
          
          <Button
            variant={isListening ? "default" : "outline"}
            size="sm"
            onClick={toggleVoice}
            className={`px-3 ${isListening ? 'bg-red-500 hover:bg-red-600' : ''}`}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          
          <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {isListening && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Listening... Speak now
          </p>
        )}
      </div>
    </div>
  );
};

export default Chat;