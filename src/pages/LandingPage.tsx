import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Code2, Users, Zap, BookOpen, Globe, Star } from 'lucide-react';
const features = [
  {icon:Code2,c:'#3b82f6',bg:'#eff6ff',t:'AI 챗봇',d:'GPT-4o 기반의 지능형 코딩 어시스턴트로 실시간 도움을 받으세요'},
  {icon:Users,c:'#8b5cf6',bg:'#f5f3ff',t:'협업 도구',d:'팀원들과 함께 프로젝트를 진행하고 실시간으로 협업하세요'},
  {icon:Zap,c:'#3b82f6',bg:'#eff6ff',t:'자동 평가',d:'제출한 과제를 AI가 자동으로 검토하고 피드백을 제공합니다'},
  {icon:BookOpen,c:'#22c55e',bg:'#f0fdf4',t:'학사일정',d:'중요한 일정과 공지사항을 한눈에 확인하세요'},
  {icon:Globe,c:'#14b8a6',bg:'#f0fdfa',t:'포트폴리오',d:'당신의 프로젝트를 세상에 보여주세요'},
  {icon:Star,c:'#3b82f6',bg:'#eff6ff',t:'지속적 학습',d:'AI와 함께 성장하는 학습 경험을 만들어가세요'},
];
export default function LandingPage() {
  const nav = useNavigate();
  return (
    <div style={{minHeight:'100vh',background:'#fff',fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI","Malgun Gothic",sans-serif'}}>
      <nav style={{background:'#fff',borderBottom:'1px solid #e2e8f0',padding:'0 48px',height:58,display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:50}}>
        <div style={{width:34,height:34,background:'#3b82f6',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:12}}>SC</div>
        <span style={{fontSize:17,fontWeight:800,color:'#0f172a'}}>Smart Content</span>
        <div style={{display:'flex',gap:32,marginLeft:40}}>{['기능','소개','프로그램'].map(l=><span key={l} style={{fontSize:13,color:'#64748b',cursor:'pointer',fontWeight:500}}>{l}</span>)}</div>
        <div style={{marginLeft:'auto',display:'flex',gap:8}}>
          <button onClick={()=>nav('/login')} style={{padding:'7px 18px',border:'1.5px solid #e2e8f0',borderRadius:8,background:'#fff',fontSize:13,fontWeight:600,cursor:'pointer',color:'#0f172a'}}>로그인</button>
          <button onClick={()=>nav('/register')} style={{padding:'7px 18px',background:'#3b82f6',color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:700,cursor:'pointer'}}>회원가입</button>
        </div>
      </nav>
      <section style={{maxWidth:1100,margin:'0 auto',padding:'72px 48px 56px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:56,alignItems:'center'}}>
        <div>
          <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'5px 14px',background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:99,fontSize:12,color:'#2563eb',fontWeight:500,marginBottom:24}}><Sparkles size={12}/> AI-Powered Learning Platform</div>
          <h1 style={{fontSize:48,fontWeight:900,lineHeight:1.12,letterSpacing:-1,color:'#0f172a',marginBottom:18}}>스마트한 학습의<br/><span style={{color:'#3b82f6'}}>미래를 만들다</span></h1>
          <p style={{fontSize:15,color:'#64748b',lineHeight:1.8,marginBottom:30,maxWidth:400}}>AI 기반 코딩 어시스턴트와 함께 프로젝트를 더 빠르고 효율적으로 완성하세요. 실시간 코드 리뷰와 지능형 피드백을 받아보세요.</p>
          <div style={{display:'flex',gap:10,marginBottom:44}}>
            <button onClick={()=>nav('/register')} style={{display:'flex',alignItems:'center',gap:7,padding:'13px 26px',background:'#3b82f6',color:'#fff',border:'none',borderRadius:10,fontSize:14,fontWeight:700,cursor:'pointer'}}>시작하기 <ArrowRight size={15}/></button>
            <button style={{padding:'13px 26px',background:'transparent',color:'#0f172a',border:'1.5px solid #e2e8f0',borderRadius:10,fontSize:14,fontWeight:600,cursor:'pointer'}}>자세히 보기</button>
          </div>
          <div style={{display:'flex',gap:40}}>{[['6+','활성 사용자'],['99.9%','가용성'],['24/7','지원']].map(([v,l])=><div key={l}><div style={{fontSize:26,fontWeight:900,color:'#0f172a'}}>{v}</div><div style={{fontSize:12,color:'#94a3b8',marginTop:2}}>{l}</div></div>)}</div>
        </div>
        <div style={{background:'#1e2535',borderRadius:20,padding:32,boxShadow:'0 25px 60px rgba(0,0,0,.15)'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:22}}>
            <div style={{width:30,height:30,background:'#3b82f6',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center'}}><Code2 size={15} color="#fff"/></div>
            <span style={{color:'#e2e8f0',fontWeight:600,fontSize:13}}>Smart AI Assistant</span>
          </div>
          <pre style={{fontFamily:'monospace',fontSize:12,lineHeight:1.9,color:'#7c90b8',margin:0}}>{`// 스마트한 코드 분석\nconst result = await ai.analyze({\n  code: userCode,\n  optimize: true,\n  suggest: true\n})\n\n// 실시간 피드백\nreturn result.feedback`}</pre>
        </div>
      </section>
      <section style={{background:'#f8fafc',padding:'72px 48px'}}>
        <div style={{textAlign:'center',marginBottom:52}}>
          <h2 style={{fontSize:36,fontWeight:900,color:'#0f172a',marginBottom:10,letterSpacing:-0.5}}>강력한 기능들</h2>
          <p style={{fontSize:15,color:'#64748b'}}>학습을 더 효율적으로 만드는 AI 기반 도구들</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:18,maxWidth:920,margin:'0 auto'}}>
          {features.map(f=>(
            <div key={f.t} style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:14,padding:'24px 20px',cursor:'pointer'}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='#3b82f6';(e.currentTarget as HTMLElement).style.boxShadow='0 8px 30px rgba(59,130,246,.08)';}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='#e2e8f0';(e.currentTarget as HTMLElement).style.boxShadow='none';}}>
              <div style={{width:46,height:46,borderRadius:12,background:f.bg,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16}}><f.icon size={20} color={f.c}/></div>
              <div style={{fontSize:16,fontWeight:800,color:'#0f172a',marginBottom:7}}>{f.t}</div>
              <div style={{fontSize:13,color:'#64748b',lineHeight:1.7}}>{f.d}</div>
            </div>
          ))}
        </div>
      </section>
      <section style={{padding:'72px 48px',textAlign:'center'}}>
        <h2 style={{fontSize:32,fontWeight:900,color:'#0f172a',marginBottom:12}}>지금 시작하세요</h2>
        <p style={{fontSize:15,color:'#64748b',marginBottom:28}}>스마트콘텐츠학과 통합 AI 플랫폼으로 더 스마트한 학습을 경험하세요.</p>
        <button onClick={()=>nav('/register')} style={{display:'inline-flex',alignItems:'center',gap:8,padding:'13px 34px',background:'#3b82f6',color:'#fff',border:'none',borderRadius:10,fontSize:15,fontWeight:700,cursor:'pointer'}}>무료로 시작하기 <ArrowRight size={16}/></button>
      </section>
      <footer style={{borderTop:'1px solid #e2e8f0',padding:'20px 48px',background:'#f8fafc',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:26,height:26,background:'#3b82f6',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:10}}>SC</div>
          <span style={{fontSize:13,fontWeight:700,color:'#475569'}}>스마트콘텐츠 AI 플랫폼</span>
        </div>
        <span style={{fontSize:12,color:'#94a3b8'}}>© 2026 Smart Content Department. All rights reserved.</span>
      </footer>
    </div>
  );
}
