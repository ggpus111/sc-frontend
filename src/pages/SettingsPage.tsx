import { useState } from 'react';
import { User, Lock, Bell, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../lib/store';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const KakaoLogo=()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.52 5.08 3.84 6.56l-.98 3.6a.3.3 0 0 0 .44.33l4.23-2.79c.8.13 1.62.2 2.47.2 5.523 0 10-3.477 10-7.8S17.523 3 12 3z" fill="#3A1D1D"/></svg>;
const GoogleLogo=()=><svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>;

type Tab='profile'|'social'|'notify'|'account';
const inp:React.CSSProperties={width:'100%',padding:'11px 13px',border:'1.5px solid #e2e8f0',borderRadius:9,fontSize:13,color:'#0f172a',background:'#f8fafc',outline:'none',fontFamily:'inherit',boxSizing:'border-box'};
const lockedInp:React.CSSProperties={...inp,background:'#f1f5f9',color:'#94a3b8',border:'1.5px solid #f1f5f9',cursor:'not-allowed'};

function Toggle({on,onChange}:{on:boolean;onChange:(v:boolean)=>void}){
  return<div onClick={()=>onChange(!on)} style={{width:42,height:24,borderRadius:12,background:on?'#3b82f6':'#e2e8f0',position:'relative',cursor:'pointer',transition:'background .2s',flexShrink:0}}>
    <div style={{position:'absolute',width:18,height:18,background:'#fff',borderRadius:'50%',top:3,left:on?21:3,transition:'left .2s',boxShadow:'0 1px 3px rgba(0,0,0,.15)'}}/>
  </div>;
}

export default function SettingsPage(){
  const {user,setUser,logout}=useAuth(); const nav=useNavigate();
  const [tab,setTab]=useState<Tab>('profile');
  const [bio,setBio]=useState(user?.bio||'');
  const [pw,setPw]=useState({cur:'',next:'',confirm:''});
  const [showPw,setShowPw]=useState({cur:false,next:false,confirm:false});
  const [notifs,setNotifs]=useState({notice:true,checklist:true,schedule:true,comment:false,email:false});

  function saveProfile(){
    if(!user) return;
    setUser({...user,bio});
    toast.success('저장되었습니다.');
  }
  function changePw(e:React.FormEvent){
    e.preventDefault();
    if(pw.next!==pw.confirm) return toast.error('새 비밀번호가 일치하지 않습니다.');
    if(pw.next.length<8) return toast.error('비밀번호는 8자 이상이어야 합니다.');
    toast.success('비밀번호가 변경되었습니다.');
    setPw({cur:'',next:'',confirm:''});
  }
  function handleLogout(){logout();toast.success('로그아웃되었습니다.');nav('/');}

  const roleLabel=user?.role==='admin'?'관리자':user?.role==='professor'?'교수':'학생';
  const roleBg=user?.role==='admin'?'#fef3c7':user?.role==='professor'?'#f5f3ff':'#eff6ff';
  const roleColor=user?.role==='admin'?'#92400e':user?.role==='professor'?'#6d28d9':'#1d4ed8';

  const navItems=[
    {id:'profile',icon:User,label:'프로필 설정'},
    {id:'social',icon:ChevronRight,label:'소셜 계정 연결'},
    {id:'notify',icon:Bell,label:'알림 설정'},
    {id:'account',icon:Lock,label:'계정 관리'},
  ] as const;

  return(
    <div style={{maxWidth:860,margin:'0 auto',display:'grid',gridTemplateColumns:'220px 1fr',gap:18,alignItems:'start'}}>
      {/* 사이드 */}
      <div style={{background:'#fff',borderRadius:14,border:'1px solid #e2e8f0',padding:14}}>
        <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',padding:'4px 12px',marginBottom:4,letterSpacing:.5}}>계정</div>
        {navItems.map(({id,icon:Icon,label})=>(
          <div key={id} onClick={()=>setTab(id)} style={{display:'flex',alignItems:'center',gap:9,padding:'10px 12px',borderRadius:9,cursor:'pointer',fontSize:13,fontWeight:tab===id?700:500,color:tab===id?'#1d4ed8':'#475569',background:tab===id?'#eff6ff':'none',marginBottom:2,transition:'all .15s'}} onMouseEnter={e=>tab!==id&&((e.currentTarget as HTMLElement).style.background='#f1f5f9')} onMouseLeave={e=>tab!==id&&((e.currentTarget as HTMLElement).style.background='none')}>
            <Icon size={15}/>{label}
          </div>
        ))}
        <div style={{height:1,background:'#f1f5f9',margin:'8px 0'}}/>
        <div onClick={handleLogout} style={{display:'flex',alignItems:'center',gap:9,padding:'10px 12px',borderRadius:9,cursor:'pointer',fontSize:13,fontWeight:500,color:'#ef4444',marginTop:4}} onMouseEnter={e=>(e.currentTarget.style.background='#fef2f2')} onMouseLeave={e=>(e.currentTarget.style.background='none')}>
          <LogOut size={15}/>로그아웃
        </div>
      </div>

      {/* 콘텐츠 */}
      <div>
        {tab==='profile'&&(
          <div style={{background:'#fff',borderRadius:14,border:'1px solid #e2e8f0',padding:24}}>
            <div style={{fontSize:17,fontWeight:900,color:'#0f172a',marginBottom:4}}>프로필 설정</div>
            <div style={{fontSize:13,color:'#64748b',marginBottom:22}}>이름, 학번, 이메일은 변경할 수 없어요.</div>
            <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:22}}>
              <div style={{width:68,height:68,background:'#dbeafe',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:900,color:'#3b82f6',flexShrink:0}}>{user?.name?.[0]}</div>
              <div>
                <div style={{fontSize:16,fontWeight:800,color:'#0f172a'}}>{user?.name}</div>
                <div style={{fontSize:12,color:'#94a3b8',marginTop:2}}>{user?.email}</div>
                <span style={{display:'inline-block',marginTop:5,padding:'3px 10px',borderRadius:99,fontSize:11,fontWeight:700,background:roleBg,color:roleColor}}>{roleLabel}</span>
              </div>
            </div>
            <div style={{height:1,background:'#f1f5f9',marginBottom:18}}/>
            {/* 잠긴 필드 */}
            <div style={{background:'#f8fafc',border:'1.5px solid #f1f5f9',borderRadius:12,padding:16,marginBottom:16}}>
              <div style={{fontSize:12,fontWeight:700,color:'#94a3b8',marginBottom:12,display:'flex',alignItems:'center',gap:6}}><Lock size={12}/>변경 불가 항목 (관리자 문의)</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
                <div><label style={{fontSize:12,fontWeight:700,color:'#94a3b8',marginBottom:5,display:'block'}}>이름</label><div style={{...lockedInp,display:'flex',alignItems:'center',gap:7}}><Lock size={12} color="#cbd5e1"/>{user?.name}</div></div>
                <div><label style={{fontSize:12,fontWeight:700,color:'#94a3b8',marginBottom:5,display:'block'}}>학번</label><div style={{...lockedInp,display:'flex',alignItems:'center',gap:7}}><Lock size={12} color="#cbd5e1"/>{user?.studentId||'-'}</div></div>
              </div>
              <div><label style={{fontSize:12,fontWeight:700,color:'#94a3b8',marginBottom:5,display:'block'}}>이메일</label><div style={{...lockedInp,display:'flex',alignItems:'center',gap:7}}><Lock size={12} color="#cbd5e1"/>{user?.email}</div></div>
            </div>
            <div style={{marginBottom:16}}>
              <label style={{fontSize:12,fontWeight:700,color:'#374151',marginBottom:6,display:'flex',alignItems:'center',gap:6}}>자기소개<span style={{fontSize:10,fontWeight:600,padding:'1px 7px',background:'#f0fdf4',color:'#15803d',borderRadius:4}}>수정 가능</span></label>
              <textarea value={bio} onChange={e=>setBio(e.target.value)} rows={3} placeholder="간단한 자기소개를 입력하세요" style={{...inp,resize:'vertical',lineHeight:1.6}}/>
            </div>
            <div style={{height:1,background:'#f1f5f9',marginBottom:16}}/>
            {/* 비밀번호 변경 */}
            <div style={{background:'#f8fafc',border:'1.5px solid #e2e8f0',borderRadius:12,padding:18,marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:700,color:'#374151',marginBottom:14,display:'flex',alignItems:'center',gap:7}}><Lock size={14}/>비밀번호 변경<span style={{fontSize:10,fontWeight:600,padding:'1px 7px',background:'#f0fdf4',color:'#15803d',borderRadius:4}}>수정 가능</span></div>
              <div style={{background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:9,padding:'11px 14px',fontSize:12,color:'#1d4ed8',lineHeight:1.7,marginBottom:14}}>비밀번호 규칙 · 8자 이상 · 영문+숫자 조합 · 특수문자 포함 권장</div>
              <form onSubmit={changePw} style={{display:'flex',flexDirection:'column',gap:10}}>
                {(['cur','next','confirm'] as const).map(k=>(
                  <div key={k} style={{position:'relative'}}>
                    <input type={showPw[k]?'text':'password'} value={pw[k]} onChange={e=>setPw(p=>({...p,[k]:e.target.value}))} placeholder={k==='cur'?'현재 비밀번호':k==='next'?'새 비밀번호 (8자 이상)':'새 비밀번호 확인'} style={{...inp,paddingRight:38}}/>
                    <button type="button" onClick={()=>setShowPw(p=>({...p,[k]:!p[k]}))} style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#94a3b8',fontSize:12}}>{showPw[k]?'숨김':'표시'}</button>
                  </div>
                ))}
                <button type="submit" style={{padding:'10px',background:'#0f172a',color:'#fff',border:'none',borderRadius:9,fontSize:13,fontWeight:700,cursor:'pointer',marginTop:2}}>비밀번호 변경</button>
              </form>
            </div>
            <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
              <button style={{padding:'10px 20px',border:'1.5px solid #e2e8f0',borderRadius:9,background:'#fff',fontSize:13,fontWeight:600,cursor:'pointer',color:'#475569'}}>취소</button>
              <button onClick={saveProfile} style={{padding:'10px 24px',background:'#1d4ed8',color:'#fff',border:'none',borderRadius:9,fontSize:13,fontWeight:700,cursor:'pointer'}}>저장하기</button>
            </div>
          </div>
        )}

        {tab==='social'&&(
          <div style={{background:'#fff',borderRadius:14,border:'1px solid #e2e8f0',padding:24}}>
            <div style={{fontSize:17,fontWeight:900,color:'#0f172a',marginBottom:4}}>소셜 계정 연결</div>
            <div style={{fontSize:13,color:'#64748b',marginBottom:22}}>소셜 계정을 연결하면 더 빠르게 로그인할 수 있어요.</div>
            {[{icon:<KakaoLogo/>,bg:'#FAE100',name:'카카오',status:'hong@kakao.com 연결됨',connected:true},{icon:<GoogleLogo/>,bg:'#fff',border:'1.5px solid #e2e8f0',name:'구글',status:'연결되지 않음',connected:false}].map(s=>(
              <div key={s.name} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 0',borderBottom:'1px solid #f1f5f9'}}>
                <div style={{width:36,height:36,borderRadius:9,background:s.bg,border:(s as any).border,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{s.icon}</div>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:'#0f172a'}}>{s.name}</div><div style={{fontSize:12,marginTop:2,color:s.connected?'#22c55e':'#94a3b8'}}>{s.status}</div></div>
                <button style={{padding:'7px 14px',borderRadius:8,fontSize:12,fontWeight:700,cursor:'pointer',border:s.connected?'1.5px solid #e2e8f0':'none',background:s.connected?'#f8fafc':'#eff6ff',color:s.connected?'#94a3b8':'#1d4ed8'}}>{s.connected?'연결 해제':'연결하기'}</button>
              </div>
            ))}
          </div>
        )}

        {tab==='notify'&&(
          <div style={{background:'#fff',borderRadius:14,border:'1px solid #e2e8f0',padding:24}}>
            <div style={{fontSize:17,fontWeight:900,color:'#0f172a',marginBottom:4}}>알림 설정</div>
            <div style={{fontSize:13,color:'#64748b',marginBottom:22}}>받고 싶은 알림을 선택해주세요.</div>
            {[{k:'notice',l:'공지사항 알림',s:'새 공지가 등록될 때 알림'},{k:'checklist',l:'체크리스트 마감 알림',s:'D-2 이내 마감 항목 알림'},{k:'schedule',l:'학사일정 알림',s:'중요 학사일정 1일 전 알림'},{k:'comment',l:'댓글 알림',s:'내 글에 댓글이 달릴 때 알림'},{k:'email',l:'이메일 수신',s:'학과 소식 이메일 수신 동의'}].map(item=>(
              <div key={item.k} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'13px 0',borderBottom:'1px solid #f1f5f9'}}>
                <div><div style={{fontSize:13,fontWeight:600,color:'#0f172a'}}>{item.l}</div><div style={{fontSize:12,color:'#94a3b8',marginTop:2}}>{item.s}</div></div>
                <Toggle on={(notifs as any)[item.k]} onChange={v=>setNotifs(p=>({...p,[item.k]:v}))}/>
              </div>
            ))}
          </div>
        )}

        {tab==='account'&&(
          <div style={{background:'#fff',borderRadius:14,border:'1px solid #e2e8f0',padding:24}}>
            <div style={{fontSize:17,fontWeight:900,color:'#0f172a',marginBottom:4}}>계정 관리</div>
            <div style={{fontSize:13,color:'#64748b',marginBottom:22}}>가입 정보 및 계정 관련 설정입니다.</div>
            <div style={{background:'#f8fafc',borderRadius:10,padding:16,marginBottom:18}}>
              <div style={{fontSize:12,fontWeight:700,color:'#374151',marginBottom:10}}>가입 정보</div>
              {[['가입일','2026년 5월 28일'],['가입 방법','카카오 소셜 로그인'],['학과',user?.department||'스마트콘텐츠학과']].map(([k,v])=>(
                <div key={k} style={{display:'flex',gap:16,fontSize:13,marginBottom:7}}><span style={{color:'#94a3b8',width:80,flexShrink:0}}>{k}</span><span style={{color:'#0f172a',fontWeight:500}}>{v}</span></div>
              ))}
            </div>
            <div style={{height:1,background:'#f1f5f9',marginBottom:18}}/>
            <div style={{fontSize:13,fontWeight:700,color:'#dc2626',marginBottom:12}}>위험 구역</div>
            <div style={{border:'1.5px solid #fca5a5',borderRadius:12,padding:'16px 18px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
              <div><div style={{fontSize:13,fontWeight:700,color:'#dc2626'}}>계정 삭제</div><div style={{fontSize:12,color:'#64748b',marginTop:2}}>삭제 시 모든 데이터가 영구 삭제되며 복구할 수 없습니다.</div></div>
              <button onClick={()=>toast.error('이 기능은 관리자에게 문의하세요.')} style={{padding:'8px 16px',background:'#fef2f2',color:'#dc2626',border:'1.5px solid #fca5a5',borderRadius:8,fontSize:12,fontWeight:700,cursor:'pointer',whiteSpace:'nowrap'}}>계정 삭제</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
