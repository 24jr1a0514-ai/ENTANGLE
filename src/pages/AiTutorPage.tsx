import React, { useState, useRef, useEffect } from 'react';

import { useAuth } from '../contexts/AuthContext';
import {
  fetchAiTutorResponse,
  getStoredApiKey,
  setStoredApiKey,
} from '../services/aiTutorService';
import { courses } from '../data/courses';
import type { ChatMessage } from '../services/aiTutorService';
import {
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Plus,
  MessageSquare,
  Key,
  X,
  ThumbsUp,
  ThumbsDown,
  Terminal,
  Cpu,
  Zap,
  ChevronDown,
} from 'lucide-react';

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  messages: ChatMessage[];
}

const FEATURED_SUGGESTIONS = [
  {
    title: 'Explain Bell States',
    subtitle: 'How two qubits become maximally entangled',
    icon: Zap,
    prompt: 'Explain Bell States and how two qubits become maximally entangled with Qiskit code.',
  },
  {
    title: 'Write a VQE Script',
    subtitle: 'Hybrid quantum-classical ground state energy',
    icon: Terminal,
    prompt: 'Write a Python Qiskit script for Variational Quantum Eigensolver (VQE).',
  },
  {
    title: 'Shor\'s RSA Threat',
    subtitle: 'How quantum computers factor large numbers',
    icon: Cpu,
    prompt: 'How does Shor\'s Factoring Algorithm work and why does it break RSA encryption?',
  },
  {
    title: 'Bloch Sphere & Gates',
    subtitle: 'Visualizing single-qubit rotations (Rx, Ry, Rz)',
    icon: Sparkles,
    prompt: 'Explain the Bloch Sphere geometry and how single-qubit rotation gates move state vectors.',
  },
];

