import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth, mockLogin } from '../lib/store';
import { ptuDepartments, collegeLabels } from '../lib/mockData';

const KakaoLogo=()=><svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.52 5.08 3.84 6.56l-.98 3.6a.3.3 0 0 0 .44.33l4.23-2.79c.8.13 1.62.2 2.47.2 5.523 0 10-3.477 10-7.8S17.523 3 12 3z" fill="#3A1D1D"/></svg>;
const GoogleLogo=()=><svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>;
const inp:React.CSSProperties={width:'100%',padding:'11px 13px',border:'1.5px solid #e2e8f0',borderRadius:9,fontSize:13,color:'#0f172a',background:'#f8fafc',outline:'none',fontFamily:'inherit',boxSizing:'border-box'};
const mainBtn:React.CSSProperties={width:'100%',padding:13,background:'#1d4ed8',color:'#fff',border:'none',borderRadius:10,fontSize:14,fontWeight:800,cursor:'pointer',marginTop:8};
const outBtn:React.CSSProperties={width:'100%',padding:12,background:'#fff',color:'#64748b',border:'1.5px solid #e2e8f0',borderRadius:10,fontSize:13,fontWeight:600,cursor:'pointer',marginTop:8};

export function RegisterPage() {
  const [email,setEmail]=useState(''); const [pw,setPw]=useState(''); const [pw2,setPw2]=useState('');
  const [ag1,setAg1]=useState(false); const [ag2,setAg2]=useState(false); const [ag3,setAg3]=useState(false);
  const {setAuth}=useAuth(); const nav=useNavigate();

  function submit(e:React.FormEvent){
    e.preventDefault();
    if(pw!==pw2) return toast.error('비밀번호가 일치하지 않습니다.');
    if(!ag1||!ag2) return toast.error('필수 동의 항목을 확인해주세요.');
    const user=mockLogin(email); user.isOnboarded=false;
    setAuth(user,'mock-'+Date.now()); nav('/onboarding');
  }
  const all=ag1&&ag2&&ag3;
  function toggleAll(v:boolean){setAg1(v);setAg2(v);setAg3(v);}

  return (
    <div style={{minHeight:'100vh',background:'#dbeafe',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-start',padding:'28px 20px'}}>
      <div style={{textAlign:'center',marginBottom:20}}><h1 style={{fontSize:26,fontWeight:900,color:'#0f172a',marginBottom:4}}>회원가입</h1><p style={{fontSize:13,color:'#64748b'}}>이메일 또는 소셜 계정으로 시작하세요</p></div>
      <div style={{background:'#fff',borderRadius:18,padding:28,width:'100%',maxWidth:420}}>
        <button onClick={()=>{const u=mockLogin('kakao@example.com');u.isOnboarded=false;setAuth(u,'mock-'+Date.now());nav('/onboarding');}} style={{width:'100%',padding:'12px 16px',borderRadius:10,fontSize:14,fontWeight:700,cursor:'pointer',border:'none',marginBottom:8,display:'flex',alignItems:'center',justifyContent:'center',gap:10,background:'#FAE100',color:'#3A1D1D'}}><KakaoLogo/>카카오로 시작하기</button>
        <button onClick={()=>{const u=mockLogin('google@example.com');u.isOnboarded=false;setAuth(u,'mock-'+Date.now());nav('/onboarding');}} style={{width:'100%',padding:'12px 16px',borderRadius:10,fontSize:14,fontWeight:700,cursor:'pointer',border:'1.5px solid #e2e8f0',marginBottom:8,display:'flex',alignItems:'center',justifyContent:'center',gap:10,background:'#fff',color:'#374151'}}><GoogleLogo/>구글로 시작하기</button>
        <div style={{display:'flex',alignItems:'center',gap:10,margin:'14px 0'}}><div style={{flex:1,height:1,background:'#e2e8f0'}}/><span style={{fontSize:12,color:'#94a3b8'}}>또는 이메일로 가입</span><div style={{flex:1,height:1,background:'#e2e8f0'}}/></div>
        <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:10}}>
          <input style={inp} type="email" placeholder="이메일" value={email} onChange={e=>setEmail(e.target.value)} required/>
          <input style={inp} type="password" placeholder="비밀번호 (8자 이상)" value={pw} onChange={e=>setPw(e.target.value)} required/>
          <input style={inp} type="password" placeholder="비밀번호 확인" value={pw2} onChange={e=>setPw2(e.target.value)} required/>
          <div style={{background:'#f0f7ff',border:'1.5px solid #dbeafe',borderRadius:12,padding:14,marginTop:2}}>
            <div style={{fontSize:13,fontWeight:800,color:'#1d4ed8',marginBottom:10}}>개인정보 수집·이용 동의</div>
            {[{v:all,fn:toggleAll,l:'전체 동의합니다',s:'필수 및 선택 항목에 모두 동의합니다',divider:true},{v:ag1,fn:setAg1,l:'[필수] 개인정보 수집·이용 동의',s:'수집항목: 이름, 학번, 연락처 | 목적: 플랫폼 서비스 운영'},{v:ag2,fn:setAg2,l:'[필수] 민감정보 처리 동의',s:'수집항목: 이름, 학과, 학번, 연락처'},{v:ag3,fn:setAg3,l:'[선택] 이메일 수신 동의',s:'학과 행사, 공지사항 이메일 수신 동의'}].map((item,i)=>(
              <div key={i} style={{display:'flex',alignItems:'flex-start',gap:9,padding:'7px 0',borderBottom:item.divider?'1.5px solid #bfdbfe':i<3?'1px solid #dbeafe':'none',marginBottom:item.divider?4:0}}>
                <input type="checkbox" checked={item.v as boolean} onChange={e=>(item.fn as Function)(e.target.checked)} style={{width:15,height:15,accentColor:'#3b82f6',flexShrink:0,marginTop:3,cursor:'pointer'}}/>
                <div><div style={{fontSize:13,color:'#1e293b',fontWeight:item.divider?800:500}}>{item.l}</div><div style={{fontSize:11,color:'#64748b',marginTop:1,lineHeight:1.5}}>{item.s}</div></div>
              </div>
            ))}
          </div>
          <button type="submit" style={mainBtn}>다음 — 프로필 설정</button>
        </form>
        <p style={{textAlign:'center',fontSize:13,color:'#64748b',marginTop:14}}>이미 계정이 있으신가요? <Link to="/login" style={{color:'#3b82f6',fontWeight:700}}>로그인</Link></p>
      </div>
    </div>
  );
}

