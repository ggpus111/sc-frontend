import { useState, useEffect } from 'react';
import { Shield, Users, FileText, Clock, Settings, BarChart3, Loader2 } from 'lucide-react';
import { useAuth, apiCall } from '../lib/store';
import toast from 'react-hot-toast';

const navItems = [
  { id:'dashboard', label:'대시보드',    icon:BarChart3 },
  { id:'users',     label:'회원 관리',   icon:Users },
  { id:'posts',     label:'게시글 관리', icon:FileText },
  { id:'logs',      label:'활동 로그',   icon:Clock },
  { id:'board',     label:'게시판 설정', icon:Settings },
];

const roleLabel = (r:string) => r==='admin'?'관리자':r==='professor'?'교수':r==='external'?'외부인':'학생';
const roleBg    = (r:string) => r==='admin'?'#fef3c7':r==='professor'?'#f5f3ff':'#eff6ff';
const roleColor = (r:string) => r==='admin'?'#92400e':r==='professor'?'#6d28d9':'#1d4ed8';

const card: React.CSSProperties = { background:'#fff', borderRadius:14, border:'1px solid #e2e8f0' };
const tblHead = (cols: string): React.CSSProperties => ({ display:'grid', gridTemplateColumns:cols, padding:'9px 18px', background:'#f8fafc', borderBottom:'1px solid #e2e8f0', fontSize:11, fontWeight:700, color:'#64748b' });
const tblRow  = (cols: string): React.CSSProperties => ({ display:'grid', gridTemplateColumns:cols, padding:'12px 18px', borderBottom:'1px solid #f8fafc', alignItems:'center' });