export default function AiTutorPage() {
  const { userProfile } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeCourse = courses.find(c => c.id === userProfile?.activeCourseId);
  const courseTitle = activeCourse?.title || 'Course';
  const learningPath = userProfile?.learningPath || 'intermediate';

  // Chat Sessions History
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = sessionStorage.getItem('aiTutorSessions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing session storage', e);
      }
    }
    return [
      {
        id: 'session-1',
        title: 'New Conversation',
        timestamp: new Date(),
        messages: [
          {
            role: 'assistant',
            content: `Hello! I am your AI Learning Assistant. I am customized for your **${courseTitle}** course (${learningPath?.toUpperCase() || 'INTERMEDIATE'} level). Ask me anything about your course, request code snippets, or ask for practice questions!`,
          },
        ],
      },
    ];
  });
  
  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    return sessionStorage.getItem('aiTutorActiveSession') || 'session-1';
  });

  useEffect(() => {
    sessionStorage.setItem('aiTutorSessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    sessionStorage.setItem('aiTutorActiveSession', activeSessionId);
  }, [activeSessionId]);

  // Input & Generation State
  const [input, setInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>('Gemini 3.8 Flash (Quantum)');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // API Key Modal State
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [apiKeyInput, setApiKeyInput] = useState<string>(getStoredApiKey());
  const [hasApiKey, setHasApiKey] = useState<boolean>(!!getStoredApiKey());

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const messages = activeSession.messages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Handle New Chat
  const handleNewChat = () => {
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: 'New Quantum Chat',
      timestamp: new Date(),
      messages: [
        {
          role: 'assistant',
          content: `New session started! I am your AI Tutor. Ask me any question, request code snippets, or ask for practice questions for your **${courseTitle}** course (${learningPath?.toUpperCase() || 'INTERMEDIATE'} level).`,
        },
      ],
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newId);
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredApiKey(apiKeyInput);
    setHasApiKey(!!apiKeyInput.trim());
    setShowKeyModal(false);
  };

  // Text To Speech
  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const cleanText = text.replace(/[*#`$\\_]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyCode = (codeStr: string, codeId: string) => {
    navigator.clipboard.writeText(codeStr);
    setCopiedCodeId(codeId);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Submit Prompt to AI Service
  const handleSendPrompt = async (promptText: string) => {
    if (!promptText.trim() || isGenerating) return;

    const userMsg: ChatMessage = { role: 'user', content: promptText };
    const updatedMsgs = [...messages, userMsg];

    // Update session title if first user prompt
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          const newTitle = s.messages.length <= 1 ? promptText.slice(0, 30) + '...' : s.title;
          return { ...s, title: newTitle, messages: updatedMsgs };
        }
        return s;
      })
    );

    setInput('');
    setIsGenerating(true);

    // Add a placeholder thinking message
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...updatedMsgs, { role: 'assistant', content: '', isThinking: true }],
          };
        }
        return s;
      })
    );

    try {
      const responseText = await fetchAiTutorResponse(
        promptText,
        learningPath || 'intermediate',
        updatedMsgs,
        {
          selectedModel,
          userProfile: userProfile || undefined,
        }
      );

      // Typewriter Streaming
      let currentLen = 0;
      const stepSize = Math.max(2, Math.floor(responseText.length / 25));

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSessionId) {
            // Replace the 'isThinking' placeholder with the streaming message
            const msgs = [...s.messages];
            if (msgs.length > 0 && msgs[msgs.length - 1].isThinking) {
              msgs[msgs.length - 1] = { role: 'assistant', content: '', isStreaming: true };
            } else {
               msgs.push({ role: 'assistant', content: '', isStreaming: true });
            }
            return {
              ...s,
              messages: msgs,
            };
          }
          return s;
        })
      );

      const streamTimer = setInterval(() => {
        currentLen += stepSize;
        if (currentLen >= responseText.length) {
          clearInterval(streamTimer);
          setSessions((prev) =>
            prev.map((s) => {
              if (s.id === activeSessionId) {
                const msgs = [...s.messages];
                msgs[msgs.length - 1] = {
                  role: 'assistant',
                  content: responseText,
                  isStreaming: false,
                };
                return { ...s, messages: msgs };
              }
              return s;
            })
          );
          setIsGenerating(false);
        } else {
          setSessions((prev) =>
            prev.map((s) => {
              if (s.id === activeSessionId) {
                const msgs = [...s.messages];
                msgs[msgs.length - 1] = {
                  role: 'assistant',
                  content: responseText.slice(0, currentLen),
                  isStreaming: true,
                };
                return { ...s, messages: msgs };
              }
              return s;
            })
          );
        }
      }, 25);
    } catch (err) {
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              messages: [
                ...s.messages.filter(m => !m.isThinking), // Remove thinking placeholder
                { role: 'assistant', content: 'Apologies, AI engine timeout. Please try again.' },
              ],
            };
          }
          return s;
        })
      );
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendPrompt(input);
  };

  // Helper to render Gemini / ChatGPT style code blocks and markdown text
  const renderMessageContent = (content: string, msgIdx: number) => {
    const codeBlockRegex = /```(python|qasm|bash|javascript|text)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          val: content.substring(lastIndex, match.index),
        });
      }
      const lang = match[1] || 'code';
      const code = match[2];
      const codeId = `code-${msgIdx}-${match.index}`;
      parts.push({
        type: 'code',
        lang,
        code,
        id: codeId,
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        val: content.substring(lastIndex),
      });
    }

    return parts.map((part, pIdx) => {
      if (part.type === 'code') {
        return (
          <div
            key={pIdx}
            className="my-4 rounded-xl overflow-hidden border border-border bg-[#0d1117] shadow-xl font-mono text-xs"
          >
            <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border/60 text-muted-foreground">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-primary">
                {part.lang}
              </span>
              <button
                onClick={() => handleCopyCode(part.code || '', part.id || '')}
                className="flex items-center gap-1 hover:text-foreground transition-colors text-[11px]"
              >
                {copiedCodeId === part.id ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {copiedCodeId === part.id ? 'Copied' : 'Copy Code'}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-emerald-300 font-mono leading-relaxed">
              <code>{part.code}</code>
            </pre>
          </div>
        );
      }
      return (
        <span key={pIdx} className="whitespace-pre-line">
          {part.val}
        </span>
      );
    });
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] max-w-7xl mx-auto rounded-3xl overflow-hidden border border-border bg-card shadow-2xl">
      {/* LEFT SIDEBAR (ChatGPT / Gemini Style) */}
      <div className="hidden md:flex flex-col w-64 border-r border-border bg-muted/20 p-4 space-y-4">
        {/* New Chat Button */}
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground font-bold text-xs rounded-2xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 active:scale-95"
        >
          <span className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Chat
          </span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </button>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 mb-2">
            Recent {courseTitle} Conversations
          </div>
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSessionId(s.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors text-left truncate ${
                s.id === activeSessionId
                  ? 'bg-secondary text-foreground font-semibold border border-border/80'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0 text-primary" />
              <span className="truncate">{s.title}</span>
            </button>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="pt-3 border-t border-border space-y-2">
          <button
            onClick={() => setShowKeyModal(true)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              hasApiKey
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span className="truncate">{hasApiKey ? 'Gemini Key Active' : 'Set Gemini API Key'}</span>
          </button>
        </div>
      </div>

      {/* MAIN CHAT VIEWPORT (Gemini / ChatGPT Aesthetic) */}
      <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            {/* Model Pill Selector */}
            <div className="relative flex items-center gap-1.5 bg-secondary px-3.5 py-1.5 rounded-full border border-border text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-transparent text-foreground font-bold focus:outline-none cursor-pointer pr-1"
              >
                <option value="Gemini 3.8 Flash (Quantum)">Gemini 3.8 Flash ✦</option>
                <option value="ChatGPT-4o (Physics Engine)">ChatGPT-4o (Tutor)</option>
                <option value="Built-in Quantum Engine">Built-in Engine (Offline)</option>
              </select>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </div>

            <span className="text-xs text-muted-foreground hidden sm:inline-block">
              Course: <strong className="text-foreground">{courseTitle}</strong> | Level: <strong className="text-foreground capitalize">{learningPath}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNewChat}
              className="md:hidden p-2 rounded-xl bg-primary text-primary-foreground"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          {/* Welcome Screen (If fresh conversation) */}
          {messages.length <= 1 && (
            <div className="max-w-2xl mx-auto my-8 space-y-6 text-center animate-in fade-in">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-xl shadow-purple-500/20">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight quantum-text-gradient">
                  Your AI Learning Assistant
                </h1>
                <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                  Ask questions, debug code, or explore complex topics customized for your <strong>{courseTitle}</strong> course.
                </p>
              </div>

              {/* 4 Feature Suggestion Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-4">
                {FEATURED_SUGGESTIONS.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSendPrompt(item.prompt)}
                      className="p-4 rounded-2xl bg-card border border-border hover:border-primary/50 hover:bg-secondary/40 transition-all flex flex-col justify-between space-y-2 group shadow-sm"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                          {item.title}
                        </span>
                        <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {item.subtitle}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Conversation Bubbles */}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-3xl mx-auto flex gap-4 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 shrink-0 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white shadow-md">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div
                className={`group relative p-5 rounded-3xl text-sm leading-relaxed border shadow-md ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-none border-primary/40 max-w-[80%]'
                    : 'bg-card text-foreground rounded-tl-none border-border max-w-[90%] sm:max-w-[85%]'
                }`}
              >
                <div className="font-sans">
                  {msg.isThinking ? (
                    <div className="flex items-center gap-2 px-2 py-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  ) : (
                    renderMessageContent(msg.content, idx)
                  )}
                  {msg.isStreaming && (
                    <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse" />
                  )}
                </div>

                {/* Response Action Toolbar (Copy, Voice, Like, Dislike) */}
                {msg.role === 'assistant' && !msg.isStreaming && (
                  <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleCopyText(msg.content, idx)}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        {copiedIndex === idx ? 'Copied' : 'Copy'}
                      </button>

                      <button
                        onClick={() => handleSpeak(msg.content)}
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        {isSpeaking ? (
                          <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                        {isSpeaking ? 'Stop' : 'Read Aloud'}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground">
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground">
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 shrink-0 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                  U
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Gemini / ChatGPT Floating Input Bar */}
        <div className="p-4 bg-background border-t border-border max-w-4xl mx-auto w-full space-y-2">
          <form onSubmit={handleSubmit} className="relative flex items-end">
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim() && !isGenerating) {
                    handleSendPrompt(input);
                    e.currentTarget.style.height = 'auto';
                  }
                }
              }}
              disabled={isGenerating}
              placeholder="Ask your AI Tutor anything (e.g. 'Explain this line-by-line', 'Help me debug')..."
              rows={1}
              className="w-full pl-5 pr-14 py-4 bg-card border border-border/80 rounded-2xl text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-xl disabled:opacity-60 resize-none overflow-y-auto min-h-[52px]"
              style={{ maxHeight: '150px' }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isGenerating}
              className="absolute right-3 bottom-2.5 w-9 h-9 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-40 shadow-md shadow-primary/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[11px] text-center text-muted-foreground">
            Quantum AI Tutor may produce detailed physics calculations. Verify key QPU constraints & SDK parameters.
          </p>
        </div>
      </div>

      {/* GEMINI API KEY MODAL */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Key className="w-5 h-5 text-emerald-400" />
                Set Google Gemini API Key
              </h3>
              <button
                onClick={() => setShowKeyModal(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Paste your Google Gemini API Key below to enable 100% direct Gemini LLM inference. If left blank, the tutor uses its built-in Quantum AI Engine.
            </p>

            <form onSubmit={handleSaveApiKey} className="space-y-4">
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-mono focus:outline-none focus:border-primary"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setApiKeyInput('');
                    setStoredApiKey('');
                    setHasApiKey(false);
                    setShowKeyModal(false);
                  }}
                  className="px-4 py-2 text-xs font-semibold bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-xl transition-colors"
                >
                  Clear Key
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-all shadow-md shadow-primary/20"
                >
                  Save API Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
