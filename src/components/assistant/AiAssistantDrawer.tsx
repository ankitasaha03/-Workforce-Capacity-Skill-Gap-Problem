'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Brain,
  Sparkles,
  X,
  Send,
  PlayCircle,
  RotateCcw,
  Bot,
  User,
  Copy,
  Check,
  ChevronRight,
  TrendingUp,
  FileText,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChatMessage, SimulationDiff } from '@/types';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerSimulation: (title: string, diff: SimulationDiff) => void;
}

const PRESET_PROMPTS = [
  'Simulate impact if 5 React devs are reassigned to AI initiatives',
  'Show top 3 skill risks for Q4 deliverables',
  'Generate job description for Senior MLOps Engineer',
  'How can we reduce the $1.4M external hiring budget?',
  'Identify candidates for Kubernetes & Platform Engineering upskilling',
];

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  onTriggerSimulation,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: "Hello! I am **WorkforceIQ Copilot**, your real-time workforce allocation and skill gap intelligence partner. I can simulate team reassignments, analyze project delay bottlenecks, generate role specifications, and craft upskilling pathways.",
      timestamp: 'Just now',
      suggestions: [
        'Simulate impact if 5 React devs are reassigned to AI initiatives',
        'Show top 3 skill risks for Q4 deliverables',
        'Generate job description for Senior MLOps Engineer',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = (userText: string) => {
    if (!userText.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate intelligent synthesis response
    setTimeout(() => {
      let botResponse: ChatMessage;

      const lower = userText.toLowerCase();

      if (lower.includes('react') && (lower.includes('reassigned') || lower.includes('ai'))) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: `**Simulation Prepared: React Frontend Developers -> AI Copilot Squad**\n\nI analyzed our engineering roster and identified **5 frontend developers** with strong TypeScript and API streaming experience (including Jessica Williams and Aiden Chen's squad) currently assigned to lower-priority maintenance tracks.\n\n### Impact Forecast:\n- **Skill Match Index:** Increases by **+4.8%** across Engineering & AI squads.\n- **Mobile AI Release:** Accelerated by **3.5 weeks**.\n- **Hiring Avoidance:** Avoids recruiting 3 contract frontend AI engineers (~$280k saved).\n\nClick below to apply this scenario live to your dashboard:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          simulationData: {
            title: 'Scenario: 5 React Developers Reallocated to AI Squad',
            diff: {
              skillMatchDelta: 4.8,
              gapsDelta: -4,
              projectDelayRiskDelta: -7.5,
              costSavedDelta: 280000,
              efficiencyGainDelta: 6.2,
              details: [
                'Accelerates customer AI agent frontend release',
                'Zero new head-count approval needed',
                'Provides high-growth career path for frontend engineers',
              ],
            },
          },
          suggestions: [
            'Who are the specific 5 engineers recommended for this?',
            'What training courses should they complete in week 1?',
          ],
        };
      } else if (lower.includes('top 3') || lower.includes('skill risks') || lower.includes('q4')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: `### Top 3 Skill Risks Threatening Q4 Deliverables:\n\n1. **LLM Fine-Tuning & RAG (AI/ML):**\n   - Current Deficit: **18 unfilled FTE slots**.\n   - Impact: 2 Tier-1 generative enterprise copilot projects at high risk of 6-week delay.\n   - Action: Launch 6-week internal cohort + fast-track 2 staff research hires.\n\n2. **Quantum-Safe Cryptography (Cyber Security):**\n   - Current Deficit: **6 unfilled FTE slots**.\n   - Impact: May miss FedRAMP High enterprise contract qualification deadline.\n   - Action: External hiring priority (NIST Kyber / Dilithium specialists).\n\n3. **Kubernetes Platform Engineering (Cloud):**\n   - Current Deficit: **10 unfilled FTE slots**.\n   - Impact: Q3 Cloud Migration bottleneck; lead architect Maya Patel at 104% burnout risk.\n   - Action: Immediate internal reallocation of 3 DevOps engineers from Project Alpha.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: [
            'Simulate reallocating 3 DevOps engineers to solve Risk #3',
            'Draft job description for Quantum Security Specialist',
          ],
        };
      } else if (lower.includes('job description') || lower.includes('mlops')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: `Here is the tailored Job Description for **Senior MLOps Engineer**, calibrated against our current AI infrastructure stack:\n\n---\n**Role:** Senior MLOps Engineer\n**Team:** AI Infrastructure & Platform Engineering\n**Location:** Hybrid / Remote\n\n**Key Responsibilities:**\n- Architect and maintain distributed LLM inference clusters using vLLM, Triton, and Ray.\n- Build continuous evaluation & guardrail pipelines for RAG vector databases (Milvus / Pinecone).\n- Collaborate with AI Research Scientists to containerize and deploy quantized model weights with sub-150ms TTFT (Time To First Token).\n\n**Required Qualifications:**\n- 5+ years experience in Python, Kubernetes, and GPU orchestration.\n- Hands-on expertise with PyTorch, Triton Inference Server, and Helm.\n- Experience managing enterprise cloud infrastructure (GCP / AWS) via Terraform.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: [
            'Check internal employees who match >70% of this role',
            'How much does this role typically cost in our compensation band?',
          ],
        };
      } else if (lower.includes('reduce') || lower.includes('hiring budget') || lower.includes('1.4m')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: `### Strategy to Cut External Hiring Budget by up to 65% ($910k+ Saved):\n\n- **Step 1: Upskill Adjacent Talent ($640k saved)**\n  Run an accelerated 6-week GenAI upskilling cohort for 12 existing Senior Backend Engineers instead of paying recruitment bounties for 12 external AI engineers.\n\n- **Step 2: Internal Reallocation ($270k saved)**\n  Transition 3 DevOps engineers off winding-down legacy initiatives to resolve the Cloud Migration bottleneck.\n\n- **Step 3: Direct Hire Exclusively for Hyper-Niche Roles ($400k remaining)**\n  Limit external search strictly to 2 Lead Quantum Cryptographers and 1 Principal Inference Architect where internal upskilling exceeds 9 months.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: [
            'Launch 6-week GenAI Upskilling Pathway for 12 Backend Developers',
            'Show internal talent pool for GenAI upskilling',
          ],
        };
      } else {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: `I've analyzed our enterprise workforce database regarding **"${userText}"**.\n\nBased on real-time capacity and verified skill badges across our 5 departments:\n- **Skill Availability:** Currently 78.4% aligned with upcoming product roadmaps.\n- **Immediate Opportunity:** 24 team members are currently underutilized (<75% capacity) and possess adjacent skills suitable for strategic reallocation.\n- **Recommendation:** Initiating targeted internal mobility routes yields an estimated **$1.42M** in hiring cost avoidance.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: [
            'Simulate impact if 5 React devs are reassigned to AI initiatives',
            'Show top 3 skill risks for Q4 deliverables',
          ],
        };
      }

      setIsTyping(false);
      setMessages((prev) => [...prev, botResponse]);
    }, 900);
  };

  return (
    <>
      {/* Drawer Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Slide-over Drawer Panel */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[440px] bg-slate-900/95 backdrop-blur-2xl border-l border-slate-800 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 px-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white">WorkforceIQ Copilot</h3>
                <Badge variant="purple" size="sm" className="text-[10px]">
                  Online
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400">Context-Aware Strategic Workforce AI</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isBot = msg.sender === 'assistant';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                    isBot
                      ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-sm'
                      : 'bg-slate-700 text-slate-200'
                  }`}
                >
                  {isBot ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`relative max-w-[85%] rounded-2xl p-3.5 text-xs ${
                    isBot
                      ? 'bg-slate-800/90 text-slate-200 border border-slate-700/80 shadow-md'
                      : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  }`}
                >
                  {/* Message Text with simple formatting */}
                  <div className="prose prose-invert prose-xs leading-relaxed space-y-2 whitespace-pre-wrap">
                    {msg.text}
                  </div>

                  {/* If message includes Simulation Data button */}
                  {msg.simulationData && (
                    <div className="mt-3 p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/40">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span className="font-semibold text-white text-[11px]">
                          {msg.simulationData.title}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-300 mb-2">
                        Projected Impact: Skill Match +{msg.simulationData.diff.skillMatchDelta}%, Delay Risk {msg.simulationData.diff.projectDelayRiskDelta}%
                      </p>
                      <Button
                        variant="ai"
                        size="sm"
                        onClick={() => {
                          if (msg.simulationData) {
                            onTriggerSimulation(
                              msg.simulationData.title,
                              msg.simulationData.diff
                            );
                          }
                        }}
                        className="w-full text-xs gap-1.5"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        Apply Live Dashboard Simulation
                      </Button>
                    </div>
                  )}

                  {/* Copy Button & Timestamp */}
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-700/40">
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3 items-center">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Suggested Prompts Pills */}
        <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/40">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            Preset Scenario Prompts:
          </p>
          <div className="flex flex-col gap-1.5">
            {PRESET_PROMPTS.slice(0, 3).map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="text-left text-[11px] text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 p-2 rounded-lg transition-all flex items-center justify-between cursor-pointer group"
              >
                <span className="truncate">{prompt}</span>
                <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 shrink-0 ml-1" />
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything or simulate a workforce change..."
              className="flex-1 h-10 px-3.5 text-xs bg-slate-900 text-slate-200 placeholder-slate-500 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/40"
            />
            <Button
              type="submit"
              variant="primary"
              size="icon"
              disabled={!input.trim() || isTyping}
              className="h-10 w-10 shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </aside>
    </>
  );
};
