import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Settings, LogOut, Shield, MessageSquare } from 'lucide-react';
import { useAuth } from '../../lib/store';
import toast from 'react-hot-toast';

const tabs = [
  { to:'/home',      label:'홈' },
  { to:'/notice',    label:'공지사항' },
  { to:'/schedule',  label:'학사일정' },
  { to:'/checklist', label:'체크리스트' },
  { to:'/free',      label:'자유게시판' },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const initials = user?.name?.[0] ?? '?';

  function handleLogout() {
    logout();
    toast.success('로그아웃되었습니다.');
    nav('/');
  }

  return (
    <div style={{ minHeight:'100vh', background:'#f1f5f9' }}>
      {/* HEADER */}
      <header style={{ background:'#fff', borderBottom:'3px solid #3b82f6', height:60, display:'flex', alignItems:'center', padding:'0 28px', gap:12, position:'sticky', top:0, zIndex:40 }}>
        <div onClick={() => nav('/home')} style={{ width:36, height:36, background:'#3b82f6', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:13, cursor:'pointer', flexShrink:0 }}>SC</div>
        <div onClick={() => nav('/home')} style={{ cursor:'pointer' }}>
          <div style={{ fontSize:16, fontWeight:800, color:'#0f172a', lineHeight:1.2 }}>스마트콘텐츠 AI 플랫폼</div>
          <div style={{ fontSize:10, color:'#94a3b8' }}>Smart Content Department Portal</div>
        </div>
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8 }}>
          {/* AI 챗봇 버튼 */}
          <button onClick={() => nav('/chat')}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', background:'#f0fdf4', border:'1.5px solid #bbf7d0', borderRadius:8, fontSize:12, fontWeight:700, color:'#16a34a', cursor:'pointer' }}>
            <MessageSquare size={13}/> AI 챗봇
          </button>
          {user?.role === 'admin' && (
            <button onClick={() => nav('/admin')}
              style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 10px', background:'#fef3c7', border:'1px solid #fcd34d', borderRadius:7, fontSize:11, fontWeight:700, color:'#92400e', cursor:'pointer' }}>
              <Shield size={12}/> 관리자
            </button>
          )}
          <button onClick={() => nav('/settings')}
            style={{ width:32, height:32, border:'1.5px solid #e2e8f0', borderRadius:8, background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#64748b' }}>
            <Settings size={15}/>
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:7, padding:'5px 10px', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:8, fontSize:12, color:'#475569' }}>
            <div style={{ width:22, height:22, background:'#eff6ff', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color:'#3b82f6' }}>{initials}</div>
            {user?.name}
          </div>
          <button onClick={handleLogout}
            style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 12px', border:'1.5px solid #e2e8f0', borderRadius:8, background:'#fff', fontSize:12, fontWeight:600, color:'#64748b', cursor:'pointer' }}>
            <LogOut size={13}/> 로그아웃
          </button>
        </div>
      </header>

      {/* TABS */}
      <nav style={{ background:'#fff', borderBottom:'1px solid #e2e8f0', padding:'0 28px', display:'flex', overflowX:'auto' }}>
        {tabs.map(({ to, label }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            padding:'12px 18px', fontSize:13, fontWeight: isActive?700:500,
            color: isActive?'#3b82f6':'#64748b',
            borderBottom:`2px solid ${isActive?'#3b82f6':'transparent'}`,
            marginBottom:-1, textDecoration:'none', whiteSpace:'nowrap', transition:'all .15s',
          })}>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* CONTENT */}
      <main style={{ padding:'20px 28px', maxWidth:1200, margin:'0 auto' }}>
        <Outlet/>
      </main>
    </div>
  );
}
