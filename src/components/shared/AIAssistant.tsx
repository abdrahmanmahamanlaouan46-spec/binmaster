"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  X,
  Send,
  Sparkles,
  Trash2,
  Maximize2,
  Minimize2,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMarkdownRenderer } from "./ChatMarkdownRenderer";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  { emoji: "🔢", text: "Comment convertir 25 en binaire ?" },
  { emoji: "💻", text: "C'est quoi 11001 en décimal ?" },
  { emoji: "🤔", text: "Pourquoi les ordinateurs utilisent le binaire ?" },
  { emoji: "🧠", text: "Comment mémoriser les puissances de 2 ?" },
  { emoji: "📝", text: "Donne-moi un exercice facile" },
];

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: messageText };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur de connexion");
      }

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        role: "assistant",
        content:
          "Désolé, je rencontre un problème technique. 😔 Réessaie dans un instant !",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Chat window sizing — responsive
  const chatWidth = isExpanded
    ? "w-[calc(100vw-1.5rem)] sm:w-[560px]"
    : "w-[calc(100vw-1.5rem)] sm:w-[440px]";
  const chatHeight = isExpanded
    ? "max-h-[80vh]"
    : "max-h-[65vh]";

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-20 right-4 md:bottom-5 md:right-5 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
            aria-label="Ouvrir l'assistant IA"
          >
            <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
            {/* Notification pulse */}
            {messages.length === 0 && (
              <>
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[9px] text-white flex items-center justify-center font-bold animate-pulse">
                  1
                </span>
                <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
              </>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed bottom-16 md:bottom-5 right-2 md:right-5 z-50 ${chatWidth} ${chatHeight} flex flex-col`}
          >
            <div className="flex flex-col h-full shadow-2xl border border-border rounded-2xl overflow-hidden bg-background">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground shrink-0">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary-foreground/20 flex items-center justify-center ring-2 ring-primary-foreground/10">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-tight">BinBot</h3>
                    <p className="text-[10px] opacity-75 flex items-center gap-1">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                      Assistant IA pédagogique
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {messages.length > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearChat}
                      className="h-8 w-8 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/15 transition-colors"
                      title="Effacer la conversation"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="h-8 w-8 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/15 transition-colors"
                    title={isExpanded ? "Réduire" : "Agrandir"}
                  >
                    {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/15 transition-colors"
                    title="Fermer"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 scroll-smooth"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarGutter: "stable",
                }}
              >
                {/* Welcome state */}
                {messages.length === 0 && !isLoading && (
                  <div className="text-center py-4 px-2">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 shadow-sm">
                      <Bot className="h-7 w-7" />
                    </div>
                    <h4 className="font-bold text-base mb-1">
                      Salut ! Je suis BinBot 🤖
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4 max-w-[280px] mx-auto leading-relaxed">
                      Pose-moi tes questions sur le binaire, je suis là pour t'aider !
                    </p>

                    {/* Suggested questions */}
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mb-2">
                        Questions suggérées
                      </p>
                      {SUGGESTED_QUESTIONS.map((q, i) => (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * i }}
                          onClick={() => sendMessage(q.text)}
                          className="flex items-center gap-2.5 w-full text-left text-sm px-3.5 py-2.5 rounded-xl bg-muted/40 hover:bg-muted border border-transparent hover:border-border/60 transition-all duration-150 text-muted-foreground hover:text-foreground"
                        >
                          <span className="text-base shrink-0">{q.emoji}</span>
                          <span className="leading-snug">{q.text}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message bubbles */}
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {/* Bot avatar */}
                    {msg.role === "assistant" && (
                      <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2 mt-0.5 shrink-0">
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                    )}

                    <div
                      className={`${
                        msg.role === "user"
                          ? "max-w-[85%] bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5"
                          : "max-w-[92%] bg-muted/60 rounded-2xl rounded-bl-md px-4 py-2.5"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      ) : (
                        <ChatMarkdownRenderer content={msg.content} />
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2 mt-0.5 shrink-0">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                    <div className="bg-muted/60 rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex gap-1">
                          <span className="h-2 w-2 rounded-full bg-primary/50 animate-bounce [animation-delay:0ms]" />
                          <span className="h-2 w-2 rounded-full bg-primary/50 animate-bounce [animation-delay:150ms]" />
                          <span className="h-2 w-2 rounded-full bg-primary/50 animate-bounce [animation-delay:300ms]" />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          BinBot réfléchit...
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="px-3 py-3 border-t bg-background shrink-0">
                <div className="flex gap-2 items-end">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Pose ta question sur le binaire..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    className="text-sm h-11 rounded-xl bg-muted/30 border-border/50 focus:border-primary/50 transition-colors"
                  />
                  <Button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="h-11 w-11 shrink-0 rounded-xl transition-all"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
