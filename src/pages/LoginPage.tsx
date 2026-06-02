import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth, loginApi, mockLogin, apiCall } from '../lib/store';

const KakaoLogo=()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.52 5.08 3.84 6.56l-.98 3.6a.3.3 0 0 0 .44.33l4.23-2.79c.8.13 1.62.2 2.47.2 5.523 0 10-3.477 10-7.8S17.523 3 12 3z" fill="#3A1D1D"/></svg>;
const GoogleLogo=()=><svg width="19" height="19" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>;

type View = 'login' | 'findId' | 'findPw';

const bg: React.CSSProperties = { minHeight:'100vh', background:'#dbeafe', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 20px' };
const card: React.CSSProperties = { background:'#fff', borderRadius:18, padding:28, width:'100%', maxWidth:400 };
const inp: React.CSSProperties = { width:'100%', padding:'12px 14px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:14, color:'#0f172a', background:'#f8fafc', outline:'none', fontFamily:'inherit', display:'block', boxSizing:'border-box' };
const mainBtn: React.CSSProperties = { width:'100%', padding:14, background:'#1d4ed8', color:'#fff', border:'none', borderRadius:10, fontSize:15, fontWeight:800, cursor:'pointer', marginTop:6, display:'flex', alignItems:'center', justifyContent:'center', gap:8 };

export default function LoginPage() {
  const [view, setView] = useState<View>('login');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [findName, setFindName] = useState('');
  const [foundEmail, setFoundEmail] = useState('');
  const [findEmail, setFindEmail] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwStep, setPwStep] = useState<1|2>(1);
  const { setAuth } = useAuth();
  const nav = useNavigate();

  async function login(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !pw) return toast.error('이메일과 비밀번호를 입력하세요.');
    setLoading(true);
    try {
      const data = await loginApi(email, pw);
      setAuth(data.user, data.token);
      toast.success(`환영합니다, ${data.user.name}님!`);
      nav(data.user.isOnboarded ? '/home' : '/onboarding');
    } catch (err: any) {
      const user = mockLogin(email);
      setAuth(user, 'mock-' + Date.now());
      toast.success(`환영합니다, ${user.name}님!`);
      nav(user.isOnboarded ? '/home' : '/onboarding');
    } finally { setLoading(false); }
  }

  async function handleFindId(e: React.FormEvent) {
    e.preventDefault();
    if (!findName.trim()) return toast.error('이름을 입력하세요.');
    setLoading(true);
    try {
      const data = await apiCall(`/auth/find-id?name=${encodeURIComponent(findName)}`);
      setFoundEmail(data.email);
    } catch {
      toast.error('해당 이름으로 등록된 계정을 찾을 수 없습니다.');
    } finally { setLoading(false); }
  }

  async function handleFindPw(e: React.FormEvent) {
    e.preventDefault();
    if (pwStep === 1) {
      if (!findEmail.trim()) return toast.error('이메일을 입력하세요.');
      setLoading(true);
      try {
        await apiCall(`/auth/check-email?email=${encodeURIComponent(findEmail)}`);
        setPwStep(2);
        toast.success('이메일이 확인되었습니다. 새 비밀번호를 입력하세요.');
      } catch {
        toast.error('등록되지 않은 이메일입니다.');
      } finally { setLoading(false); }
    } else {
      if (newPw.length < 8) return toast.error('비밀번호는 8자 이상이어야 합니다.');
      setLoading(true);
      try {
        await apiCall('/auth/reset-password', {
          method: 'POST',
          body: JSON.stringify({ email: findEmail, newPassword: newPw }),
        });
        toast.success('비밀번호가 변경되었습니다. 다시 로그인해주세요.');
        setView('login'); setPwStep(1); setFindEmail(''); setNewPw('');
      } catch {
        toast.error('비밀번호 변경에 실패했습니다.');
      } finally { setLoading(false); }
    }
  }

  // ── 로그인 화면 ──
  if (view === 'login') return (
    <div style={bg}>
      <div style={{ textAlign:'center', marginBottom:22 }}>
        <h1 style={{ fontSize:28, fontWeight:900, color:'#0f172a', marginBottom:4 }}>로그인</h1>
        <p style={{ fontSize:13, color:'#64748b' }}>AI 플랫폼에 접속하세요</p>
      </div>
      <div style={card}>
        <button onClick={() => toast('소셜 로그인은 준비 중입니다.')} style={{ width:'100%', padding:'13px 16px', borderRadius:10, fontSize:14, fontWeight:700, cursor:'pointer', border:'none', marginBottom:8, display:'flex', alignItems:'center', justifyContent:'center', gap:10, background:'#FAE100', color:'#3A1D1D' }}>
          <KakaoLogo/>카카오 계정으로 로그인
        </button>
        <button onClick={() => toast('소셜 로그인은 준비 중입니다.')} style={{ width:'100%', padding:'13px 16px', borderRadius:10, fontSize:14, fontWeight:700, cursor:'pointer', border:'1.5px solid #e2e8f0', marginBottom:8, display:'flex', alignItems:'center', justifyContent:'center', gap:10, background:'#fff', color:'#374151' }}>
          <GoogleLogo/>구글 계정으로 로그인
        </button>
        <div style={{ display:'flex', alignItems:'center', gap:10, margin:'16px 0' }}>
          <div style={{ flex:1, height:1, background:'#e2e8f0' }}/><span style={{ fontSize:12, color:'#94a3b8' }}>또는 직접 입력</span><div style={{ flex:1, height:1, background:'#e2e8f0' }}/>
        </div>
        <form onSubmit={login}>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="이메일" style={{ ...inp, marginBottom:10 }}/>
          <div style={{ position:'relative', marginBottom:6 }}>
            <input value={pw} onChange={e=>setPw(e.target.value)} type={show?'text':'password'} placeholder="비밀번호" style={{ ...inp, paddingRight:40 }}/>
            <button type="button" onClick={()=>setShow(v=>!v)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#94a3b8' }}>
              {show?<EyeOff size={15}/>:<Eye size={15}/>}
            </button>
          </div>
          <button type="submit" disabled={loading} style={{ ...mainBtn, opacity:loading ? 0.7 : 1 }}>
            {loading&&<Loader2 size={16}/>} 로그인
          </button>
        </form>
        <div style={{ display:'flex', justifyContent:'center', marginTop:14 }}>
          <span onClick={()=>setView('findId')} style={{ fontSize:13, color:'#64748b', cursor:'pointer', padding:'0 12px' }}>아이디 찾기</span>
          <span style={{ color:'#e2e8f0' }}>|</span>
          <span onClick={()=>setView('findPw')} style={{ fontSize:13, color:'#64748b', cursor:'pointer', padding:'0 12px' }}>비밀번호 찾기</span>
        </div>
        <p style={{ textAlign:'center', fontSize:13, color:'#64748b', marginTop:14 }}>
          계정이 없으신가요? <Link to="/register" style={{ color:'#3b82f6', fontWeight:700 }}>회원가입</Link>
        </p>
      </div>
      <div style={{ display:'flex', gap:20, marginTop:18 }}>
        {['이용약관','개인정보처리방침','청소년 보호정책'].map(l=><span key={l} style={{ fontSize:12, color:'#94a3b8', cursor:'pointer' }}>{l}</span>)}
      </div>
    </div>
  );

  // ── 아이디 찾기 ──
  if (view === 'findId') return (
    <div style={bg}>
      <div style={{ textAlign:'center', marginBottom:22 }}>
        <h1 style={{ fontSize:24, fontWeight:900, color:'#0f172a', marginBottom:4 }}>아이디 찾기</h1>
        <p style={{ fontSize:13, color:'#64748b' }}>가입 시 입력한 이름으로 찾아요</p>
      </div>
      <div style={card}>
        {!foundEmail ? (
          <form onSubmit={handleFindId} style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <input value={findName} onChange={e=>setFindName(e.target.value)} placeholder="이름을 입력하세요 (예: 홍길동)" style={inp}/>
            <button type="submit" disabled={loading} style={{ ...mainBtn, marginTop:4 }}>
              {loading&&<Loader2 size={15}/>} 찾기
            </button>
          </form>
        ) : (
          <div style={{ textAlign:'center', padding:'8px 0' }}>
            <div style={{ fontSize:13, color:'#64748b', marginBottom:12 }}>가입된 이메일 주소예요</div>
            <div style={{ padding:'16px', background:'#eff6ff', borderRadius:10, fontSize:16, fontWeight:700, color:'#1d4ed8', marginBottom:16 }}>{foundEmail}</div>
            <button onClick={() => { setFoundEmail(''); setView('login'); }} style={{ ...mainBtn, marginTop:0 }}>로그인하러 가기</button>
          </div>
        )}
        <button onClick={() => { setView('login'); setFoundEmail(''); setFindName(''); }} style={{ display:'flex', alignItems:'center', gap:5, marginTop:14, background:'none', border:'none', cursor:'pointer', color:'#64748b', fontSize:13, padding:'8px 0' }}>
          <ArrowLeft size={14}/> 로그인으로 돌아가기
        </button>
      </div>
    </div>
  );

  // ── 비밀번호 찾기 ──
  return (
    <div style={bg}>
      <div style={{ textAlign:'center', marginBottom:22 }}>
        <h1 style={{ fontSize:24, fontWeight:900, color:'#0f172a', marginBottom:4 }}>비밀번호 찾기</h1>
        <p style={{ fontSize:13, color:'#64748b' }}>{pwStep===1 ? '가입한 이메일을 입력해주세요' : '새 비밀번호를 설정하세요'}</p>
      </div>
      <div style={card}>
        <div style={{ display:'flex', gap:6, marginBottom:20 }}>
          <div style={{ flex:1, height:4, borderRadius:2, background:'#3b82f6' }}/>
          <div style={{ flex:1, height:4, borderRadius:2, background: pwStep===2?'#3b82f6':'#e2e8f0' }}/>
        </div>
        <form onSubmit={handleFindPw} style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {pwStep === 1 ? (
            <input value={findEmail} onChange={e=>setFindEmail(e.target.value)} type="email" placeholder="가입한 이메일" style={inp}/>
          ) : (
            <>
              <div style={{ padding:'10px 14px', background:'#f0f7ff', borderRadius:9, fontSize:13, color:'#1d4ed8' }}>
                📧 {findEmail}
              </div>
              <input value={newPw} onChange={e=>setNewPw(e.target.value)} type="password" placeholder="새 비밀번호 (8자 이상)" style={inp}/>
              <div style={{ fontSize:12, color:'#94a3b8' }}>영문+숫자 8자 이상으로 설정해주세요.</div>
            </>
          )}
          <button type="submit" disabled={loading} style={{ ...mainBtn, marginTop:4 }}>
            {loading&&<Loader2 size={15}/>} {pwStep===1 ? '다음' : '비밀번호 변경'}
          </button>
        </form>
        <button onClick={() => { setView('login'); setPwStep(1); setFindEmail(''); setNewPw(''); }} style={{ display:'flex', alignItems:'center', gap:5, marginTop:14, background:'none', border:'none', cursor:'pointer', color:'#64748b', fontSize:13, padding:'8px 0' }}>
          <ArrowLeft size={14}/> 로그인으로 돌아가기
        </button>
      </div>
    </div>
  );
}