import { useState, useEffect, useRef } from 'react';
import { Send, Trash2, Bot, User, Loader2 } from 'lucide-react';
import { useAuth, apiCall } from '../lib/store';
import toast from 'react-hot-toast';

interface Message { role: 'user' | 'assistant'; content: string; created_at?: string; }

const suggestions = [
  'React에서 상태관리 어떻게 해요?',
  'MySQL JOIN 쿼리 예시 알려줘',
  '포트폴리오 만들 때 뭐가 중요해요?',
  'TypeScript interface vs type 차이',
  '기말고사 준비 어떻게 하면 좋을까요?',
];

function MsgBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display:'flex', gap:10, marginBottom:16, flexDirection: isUser?'row-reverse':'row' }}>
      <div style={{ width:32, height:32, borderRadius:'50%', background: isUser?'#1d4ed8':'#f0fdf4', border:`1.5px solid ${isUser?'#3b82f6':'#bbf7d0'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        {isUser ? <User size={16} color="#fff"/> : <Bot size={16} color="#16a34a"/>}
      </div>
      <div style={{ maxWidth:'75%' }}>
        <div style={{ fontSize:11, color:'#94a3b8', marginBottom:4, textAlign: isUser?'right':'left' }}>
          {isUser ? '나' : 'SC AI 튜터'}
        </div>
        <div style={{ padding:'12px 16px', borderRadius: isUser?'18px 4px 18px 18px':'4px 18px 18px 18px', background: isUser?'#1d4ed8':'#fff', color: isUser?'#fff':'#0f172a', fontSize:14, lineHeight:1.7, border: isUser?'none':'1px solid #e2e8f0', whiteSpace:'pre-wrap', wordBreak:'break-word' }}>
          {msg.content}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [histLoading, setHistLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  async function loadHistory() {
    setHistLoading(true);
    try {
      const data = await apiCall('/chat/history');
      if (Array.isArray(data) && data.length > 0) {
        setMessages(data.map((m: any) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })));
      }
    } catch { /* 기록 없으면 무시 */ }
    finally { setHistLoading(false); }
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role:'user', content:text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const data = await apiCall('/chat/send', {
        method: 'POST',
        body: JSON.stringify({ message: text }),
      });
      setMessages(prev => [...prev, { role:'assistant', content: data.response }]);
    } catch {
      setMessages(prev => [...prev, { role:'assistant', content: '죄송해요, 일시적인 오류가 발생했어요. 다시 시도해주세요.' }]);
    } finally {
      setLoading(false);
    }
  }

  async function clearHistory() {
    if (!confirm('대화 기록을 모두 삭제하시겠습니까?')) return;
    try {
      await apiCall('/chat/history', { method:'DELETE' });
      setMessages([]);
      toast.success('대화 기록이 삭제되었습니다.');
    } catch { toast.error('삭제에 실패했습니다.'); }
  }

  useEffect(() => { loadHistory(); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, loading]);

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <div style={{ maxWidth:820, margin:'0 auto', height:'calc(100vh - 140px)', display:'flex', flexDirection:'column', gap:0 }}>

      {/* 헤더 */}
      <div style={{ background:'#fff', borderRadius:'14px 14px 0 0', border:'1px solid #e2e8f0', borderBottom:'none', padding:'16px 20px', display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:42, height:42, background:'#f0fdf4', border:'1.5px solid #bbf7d0', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Bot size={20} color="#16a34a"/>
        </div>
        <div>
          <div style={{ fontSize:15, fontWeight:800, color:'#0f172a' }}>SC AI 튜터</div>
          <div style={{ fontSize:12, color:'#22c55e', display:'flex', alignItems:'center', gap:5 }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:'#22c55e' }}/>
            온라인 · Gemini 1.5 Flash
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={clearHistory}
            style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:5, padding:'7px 12px', border:'1.5px solid #e2e8f0', borderRadius:8, background:'#fff', fontSize:12, fontWeight:600, cursor:'pointer', color:'#64748b' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='#fca5a5'; (e.currentTarget as HTMLElement).style.color='#ef4444'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='#e2e8f0'; (e.currentTarget as HTMLElement).style.color='#64748b'; }}>
            <Trash2 size={13}/> 대화 초기화
          </button>
        )}
      </div>

      {/* 메시지 영역 */}
      <div style={{ flex:1, background:'#f8fafc', border:'1px solid #e2e8f0', borderTop:'none', borderBottom:'none', padding:'20px', overflowY:'auto' }}>
        {histLoading ? (
          <div style={{ textAlign:'center', padding:40, color:'#94a3b8' }}><Loader2 size={20} style={{ animation:'spin 1s linear infinite' }}/></div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign:'center', paddingTop:40 }}>
            <div style={{ width:64, height:64, background:'#f0fdf4', border:'2px solid #bbf7d0', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <Bot size={28} color="#16a34a"/>
            </div>
            <div style={{ fontSize:18, fontWeight:800, color:'#0f172a', marginBottom:6 }}>SC AI 튜터</div>
            <div style={{ fontSize:14, color:'#64748b', marginBottom:24, lineHeight:1.7 }}>
              안녕하세요, {user?.name}님! 😊<br/>
              스마트콘텐츠학과 전용 AI 튜터예요.<br/>
              코딩, 과제, 학과 관련 무엇이든 물어보세요!
            </div>
            <div style={{ fontSize:13, fontWeight:700, color:'#374151', marginBottom:12 }}>이런 걸 물어볼 수 있어요</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center' }}>
              {suggestions.map(s => (
                <button key={s} onClick={() => { setInput(s); inputRef.current?.focus(); }}
                  style={{ padding:'8px 14px', border:'1.5px solid #e2e8f0', borderRadius:99, fontSize:13, background:'#fff', cursor:'pointer', color:'#374151', transition:'all .15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='#3b82f6'; (e.currentTarget as HTMLElement).style.color='#3b82f6'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='#e2e8f0'; (e.currentTarget as HTMLElement).style.color='#374151'; }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((m, i) => <MsgBubble key={i} msg={m}/>)}
            {loading && (
              <div style={{ display:'flex', gap:10, marginBottom:16 }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:'#f0fdf4', border:'1.5px solid #bbf7d0', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Bot size={16} color="#16a34a"/>
                </div>
                <div style={{ padding:'14px 18px', borderRadius:'4px 18px 18px 18px', background:'#fff', border:'1px solid #e2e8f0', display:'flex', alignItems:'center', gap:6 }}>
                  <div style={{ display:'flex', gap:4 }}>
                    {[0,1,2].map(i => (
                      <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:'#94a3b8', animation:`bounce 1.2s ${i*0.2}s infinite` }}/>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* 입력창 */}
      <div style={{ background:'#fff', borderRadius:'0 0 14px 14px', border:'1px solid #e2e8f0', borderTop:'1px solid #f1f5f9', padding:'14px 16px' }}>
        <div style={{ display:'flex', gap:10, alignItems:'flex-end' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="메시지를 입력하세요... (Enter로 전송, Shift+Enter로 줄바꿈)"
            rows={1}
            style={{ flex:1, padding:'11px 14px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:14, outline:'none', fontFamily:'inherit', resize:'none', lineHeight:1.5, maxHeight:120, overflowY:'auto', transition:'border .15s' }}
            onFocus={e => (e.target.style.borderColor='#3b82f6')}
            onBlur={e => (e.target.style.borderColor='#e2e8f0')}
            onInput={e => {
              const t = e.target as HTMLTextAreaElement;
              t.style.height = 'auto';
              t.style.height = Math.min(t.scrollHeight, 120) + 'px';
            }}
          />
          <button onClick={send} disabled={loading || !input.trim()}
            style={{ width:44, height:44, borderRadius:10, background: loading||!input.trim()?'#e2e8f0':'#1d4ed8', border:'none', cursor: loading||!input.trim()?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'background .15s' }}>
            {loading ? <Loader2 size={18} color="#94a3b8" style={{ animation:'spin 1s linear infinite' }}/> : <Send size={18} color={loading||!input.trim()?'#94a3b8':'#fff'}/>}
          </button>
        </div>
        <div style={{ fontSize:11, color:'#94a3b8', marginTop:8, textAlign:'center' }}>
          Powered by Google Gemini 1.5 Flash · 대화 내용은 학습에 활용될 수 있어요
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
