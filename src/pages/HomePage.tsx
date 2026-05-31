import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Calendar, TrendingUp, MessageSquare, Folder, Zap, Award, User, Loader2 } from 'lucide-react';
import { useAuth, apiCall } from '../lib/store';
import { format, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';

const features = [
  { icon:MessageSquare, bg:'#eff6ff', c:'#3b82f6', label:'AI 챗봇',    to:'/notice' },
  { icon:Folder,        bg:'#f5f3ff', c:'#8b5cf6', label:'프로젝트',   to:'/free' },
  { icon:Bell,          bg:'#fff7ed', c:'#f97316', label:'공지사항',   to:'/notice' },
  { icon:Calendar,      bg:'#f0fdf4', c:'#22c55e', label:'학과 일정',  to:'/schedule' },
  { icon:Award,         bg:'#fdf4ff', c:'#a855f7', label:'포트폴리오', to:'/free' },
  { icon:Zap,           bg:'#f0fdfa', c:'#14b8a6', label:'체크리스트', to:'/checklist' },
];

const catBadge = (cat: string) => {
  const m: Record<string,{bg:string;color:string;label:string}> = {
    urgent:  { bg:'#fef2f2', color:'#dc2626', label:'긴급' },
    notice:  { bg:'#eff6ff', color:'#1d4ed8', label:'공지' },
    system:  { bg:'#f0fdf4', color:'#15803d', label:'시스템' },
    general: { bg:'#f8fafc', color:'#475569', label:'일반' },
  };
  return m[cat] || m.general;
};

function MiniCalendar({ schedules }: { schedules: any[] }) {
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth();
  const first = new Date(y, m, 1).getDay();
  const days = new Date(y, m+1, 0).getDate();
  const cells = [...Array(first).fill(null), ...Array.from({length:days}, (_,i) => i+1)];
  const hasEv = (d: number) => schedules.some(s => isSameDay(new Date(s.start_date), new Date(y, m, d)));
  return (
    <div>
      <div style={{ textAlign:'center', fontSize:14, fontWeight:700, marginBottom:10 }}>{y}년 {m+1}월</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2, textAlign:'center' }}>
        {['일','월','화','수','목','금','토'].map((d,i) => (
          <div key={d} style={{ fontSize:11, fontWeight:700, color: i===0?'#ef4444':i===6?'#3b82f6':'#94a3b8', padding:'3px 0' }}>{d}</div>
        ))}
        {cells.map((d, i) => (
          <div key={i} style={{ fontSize:12, padding:'5px 2px', borderRadius:6, position:'relative', background: d===now.getDate()?'#3b82f6':'transparent', color: !d?'transparent': d===now.getDate()?'#fff': i%7===0?'#ef4444': i%7===6?'#3b82f6':'#475569', fontWeight: d===now.getDate()?700:400 }}>
            {d||''}
            {d && hasEv(d) && d!==now.getDate() && <div style={{ width:4, height:4, background:'#3b82f6', borderRadius:'50%', margin:'1px auto 0' }}/>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [notices, setNotices] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await apiCall('/dashboard');
        setNotices(data.notices || []);
        setSchedules(data.schedules || []);
      } catch {
        // API 실패 시 빈 배열로
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const roleLabel = user?.role==='admin'?'관리자':user?.role==='professor'?'교수':'학생';
  const roleBg    = user?.role==='admin'?'#fef3c7':user?.role==='professor'?'#f5f3ff':'#eff6ff';
  const roleColor = user?.role==='admin'?'#92400e':user?.role==='professor'?'#6d28d9':'#1d4ed8';

  return (
    <div style={{ display:'grid', gridTemplateColumns:'220px 1fr 256px', gap:16, alignItems:'start' }}>

      {/* LEFT — 사용자 정보 */}
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        <div style={{ background:'#fff', borderRadius:14, border:'1px solid #e2e8f0', padding:18 }}>
          <div style={{ width:52, height:52, background:'#e0eaff', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10, color:'#3b82f6', fontSize:20, fontWeight:900 }}>
            {user?.name?.[0] || <User size={22}/>}
          </div>
          <div style={{ fontSize:16, fontWeight:700, color:'#0f172a' }}>{user?.name}</div>
          <div style={{ fontSize:11, color:'#94a3b8', marginTop:2, marginBottom:8 }}>{user?.email}</div>
          <span style={{ display:'inline-block', padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:700, background:roleBg, color:roleColor }}>{roleLabel}</span>
          {user?.department && <div style={{ fontSize:12, color:'#64748b', marginTop:6 }}>{user.department}</div>}
          <button onClick={() => nav('/settings')} style={{ width:'100%', marginTop:12, padding:9, background:'#3b82f6', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }}>프로필 보기</button>
        </div>
        <div style={{ background:'#fff', borderRadius:14, border:'1px solid #e2e8f0', padding:18 }}>
          <div style={{ fontSize:12, fontWeight:700, color:'#0f172a', marginBottom:10 }}>빠른 링크</div>
          {[
            { dot:'#3b82f6', label:'학사일정',    to:'/schedule' },
            { dot:'#8b5cf6', label:'전공교수 소개', to:'/notice' },
            { dot:'#14b8a6', label:'학과 소개',    to:'/notice' },
            { dot:'#f97316', label:'포털 바로가기', to:'/notice' },
          ].map(({ dot, label, to }) => (
            <div key={label} onClick={() => nav(to)}
              style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 8px', borderRadius:7, cursor:'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.background='#f8fafc')}
              onMouseLeave={e => (e.currentTarget.style.background='none')}>
              <div style={{ width:7, height:7, borderRadius:2, background:dot, flexShrink:0 }}/>
              <span style={{ fontSize:13, color:'#475569' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CENTER — 주요기능 + 공지사항 */}
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <div style={{ background:'#fff', borderRadius:14, border:'1px solid #e2e8f0', padding:20 }}>
          <div style={{ fontSize:15, fontWeight:800, marginBottom:14, display:'flex', alignItems:'center', gap:7, color:'#0f172a' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            주요 기능
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {features.map(f => (
              <div key={f.label} onClick={() => nav(f.to)}
                style={{ border:'1px solid #e2e8f0', borderRadius:12, padding:'16px 10px', textAlign:'center', cursor:'pointer', transition:'all .15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='#3b82f6'; (e.currentTarget as HTMLElement).style.background='#eff6ff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='#e2e8f0'; (e.currentTarget as HTMLElement).style.background='#fff'; }}>
                <div style={{ width:44, height:44, borderRadius:12, background:f.bg, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 8px' }}>
                  <f.icon size={20} color={f.c} />
                </div>
                <div style={{ fontSize:12, fontWeight:700, color:'#475569' }}>{f.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background:'#fff', borderRadius:14, border:'1px solid #e2e8f0', padding:20 }}>
          <div style={{ display:'flex', alignItems:'center', marginBottom:14 }}>
            <div style={{ fontSize:15, fontWeight:800, display:'flex', alignItems:'center', gap:7, color:'#0f172a' }}>
              <Bell size={15} color="#f97316"/> 공지사항
            </div>
            <button onClick={() => nav('/notice')} style={{ marginLeft:'auto', fontSize:12, color:'#3b82f6', background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>더보기 →</button>
          </div>
          {loading ? (
            <div style={{ textAlign:'center', padding:24 }}><Loader2 size={18} style={{ animation:'spin 1s linear infinite' }}/></div>
          ) : notices.length === 0 ? (
            <div style={{ textAlign:'center', padding:24, color:'#94a3b8', fontSize:13 }}>등록된 공지사항이 없습니다.</div>
          ) : notices.map(n => {
            const cat = catBadge(n.category);
            return (
              <div key={n.id} onClick={() => nav('/notice')}
                style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 8px', borderRadius:8, cursor:'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.background='#f8fafc')}
                onMouseLeave={e => (e.currentTarget.style.background='none')}>
                {n.is_pinned ? <span style={{ fontSize:13, flexShrink:0 }}>📌</span> : <span style={{ width:13 }}/>}
                <div style={{ flex:1, fontSize:13, fontWeight: n.is_pinned?700:500, color:'#0f172a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{n.title}</div>
                <span style={{ flexShrink:0, padding:'2px 8px', borderRadius:5, fontSize:10, fontWeight:700, background:cat.bg, color:cat.color }}>{cat.label}</span>
                <span style={{ fontSize:11, color:'#94a3b8', flexShrink:0 }}>{format(new Date(n.created_at), 'MM-dd')}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT — 캘린더 + 일정 */}
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        <div style={{ background:'#fff', borderRadius:14, border:'1px solid #e2e8f0', padding:18 }}>
          <div style={{ fontSize:12, fontWeight:700, marginBottom:8, display:'flex', alignItems:'center', gap:5, color:'#3b82f6' }}>
            <Calendar size={13}/> 이번 달
          </div>
          {loading ? <div style={{ textAlign:'center', padding:24 }}><Loader2 size={18}/></div> : <MiniCalendar schedules={schedules} />}
        </div>

        <div style={{ background:'#fff', borderRadius:14, border:'1px solid #e2e8f0', padding:18 }}>
          <div style={{ fontSize:13, fontWeight:800, marginBottom:12, display:'flex', alignItems:'center', gap:6, color:'#0f172a' }}>
            <TrendingUp size={14} color="#3b82f6"/> 이번달 일정
          </div>
          {loading ? (
            <div style={{ textAlign:'center', padding:16 }}><Loader2 size={16}/></div>
          ) : schedules.length === 0 ? (
            <div style={{ textAlign:'center', padding:16, color:'#94a3b8', fontSize:13 }}>등록된 일정이 없습니다.</div>
          ) : schedules.slice(0,4).map(s => (
            <div key={s.id} style={{ display:'flex', gap:10, padding:'7px 0', borderBottom:'1px solid #f1f5f9' }}>
              <div style={{ width:3, borderRadius:2, background: s.type==='exam'?'#ef4444':s.type==='assignment'?'#a855f7':'#3b82f6', flexShrink:0 }}/>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:'#0f172a' }}>{s.title}</div>
                <div style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>
                  {format(new Date(s.start_date), 'M월 d일 (EEE)', { locale:ko })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
