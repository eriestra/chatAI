import React, { useState } from 'react';
import { Send, MessageSquare, ShoppingBag, PenTool, Code } from 'lucide-react';
import axios from 'axios';

const QuickAction = ({ icon: Icon, text, onClick }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
  >
    <Icon className="mb-2 text-gray-500" size={24} />
    <span className="text-sm text-gray-700 text-center">{text}</span>
  </button>
);

const Chat = () => {
  const [input, setInput] = useState('');
  const [currentMessage, setCurrentMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendMessage(input);
  };

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    setCurrentMessage({ question: text, answer: '' });

    try {
      const response = await axios.post('http://127.0.0.1:5000/chat', { message: text });
      setCurrentMessage(prev => ({ ...prev, answer: response.data.response }));
    } catch (error) {
      console.error('Error:', error);
      setCurrentMessage(prev => ({ ...prev, answer: "Sorry, there was an error processing your request." }));
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const quickActions = [
    { icon: MessageSquare, text: "Explain quantum computing in simple terms" },
    { icon: ShoppingBag, text: "Suggest a professional outfit for a job interview" },
    { icon: PenTool, text: "Write a friendly invitation to a wedding" },
    { icon: Code, text: "Create a Python script for daily email reports" }
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Quick action buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border-b">
          {quickActions.map((action, index) => (
            <QuickAction
              key={index}
              icon={action.icon}
              text={action.text}
              onClick={() => sendMessage(action.text)}
            />
          ))}
        </div>

        {/* Chat message area */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {currentMessage && (
            <>
              <div className="flex justify-end">
                <div className="max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 bg-blue-500 text-white">
                  {currentMessage.question}
                </div>
              </div>
              {!isLoading && currentMessage.answer && (
                <div className="flex justify-start">
                  <div className="max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 bg-gray-100">
                    {currentMessage.answer}
                  </div>
                </div>
              )}
            </>
          )}
          {isLoading && (
            <div className="flex justify-center">
              <div className="loader">Loading...</div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border border-gray-300 rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Message ChatAI..."
            />
            <button 
              type="submit" 
              className="bg-white border border-gray-300 border-l-0 rounded-r-md p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <Send size={20} className="text-gray-500" />
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center p-2 text-sm text-gray-500">
          ChatAI can make mistakes. Check important info.
        </div>
      </div>
    </div>
  );
};

export default Chat;