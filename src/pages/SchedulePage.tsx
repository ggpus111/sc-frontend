import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { useAuth, apiCall } from '../lib/store';
import { catConfig } from '../lib/mockData';
import { format, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import toast from 'react-hot-toast';

const schedColors: Record<string, string> = { exam:'#ef4444', assignment:'#a855f7', event:'#22c55e', holiday:'#f97316', meeting:'#3b82f6' };
const typeLabels: Record<string, string> = { exam:'시험', assignment:'과제', event:'행사', holiday:'방학', meeting:'회의' };

interface Schedule { id:number; title:string; start_date:string; end_date:string; type:string; description?:string; author_name?:string; }

// ═══════════════ SCHEDULE PAGE ═══════════════
export function SchedulePage() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [cy, setCy] = useState(new Date().getFullYear());
  const [cm, setCm] = useState(new Date().getMonth() + 1);
  const [selDay, setSelDay] = useState<number|null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title:'', startDate:'', endDate:'', type:'event', description:'' });
  const [submitting, setSubmitting] = useState(false);
  const canWrite = user?.role === 'admin' || user?.role === 'professor';

  async function load() {
    setLoading(true);
    try {
      const data = await apiCall(`/schedules?year=${cy}&month=${cm}`);
      setSchedules(data);
    } catch { toast.error('일정을 불러오지 못했습니다.'); }
    finally { setLoading(false); }
  }

  async function addSchedule(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.startDate) return toast.error('제목과 날짜를 입력하세요.');
    setSubmitting(true);
    try {
      await apiCall('/schedules', { method:'POST', body: JSON.stringify({ title:form.title, startDate:form.startDate, endDate:form.endDate||form.startDate, type:form.type, description:form.description }) });
      toast.success('일정이 추가되었습니다.');
      setForm({ title:'', startDate:'', endDate:'', type:'event', description:'' });
      setShowForm(false); load();
    } catch (e: any) { toast.error(e.error || '추가에 실패했습니다.'); }
    finally { setSubmitting(false); }
  }

  async function deleteSchedule(id: number) {
    if (!confirm('삭제하시겠습니까?')) return;
    try {
      await apiCall(`/schedules/${id}`, { method:'DELETE' });
      toast.success('삭제되었습니다.'); load();
    } catch { toast.error('삭제에 실패했습니다.'); }
  }

  useEffect(() => { load(); }, [cy, cm]);

  const first = new Date(cy, cm-1, 1).getDay();
  const days = new Date(cy, cm, 0).getDate();
  const today = new Date(); today.setHours(0,0,0,0);
  const getEvs = (d: number) => { const ds = `${cy}-${String(cm).padStart(2,'0')}-${String(d).padStart(2,'0')}`; return schedules.filter(s => s.start_date?.slice(0,10) === ds || (s.start_date <= ds+'T' && s.end_date >= ds)); };
  const todayEvs = getEvs(today.getDate());
  const selEvs = selDay ? getEvs(selDay) : [];

  const inp: React.CSSProperties = { width:'100%', padding:'9px 12px', border:'1.5px solid #e2e8f0', borderRadius:9, fontSize:13, outline:'none', fontFamily:'inherit', boxSizing:'border-box', background:'#f8fafc' };

  return (
    <div style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 280px', gap:16 }}>
      <div style={{ background:'#fff', borderRadius:14, border:'1px solid #e2e8f0', padding:20 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
          <button onClick={() => setCm(m => { if(m===1){setCy(y=>y-1);return 12;} return m-1; })} style={{ width:30, height:30, border:'1.5px solid #e2e8f0', borderRadius:8, background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#64748b', fontSize:14 }}>←</button>
          <div style={{ fontSize:16, fontWeight:800, color:'#0f172a' }}>{cy}년 {cm}월</div>
          <button onClick={() => setCm(m => { if(m===12){setCy(y=>y+1);return 1;} return m+1; })} style={{ width:30, height:30, border:'1.5px solid #e2e8f0', borderRadius:8, background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#64748b', fontSize:14 }}>→</button>
        </div>
        {loading ? <div style={{ textAlign:'center', padding:40 }}><Loader2 size={20} /></div> : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:3 }}>
            {['일','월','화','수','목','금','토'].map((d,i) => <div key={d} style={{ fontSize:11, fontWeight:700, color: i===0?'#ef4444':i===6?'#3b82f6':'#94a3b8', textAlign:'center', padding:'4px 0' }}>{d}</div>)}
            {Array(first).fill(null).map((_,i) => <div key={'e'+i} />)}
            {Array.from({length:days},(_,i)=>i+1).map(d => {
              const date = new Date(cy,cm-1,d);
              const isToday = date.getTime()===today.getTime();
              const isSun = date.getDay()===0, isSat = date.getDay()===6;
              const isSel = selDay===d;
              const evs = getEvs(d);
              return (
                <div key={d} onClick={() => setSelDay(isSel?null:d)}
                  style={{ minHeight:68, borderRadius:10, padding:'6px 5px', cursor:'pointer', border:`1.5px solid ${isToday?'#3b82f6':isSel?'#93c5fd':'transparent'}`, background: isToday?'#eff6ff':isSel?'#f0f7ff':'transparent', transition:'all .15s' }}
                  onMouseEnter={e => !isToday&&!isSel&&((e.currentTarget as HTMLElement).style.background='#f8fafc')}
                  onMouseLeave={e => !isToday&&!isSel&&((e.currentTarget as HTMLElement).style.background='transparent')}>
                  <div style={{ fontSize:12, fontWeight: isToday?800:600, color: isToday?'#3b82f6':isSun?'#ef4444':isSat?'#3b82f6':'#475569', marginBottom:3 }}>{d}</div>
                  {evs.slice(0,2).map(ev => (
                    <div key={ev.id} style={{ fontSize:10, fontWeight:600, padding:'1px 4px', borderRadius:4, background:(schedColors[ev.type]||'#3b82f6')+'20', color:schedColors[ev.type]||'#3b82f6', overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis', marginBottom:2 }}>{ev.title}</div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
        <div style={{ display:'flex', gap:12, marginTop:12, flexWrap:'wrap' }}>
          {Object.entries(typeLabels).map(([t,l]) => <div key={t} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'#64748b' }}><div style={{ width:9, height:9, borderRadius:3, background:schedColors[t] }}/>{l}</div>)}
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        <div style={{ background:'#fff', borderRadius:14, border:'1px solid #e2e8f0', padding:18 }}>
          <div style={{ fontSize:13, fontWeight:800, marginBottom:12, display:'flex', alignItems:'center', gap:6, color:'#0f172a' }}>오늘 일정 <span style={{ fontSize:11, padding:'2px 8px', background:'#eff6ff', color:'#3b82f6', borderRadius:99, fontWeight:700 }}>Today</span></div>
          {todayEvs.length===0 ? <div style={{ textAlign:'center', padding:'20px 0', color:'#94a3b8', fontSize:13 }}>오늘 예정된 일정이 없어요 😊</div>
          : todayEvs.map(s => (
            <div key={s.id} style={{ display:'flex', gap:10, padding:'9px 12px', borderRadius:9, border:'1px solid #e2e8f0', marginBottom:7 }}>
              <div style={{ width:4, borderRadius:2, background:schedColors[s.type]||'#3b82f6', flexShrink:0, alignSelf:'stretch' }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#0f172a' }}>{s.title}</div>
                <div style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>{typeLabels[s.type]}</div>
              </div>
              {canWrite && <button onClick={() => deleteSchedule(s.id)} style={{ background:'none', border:'none', cursor:'pointer', color:'#cbd5e1', padding:4 }}><Trash2 size={13}/></button>}
            </div>
          ))}
        </div>

        {selDay && (
          <div style={{ background:'#fff', borderRadius:14, border:'1px solid #e2e8f0', padding:18 }}>
            <div style={{ fontSize:13, fontWeight:800, marginBottom:12, color:'#0f172a' }}>{cm}월 {selDay}일 일정</div>
            {selEvs.length===0 ? <div style={{ textAlign:'center', padding:'16px 0', color:'#94a3b8', fontSize:13 }}>이 날 일정이 없습니다.</div>
            : selEvs.map(s => (
              <div key={s.id} style={{ display:'flex', gap:10, padding:'9px 12px', borderRadius:9, border:'1px solid #e2e8f0', marginBottom:7 }}>
                <div style={{ width:4, borderRadius:2, background:schedColors[s.type]||'#3b82f6', flexShrink:0, alignSelf:'stretch' }}/>
                <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:700, color:'#0f172a' }}>{s.title}</div><div style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>{typeLabels[s.type]}</div></div>
                {canWrite && <button onClick={() => deleteSchedule(s.id)} style={{ background:'none', border:'none', cursor:'pointer', color:'#cbd5e1', padding:4 }}><Trash2 size={13}/></button>}
              </div>
            ))}
          </div>
        )}

        {canWrite && (
          <div style={{ background:'#fff', borderRadius:14, border:'1px solid #e2e8f0', padding:18 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: showForm?12:0 }}>
              <div style={{ fontSize:13, fontWeight:800, color:'#0f172a' }}>일정 관리</div>
              <button onClick={() => setShowForm(v=>!v)} style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 12px', background:'#1d4ed8', color:'#fff', border:'none', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer' }}><Plus size={12}/>추가</button>
            </div>
            {showForm && (
              <form onSubmit={addSchedule} style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <input style={inp} placeholder="일정 제목" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} required/>
                <input style={inp} type="date" value={form.startDate} onChange={e=>setForm(f=>({...f,startDate:e.target.value}))} required/>
                <input style={inp} type="date" value={form.endDate} onChange={e=>setForm(f=>({...f,endDate:e.target.value}))} placeholder="종료일 (선택)"/>
                <select style={inp} value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                  {Object.entries(typeLabels).map(([v,l])=><option key={v} value={v}>{l}</option>)}
                </select>
                <div style={{ display:'flex', gap:6 }}>
                  <button type="submit" disabled={submitting} style={{ flex:1, padding:9, background:'#1d4ed8', color:'#fff', border:'none', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>
                    {submitting && <Loader2 size={12}/>} 추가
                  </button>
                  <button type="button" onClick={()=>setShowForm(false)} style={{ flex:1, padding:9, border:'1.5px solid #e2e8f0', background:'#fff', borderRadius:8, fontSize:12, cursor:'pointer', color:'#64748b' }}>취소</button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════ CHECKLIST PAGE ═══════════════
interface CheckItem { id:number; title:string; due_date:string; category:string; is_done:boolean; }

function getDday(dateStr:string, done:boolean):{text:string;cls:string}|null{
  if(!dateStr) return null;
  const today=new Date();today.setHours(0,0,0,0);
  const due=new Date(dateStr);due.setHours(0,0,0,0);
  const diff=Math.ceil((due.getTime()-today.getTime())/(1000*60*60*24));
  if(done) return{text:'완료',cls:'done'};
  if(diff<0) return{text:`D+${Math.abs(diff)}`,cls:'over'};
  if(diff===0) return{text:'D-Day',cls:'urgent'};
  if(diff<=3) return{text:`D-${diff}`,cls:'urgent'};
  if(diff<=7) return{text:`D-${diff}`,cls:'soon'};
  return{text:`D-${diff}`,cls:'normal'};
}

const ddayStyle=(cls:string):React.CSSProperties=>{
  const m:Record<string,React.CSSProperties>={urgent:{background:'#fef2f2',color:'#dc2626'},soon:{background:'#fff7ed',color:'#c2410c'},normal:{background:'#f0fdf4',color:'#15803d'},done:{background:'#f1f5f9',color:'#94a3b8'},over:{background:'#f8fafc',color:'#94a3b8'}};
  return{...m[cls]||m.normal,padding:'2px 7px',borderRadius:4,fontSize:10,fontWeight:800};
};

export function ChecklistPage(){
  const [items, setItems] = useState<CheckItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [cat, setCat] = useState('study');
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await apiCall('/checklists');
      setItems(data);
    } catch { toast.error('체크리스트를 불러오지 못했습니다.'); }
    finally { setLoading(false); }
  }

  async function toggle(id: number) {
    try {
      await apiCall(`/checklists/${id}/toggle`, { method:'PATCH' });
      setItems(p => p.map(x => x.id===id ? {...x, is_done:!x.is_done} : x));
    } catch { toast.error('변경에 실패했습니다.'); }
  }

  async function del(id: number) {
    if (!confirm('삭제하시겠습니까?')) return;
    try {
      await apiCall(`/checklists/${id}`, { method:'DELETE' });
      setItems(p => p.filter(x => x.id!==id));
      toast.success('삭제되었습니다.');
    } catch { toast.error('삭제에 실패했습니다.'); }
  }

  async function add() {
    if (!title.trim()) return toast.error('할 일을 입력하세요.');
    setSubmitting(true);
    try {
      const newItem = await apiCall('/checklists', { method:'POST', body: JSON.stringify({ title, date, cat }) });
      setItems(p => [{ id:newItem.id, title, due_date:date, category:cat, is_done:false }, ...p]);
      setTitle(''); setDate('');
      toast.success('추가되었습니다.');
    } catch { toast.error('추가에 실패했습니다.'); }
    finally { setSubmitting(false); }
  }

  useEffect(() => { load(); }, []);

  const filtered = items.filter(it => {
    if(filter==='todo') return !it.is_done;
    if(filter==='done') return it.is_done;
    if(filter==='assign') return it.category==='assign';
    if(filter==='exam') return it.category==='exam';
    return true;
  });
  const total=items.length, done=items.filter(x=>x.is_done).length, pct=total?Math.round(done/total*100):0;

  const inp: React.CSSProperties = { width:'100%', padding:'10px 12px', border:'1.5px solid #e2e8f0', borderRadius:9, fontSize:13, outline:'none', fontFamily:'inherit', background:'#f8fafc', boxSizing:'border-box' };

  return(
    <div style={{ maxWidth:780, margin:'0 auto', display:'grid', gridTemplateColumns:'280px 1fr', gap:16 }}>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        <div style={{ background:'#fff', borderRadius:14, border:'1px solid #e2e8f0', padding:18 }}>
          <div style={{ fontSize:14, fontWeight:800, color:'#0f172a', marginBottom:12, display:'flex', alignItems:'center', justifyContent:'space-between' }}>내 체크리스트<span style={{ fontSize:10, color:'#94a3b8', fontWeight:500 }}>나에게만 보임</span></div>
          <div style={{ background:'#f1f5f9', borderRadius:10, padding:'12px 14px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, fontWeight:700, color:'#374151', marginBottom:8 }}><span>진행률</span><span>{pct}%</span></div>
            <div style={{ background:'#e2e8f0', borderRadius:99, height:8 }}><div style={{ background:'#3b82f6', borderRadius:99, height:8, width:`${pct}%`, transition:'width .4s' }}/></div>
            <div style={{ display:'flex', gap:12, marginTop:8 }}>
              {[{dot:'#3b82f6',text:`${total}개`},{dot:'#22c55e',text:`완료 ${done}`},{dot:'#f97316',text:`남음 ${total-done}`}].map(x=><div key={x.text} style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:'#64748b' }}><div style={{ width:8, height:8, borderRadius:'50%', background:x.dot }}/>{x.text}</div>)}
            </div>
          </div>
        </div>
        <div style={{ background:'#fff', borderRadius:14, border:'1px solid #e2e8f0', padding:18 }}>
          <div style={{ fontSize:13, fontWeight:800, color:'#0f172a', marginBottom:12 }}>할 일 추가</div>
          <input style={{ ...inp, marginBottom:8 }} placeholder="할 일을 입력하세요" value={title} onChange={e=>setTitle(e.target.value)} onKeyDown={e=>e.key==='Enter'&&add()}/>
          <input style={{ ...inp, marginBottom:8 }} type="date" value={date} onChange={e=>setDate(e.target.value)}/>
          <select style={{ ...inp, marginBottom:10 }} value={cat} onChange={e=>setCat(e.target.value)}>
            <option value="study">공부</option><option value="assign">과제</option><option value="exam">시험 준비</option><option value="project">프로젝트</option><option value="etc">기타</option>
          </select>
          <button onClick={add} disabled={submitting} style={{ width:'100%', padding:10, background:'#1d4ed8', color:'#fff', border:'none', borderRadius:9, fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>
            {submitting && <Loader2 size={13}/>} 추가하기
          </button>
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {[['all','전체'],['todo','진행중'],['done','완료'],['assign','과제'],['exam','시험']].map(([f,l])=>(
            <div key={f} onClick={()=>setFilter(f)} style={{ padding:'5px 12px', border:`1.5px solid ${filter===f?'#3b82f6':'#e2e8f0'}`, borderRadius:99, fontSize:12, fontWeight:600, cursor:'pointer', background:filter===f?'#3b82f6':'#f8fafc', color:filter===f?'#fff':'#64748b', transition:'all .15s' }}>{l}</div>
          ))}
        </div>
        {loading ? <div style={{ textAlign:'center', padding:32 }}><Loader2 size={20}/></div>
        : filtered.length===0 ? <div style={{ textAlign:'center', padding:32, color:'#94a3b8', fontSize:13, background:'#fff', borderRadius:14, border:'1px solid #e2e8f0' }}>항목이 없습니다.</div>
        : filtered.map(it=>{
          const cfg = catConfig[it.category] || catConfig.etc;
          const dd = getDday(it.due_date, it.is_done);
          return(
            <div key={it.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', background:'#fff', borderRadius:11, border:'1.5px solid #e2e8f0', opacity:it.is_done?.5:1 }} onMouseEnter={e=>(e.currentTarget.style.borderColor='#bfdbfe')} onMouseLeave={e=>(e.currentTarget.style.borderColor='#e2e8f0')}>
              <div onClick={()=>toggle(it.id)} style={{ width:22, height:22, borderRadius:6, border:`2px solid ${it.is_done?'#3b82f6':'#cbd5e1'}`, background:it.is_done?'#3b82f6':'#fff', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                {it.is_done&&<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600, color:it.is_done?'#94a3b8':'#0f172a', textDecoration:it.is_done?'line-through':'none' }}>{it.title}</div>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:4, flexWrap:'wrap' }}>
                  {it.due_date&&<span style={{ fontSize:11, color:'#94a3b8' }}>{it.due_date}</span>}
                  <span style={{ fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:4, background:cfg.bg, color:cfg.color }}>{cfg.label}</span>
                  {dd&&<span style={ddayStyle(dd.cls)}>{dd.text}</span>}
                </div>
              </div>
              <button onClick={()=>del(it.id)} style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 11px', borderRadius:8, border:'1.5px solid #e2e8f0', background:'#fff', cursor:'pointer', color:'#94a3b8', fontSize:12, fontWeight:600 }} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='#fef2f2';(e.currentTarget as HTMLElement).style.borderColor='#fca5a5';(e.currentTarget as HTMLElement).style.color='#ef4444';}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='#fff';(e.currentTarget as HTMLElement).style.borderColor='#e2e8f0';(e.currentTarget as HTMLElement).style.color='#94a3b8';}}>
                <Trash2 size={13}/>삭제
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SchedulePage;