export default function AdminPage() {
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [logs,  setLogs]  = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ── 데이터 로드 ──
  async function loadDashboard() {
    setLoading(true);
    try {
      const [statsData, logsData] = await Promise.all([
        apiCall('/admin/stats'),
        apiCall('/admin/login-logs'),
      ]);
      setStats(statsData);
      setLogs(logsData);
    } catch { toast.error('데이터를 불러오지 못했습니다.'); }
    finally { setLoading(false); }
  }

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await apiCall('/admin/users');
      setUsers(data);
    } catch { toast.error('회원 목록을 불러오지 못했습니다.'); }
    finally { setLoading(false); }
  }

  async function loadPosts() {
    setLoading(true);
    try {
      const [notice, free] = await Promise.all([
        apiCall('/boards/notice/posts?limit=20'),
        apiCall('/boards/free/posts?limit=20'),
      ]);
      setPosts([...(notice.posts||[]).map((p:any)=>({...p,board:'공지'})), ...(free.posts||[]).map((p:any)=>({...p,board:'자유'}))]);
    } catch { toast.error('게시글을 불러오지 못했습니다.'); }
    finally { setLoading(false); }
  }

  // ── 회원 비활성화/활성화 ──
  async function toggleUser(id: number) {
    try {
      const data = await apiCall(`/admin/users/${id}/toggle`, { method:'PATCH' });
      setUsers(prev => prev.map(u => u.id===id ? {...u, is_active: data.isActive} : u));
      toast.success('계정 상태가 변경되었습니다.');
    } catch { toast.error('변경에 실패했습니다.'); }
  }

  // ── 회원 삭제 ──
  async function deleteUser(id: number) {
    if (!confirm('정말 삭제하시겠습니까? 복구할 수 없습니다.')) return;
    try {
      await apiCall(`/admin/users/${id}`, { method:'DELETE' });
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success('삭제되었습니다.');
    } catch { toast.error('삭제에 실패했습니다.'); }
  }

  // ── 게시글 삭제 ──
  async function deletePost(id: number, board: string) {
    if (!confirm('게시글을 삭제하시겠습니까?')) return;
    const slug = board === '공지' ? 'notice' : 'free';
    try {
      await apiCall(`/boards/${slug}/posts/${id}`, { method:'DELETE' });
      setPosts(prev => prev.filter(p => p.id !== id));
      toast.success('삭제되었습니다.');
    } catch { toast.error('삭제에 실패했습니다.'); }
  }

  useEffect(() => {
    if (tab === 'dashboard') loadDashboard();
    else if (tab === 'users') loadUsers();
    else if (tab === 'posts') loadPosts();
    else if (tab === 'logs') { loadDashboard(); }
  }, [tab]);

  const actBtn = (danger?: boolean): React.CSSProperties => ({
    padding:'4px 10px', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer',
    border:'1.5px solid', fontFamily:'inherit',
    background: danger?'#fef2f2':'#fff',
    borderColor: danger?'#fca5a5':'#e2e8f0',
    color: danger?'#ef4444':'#94a3b8',
  });

  return (
    <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:18, alignItems:'start' }}>

      {/* 사이드 메뉴 */}
      <div style={{ ...card, padding:14 }}>
        <div style={{ fontSize:11, fontWeight:700, color:'#94a3b8', padding:'4px 12px', marginBottom:4, letterSpacing:'0.5px' }}>관리</div>
        {navItems.map(({ id, label, icon:Icon }) => (
          <div key={id} onClick={() => setTab(id)}
            style={{ display:'flex', alignItems:'center', gap:9, padding:'10px 12px', borderRadius:9, cursor:'pointer', fontSize:13, fontWeight:tab===id?700:500, color:tab===id?'#92400e':'#475569', background:tab===id?'#fef3c7':'transparent', marginBottom:2, transition:'all .15s' }}
            onMouseEnter={e => tab!==id && ((e.currentTarget as HTMLElement).style.background='#f1f5f9')}
            onMouseLeave={e => tab!==id && ((e.currentTarget as HTMLElement).style.background='transparent')}>
            <Icon size={14}/> {label}
          </div>
        ))}
      </div>

      {/* 콘텐츠 */}
      <div>

        {/* ── 대시보드 ── */}
        {tab === 'dashboard' && (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {loading ? <div style={{ textAlign:'center', padding:40 }}><Loader2 size={20}/></div> : (
              <>
                {/* 통계 카드 */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
                  {[
                    { icon:Users,    bg:'#eff6ff', color:'#3b82f6', val: stats?.users?.total||0,    label:'전체 회원',   sub:`학생 ${stats?.users?.students||0} / 교수 ${stats?.users?.professors||0}` },
                    { icon:FileText, bg:'#f0fdf4', color:'#22c55e', val: stats?.posts?.total||0,    label:'전체 게시글', sub:'공지 + 자유게시판' },
                    { icon:Shield,   bg:'#fef2f2', color:'#ef4444', val: stats?.recentFailedLogins||0, label:'로그인 실패', sub:'최근 7일' },
                    { icon:Clock,    bg:'#fff7ed', color:'#f97316', val: logs.length||0,             label:'활동 로그',   sub:'전체 기록' },
                  ].map(({ icon:Icon, bg, color, val, label, sub }) => (
                    <div key={label} style={{ ...card, padding:'16px 18px' }}>
                      <div style={{ width:38, height:38, borderRadius:10, background:bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10 }}>
                        <Icon size={17} color={color}/>
                      </div>
                      <div style={{ fontSize:24, fontWeight:900, color:'#0f172a', marginBottom:2 }}>{val}</div>
                      <div style={{ fontSize:12, color:'#64748b' }}>{label}</div>
                      <div style={{ fontSize:11, color:color, fontWeight:600, marginTop:4 }}>{sub}</div>
                    </div>
                  ))}
                </div>

                {/* 역할별 현황 */}
                {stats && (
                  <div style={card}>
                    <div style={{ padding:'16px 18px 12px', borderBottom:'1px solid #f1f5f9', fontSize:15, fontWeight:800, color:'#0f172a' }}>역할별 회원 현황</div>
                    <div style={{ padding:18 }}>
                      {[
                        ['학생', stats.users?.students||0, '#3b82f6'],
                        ['교수', stats.users?.professors||0, '#8b5cf6'],
                        ['외부인', Math.max(0, (stats.users?.total||0) - (stats.users?.students||0) - (stats.users?.professors||0)), '#f97316'],
                      ].map(([label, val, color]) => {
                        const total = stats.users?.total || 1;
                        const pct = Math.round((val as number) / total * 100);
                        return (
                          <div key={label as string} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                            <div style={{ fontSize:12, color:'#475569', width:50, textAlign:'right', flexShrink:0 }}>{label}</div>
                            <div style={{ flex:1, height:20, background:'#f1f5f9', borderRadius:99, overflow:'hidden' }}>
                              <div style={{ width:`${Math.max(pct,5)}%`, height:'100%', background:color as string, borderRadius:99, display:'flex', alignItems:'center', paddingLeft:8, transition:'width .6s ease' }}>
                                <span style={{ fontSize:10, fontWeight:700, color:'#fff' }}>{val}명</span>
                              </div>
                            </div>
                            <div style={{ fontSize:12, fontWeight:700, color:'#0f172a', width:24, flexShrink:0 }}>{val}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 최근 로그 */}
                <div style={card}>
                  <div style={{ padding:'16px 18px 12px', borderBottom:'1px solid #f1f5f9', fontSize:15, fontWeight:800, color:'#0f172a' }}>최근 로그인 실패</div>
                  {logs.length === 0 ? (
                    <div style={{ padding:24, textAlign:'center', color:'#94a3b8', fontSize:13 }}>최근 로그인 실패 기록이 없습니다.</div>
                  ) : logs.slice(0,8).map((l:any, i:number) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 18px', borderBottom:'1px solid #f8fafc', fontSize:12 }}>
                      <div style={{ width:8, height:8, borderRadius:'50%', background:'#ef4444', flexShrink:0 }}/>
                      <div style={{ flex:1, color:'#374151' }}><strong>{l.email}</strong> 로그인 실패 — {l.fail_reason}</div>
                      <div style={{ color:'#94a3b8', flexShrink:0 }}>{new Date(l.created_at).toLocaleString('ko-KR')}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── 회원 관리 ── */}
        {tab === 'users' && (
          <div style={card}>
            <div style={{ padding:'16px 18px 12px', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ fontSize:15, fontWeight:800, color:'#0f172a' }}>회원 관리</div>
              <span style={{ fontSize:12, color:'#94a3b8' }}>총 {users.length}명</span>
            </div>
            {loading ? <div style={{ padding:40, textAlign:'center' }}><Loader2 size={20}/></div> : (
              <>
                <div style={{ ...tblHead('1fr 1.4fr 80px 90px 70px 120px') }}>
                  <div>이름</div><div>이메일</div><div>역할</div><div>학번</div><div>상태</div><div>관리</div>
                </div>
                {users.map(u => (
                  <div key={u.id} style={{ ...tblRow('1fr 1.4fr 80px 90px 70px 120px') }}
                    onMouseEnter={e => (e.currentTarget.style.background='#f8fafc')}
                    onMouseLeave={e => (e.currentTarget.style.background='#fff')}>
                    <div style={{ fontWeight:600, fontSize:13 }}>{u.name}</div>
                    <div style={{ fontSize:12, color:'#64748b', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.email}</div>
                    <div><span style={{ padding:'3px 9px', borderRadius:5, fontSize:11, fontWeight:700, background:roleBg(u.role), color:roleColor(u.role) }}>{roleLabel(u.role)}</span></div>
                    <div style={{ fontSize:12, color:'#94a3b8' }}>{u.student_id||'-'}</div>
                    <div><span style={{ padding:'3px 9px', borderRadius:5, fontSize:11, fontWeight:700, background:u.is_active?'#f0fdf4':'#f8fafc', color:u.is_active?'#15803d':'#94a3b8' }}>{u.is_active?'활성':'비활성'}</span></div>
                    <div style={{ display:'flex', gap:5 }}>
                      <button onClick={() => toggleUser(u.id)} style={{ ...actBtn(!u.is_active), borderColor:u.is_active?'#e2e8f0':'#bbf7d0', color:u.is_active?'#94a3b8':'#15803d', background:u.is_active?'#fff':'#f0fdf4' }}>
                        {u.is_active?'비활성화':'활성화'}
                      </button>
                      <button onClick={() => deleteUser(u.id)} style={actBtn(true)}>삭제</button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* ── 게시글 관리 ── */}
        {tab === 'posts' && (
          <div style={card}>
            <div style={{ padding:'16px 18px 12px', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ fontSize:15, fontWeight:800, color:'#0f172a' }}>게시글 관리</div>
              <span style={{ fontSize:12, color:'#94a3b8' }}>총 {posts.length}개</span>
            </div>
            {loading ? <div style={{ padding:40, textAlign:'center' }}><Loader2 size={20}/></div> : (
              <>
                <div style={{ ...tblHead('1fr 80px 70px 60px 60px') }}>
                  <div>제목</div><div>작성자</div><div>게시판</div><div>날짜</div><div>관리</div>
                </div>
                {posts.length === 0 ? (
                  <div style={{ padding:32, textAlign:'center', color:'#94a3b8', fontSize:13 }}>게시글이 없습니다.</div>
                ) : posts.map(p => (
                  <div key={`${p.board}-${p.id}`} style={{ ...tblRow('1fr 80px 70px 60px 60px') }}
                    onMouseEnter={e => (e.currentTarget.style.background='#f8fafc')}
                    onMouseLeave={e => (e.currentTarget.style.background='#fff')}>
                    <div style={{ fontSize:13, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.title}</div>
                    <div style={{ fontSize:12, color:'#64748b' }}>{p.author_name}</div>
                    <div><span style={{ padding:'2px 8px', borderRadius:5, fontSize:10, fontWeight:700, background:p.board==='공지'?'#eff6ff':'#f8fafc', color:p.board==='공지'?'#1d4ed8':'#475569' }}>{p.board}</span></div>
                    <div style={{ fontSize:12, color:'#94a3b8' }}>{new Date(p.created_at).toLocaleDateString('ko-KR', { month:'2-digit', day:'2-digit' })}</div>
                    <div><button onClick={() => deletePost(p.id, p.board)} style={actBtn(true)}>삭제</button></div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* ── 활동 로그 ── */}
        {tab === 'logs' && (
          <div style={card}>
            <div style={{ padding:'16px 18px 12px', borderBottom:'1px solid #f1f5f9', fontSize:15, fontWeight:800, color:'#0f172a' }}>로그인 실패 로그</div>
            {loading ? <div style={{ padding:40, textAlign:'center' }}><Loader2 size={20}/></div> :
            logs.length === 0 ? (
              <div style={{ padding:32, textAlign:'center', color:'#94a3b8', fontSize:13 }}>로그 기록이 없습니다.</div>
            ) : logs.map((l:any, i:number) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 18px', borderBottom:'1px solid #f8fafc', fontSize:12 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:'#ef4444', flexShrink:0 }}/>
                <div style={{ flex:1, color:'#374151' }}>
                  <strong>{l.email}</strong> — {l.fail_reason}
                  {l.ip && <span style={{ color:'#94a3b8', marginLeft:8 }}>({l.ip})</span>}
                </div>
                <div style={{ color:'#94a3b8', flexShrink:0 }}>{new Date(l.created_at).toLocaleString('ko-KR')}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── 게시판 설정 ── */}
        {tab === 'board' && (
          <div style={card}>
            <div style={{ padding:'16px 18px 12px', borderBottom:'1px solid #f1f5f9', fontSize:15, fontWeight:800, color:'#0f172a' }}>게시판 설정</div>
            <div style={{ ...tblHead('1fr 120px 80px 80px') }}>
              <div>게시판명</div><div>쓰기 권한</div><div>상태</div><div>관리</div>
            </div>
            {[
              { name:'공지사항',   perm:'교수 이상', active:true },
              { name:'학사일정',   perm:'교수 이상', active:true },
              { name:'자유게시판', perm:'전체',      active:true },
              { name:'체크리스트', perm:'본인만',    active:true },
            ].map(b => (
              <div key={b.name} style={{ ...tblRow('1fr 120px 80px 80px') }}
                onMouseEnter={e => (e.currentTarget.style.background='#f8fafc')}
                onMouseLeave={e => (e.currentTarget.style.background='#fff')}>
                <div style={{ fontWeight:600, fontSize:13 }}>{b.name}</div>
                <div style={{ fontSize:12, color:'#64748b' }}>{b.perm}</div>
                <div>
                  <div style={{ width:38, height:20, borderRadius:10, background:b.active?'#3b82f6':'#e2e8f0', position:'relative', cursor:'pointer' }}>
                    <div style={{ position:'absolute', width:14, height:14, background:'#fff', borderRadius:'50%', top:3, right:b.active?3:'auto', left:b.active?'auto':3, boxShadow:'0 1px 2px rgba(0,0,0,.15)' }}/>
                  </div>
                </div>
                <div>
                  <button onClick={() => toast('게시판 설정은 준비 중입니다.')} style={actBtn()}>설정</button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