export function OnboardingPage() {
  const {user,setUser}=useAuth(); const nav=useNavigate();
  const [step,setStep]=useState(1);
  const [name,setName]=useState(user?.name||'');
  const [role,setRole]=useState<'student'|'professor'|'external'>('student');
  const [studentId,setStudentId]=useState('');
  const [college,setCollege]=useState('it');
  const [dept,setDept]=useState('스마트콘텐츠학과');
  const [joinPath,setJoinPath]=useState('');

  function finish(){
    if(!user) return;
    setUser({...user,name,role,studentId:role!=='external'?studentId:undefined,department:role!=='external'?dept:undefined,isOnboarded:true});
    toast.success('프로필 설정 완료! 환영합니다 🎉');
    nav('/home');
  }

  const PBar=()=>(<div style={{display:'flex',gap:6,marginBottom:22}}>{[1,2,3].map(i=><div key={i} style={{flex:1,height:4,borderRadius:2,background:i<=step?'#3b82f6':'#e2e8f0',transition:'background .3s'}}/>)}</div>);
  const Hdr=({s,title,sub}:{s:number;title:string;sub:string})=>(<div style={{textAlign:'center',marginBottom:22}}><div style={{fontSize:13,color:'#3b82f6',fontWeight:700,marginBottom:6}}>프로필 설정 {s} / 3</div><h1 style={{fontSize:22,fontWeight:900,color:'#0f172a',marginBottom:4}}>{title}</h1><p style={{fontSize:13,color:'#64748b'}}>{sub}</p></div>);

  return (
    <div style={{minHeight:'100vh',background:'#dbeafe',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24}}>
      {step===1&&<div style={{width:'100%',maxWidth:460}}><Hdr s={1} title="안녕하세요!" sub="처음 이용하시는군요. 간단한 정보를 입력해주세요."/><div style={{background:'#fff',borderRadius:18,padding:28}}><PBar/><div style={{fontSize:12,fontWeight:700,color:'#374151',marginBottom:6}}>이름</div><input style={{...inp,marginBottom:10}} placeholder="홍길동" value={name} onChange={e=>setName(e.target.value)}/><button style={mainBtn} onClick={()=>{if(!name.trim())return toast.error('이름을 입력해주세요.');setStep(2);}}>다음</button></div></div>}
      {step===2&&<div style={{width:'100%',maxWidth:460}}><Hdr s={2} title="역할을 선택해주세요" sub="선택한 역할에 따라 이용 기능이 달라집니다."/><div style={{background:'#fff',borderRadius:18,padding:28}}><PBar/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:16}}>{[{k:'student',l:'학생',i:'🎓'},{k:'professor',l:'교수',i:'👨‍🏫'},{k:'external',l:'외부인',i:'🌐'}].map(r=><div key={r.k} onClick={()=>setRole(r.k as any)} style={{border:`2px solid ${role===r.k?'#3b82f6':'#e2e8f0'}`,borderRadius:12,padding:'16px 8px',textAlign:'center',cursor:'pointer',background:role===r.k?'#eff6ff':'#f8fafc',transition:'all .15s'}}><div style={{fontSize:22,marginBottom:7}}>{r.i}</div><div style={{fontSize:13,fontWeight:700,color:role===r.k?'#1d4ed8':'#374151'}}>{r.l}</div></div>)}</div>
        <button style={mainBtn} onClick={()=>setStep(3)}>다음</button><button style={outBtn} onClick={()=>setStep(1)}>이전</button></div></div>}
      {step===3&&<div style={{width:'100%',maxWidth:460}}><Hdr s={3} title="추가 정보 입력" sub="마지막 단계예요!"/><div style={{background:'#fff',borderRadius:18,padding:28}}><PBar/>
        {role!=='external'?(<>
          <div style={{fontSize:12,fontWeight:700,color:'#374151',marginBottom:6}}>학번 / 교번</div>
          <input style={{...inp,marginBottom:14}} placeholder="2026000000" value={studentId} onChange={e=>setStudentId(e.target.value)}/>
          <div style={{fontSize:12,fontWeight:700,color:'#374151',marginBottom:8}}>단과대학 선택</div>
          <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:12,justifyContent:'center'}}>{Object.entries(collegeLabels).map(([k,l])=><div key={k} onClick={()=>{setCollege(k);setDept(ptuDepartments[k][0]);}} style={{padding:'6px 12px',border:`1.5px solid ${college===k?'#3b82f6':'#e2e8f0'}`,borderRadius:99,fontSize:12,fontWeight:600,cursor:'pointer',background:college===k?'#3b82f6':'#f8fafc',color:college===k?'#fff':'#64748b',transition:'all .15s'}}>{l}</div>)}</div>
          <div style={{fontSize:12,fontWeight:700,color:'#374151',marginBottom:8,textAlign:'center'}}>학과 선택</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7,marginBottom:10,maxHeight:180,overflowY:'auto'}}>{ptuDepartments[college].map(d=><div key={d} onClick={()=>setDept(d)} style={{padding:'10px 12px',border:`1.5px solid ${dept===d?'#3b82f6':'#e2e8f0'}`,borderRadius:9,fontSize:12,fontWeight:dept===d?700:500,cursor:'pointer',background:dept===d?'#eff6ff':'#f8fafc',color:dept===d?'#1d4ed8':'#374151',textAlign:'center',transition:'all .15s',lineHeight:1.4}}>{d}</div>)}</div>
          <div style={{padding:'11px 14px',background:'#eff6ff',border:'1.5px solid #bfdbfe',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',gap:8,fontSize:13,color:'#1d4ed8',fontWeight:700,marginBottom:6}}>선택된 학과: {dept}</div>
        </>):(<>
          <div style={{fontSize:13,fontWeight:700,color:'#374151',marginBottom:10}}>가입 경로를 알려주세요</div>
          {['지인 소개','학교 홈페이지','SNS / 커뮤니티','검색 엔진','기타'].map(p=><div key={p} onClick={()=>setJoinPath(p)} style={{padding:'12px 16px',border:`1.5px solid ${joinPath===p?'#3b82f6':'#e2e8f0'}`,borderRadius:10,cursor:'pointer',fontSize:13,fontWeight:600,color:joinPath===p?'#1d4ed8':'#374151',background:joinPath===p?'#eff6ff':'#f8fafc',marginBottom:8,transition:'all .15s'}}>{p}</div>)}
        </>)}
        <button style={mainBtn} onClick={finish}>시작하기</button>
        <button style={outBtn} onClick={()=>setStep(2)}>이전</button>
      </div></div>}
    </div>
  );
}

export default RegisterPage;
