import { useState, useEffect } from 'react';
import { Plus, Search, ChevronLeft, Trash2, Pencil, Loader2 } from 'lucide-react';
import { useAuth, apiCall } from '../lib/store';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const SLUG = 'notice';
const catMap: Record<string, { label: string; bg: string; color: string }> = {
  urgent:  { label:'긴급', bg:'#fef2f2', color:'#dc2626' },
  notice:  { label:'공지', bg:'#eff6ff', color:'#1d4ed8' },
  system:  { label:'시스템', bg:'#f0fdf4', color:'#15803d' },
  general: { label:'일반', bg:'#f8fafc', color:'#475569' },
};

interface Post { id:number; title:string; category:string; is_pinned:number; view_count:number; created_at:string; author_name:string; comment_count:number; content?:string; comments?:any[]; }

export default function NoticePage() {
  const { user } = useAuth();
  const canWrite = user?.role === 'admin' || user?.role === 'professor';
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list'|'detail'|'write'>('list');
  const [selected, setSelected] = useState<Post | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ title:'', content:'', category:'general', isPinned:false, allowComments:true });
  const [submitting, setSubmitting] = useState(false);
  const [comment, setComment] = useState('');

  async function loadPosts() {
    setLoading(true);
    try {
      const data = await apiCall(`/boards/${SLUG}/posts?limit=20${search ? `&search=${search}` : ''}`);
      setPosts(data.posts || []);
    } catch { toast.error('게시글을 불러오지 못했습니다.'); }
    finally { setLoading(false); }
  }

  async function loadDetail(id: number) {
    try {
      const data = await apiCall(`/boards/${SLUG}/posts/${id}`);
      setSelected(data);
      setView('detail');
    } catch { toast.error('게시글을 불러오지 못했습니다.'); }
  }

  async function submitPost() {
    if (!form.title.trim()) return toast.error('제목을 입력하세요.');
    if (!form.content.trim()) return toast.error('내용을 입력하세요.');
    setSubmitting(true);
    try {
      await apiCall(`/boards/${SLUG}/posts`, { method:'POST', body: JSON.stringify(form) });
      toast.success('게시글이 등록되었습니다.');
      setForm({ title:'', content:'', category:'general', isPinned:false, allowComments:true });
      setView('list');
      loadPosts();
    } catch (e: any) { toast.error(e.error || '등록에 실패했습니다.'); }
    finally { setSubmitting(false); }
  }

  async function deletePost(id: number) {
    if (!confirm('삭제하시겠습니까?')) return;
    try {
      await apiCall(`/boards/${SLUG}/posts/${id}`, { method:'DELETE' });
      toast.success('삭제되었습니다.');
      setView('list');
      loadPosts();
    } catch { toast.error('삭제에 실패했습니다.'); }
  }

  async function submitComment() {
    if (!comment.trim() || !selected) return;
    try {
      await apiCall(`/boards/${SLUG}/posts/${selected.id}/comments`, { method:'POST', body: JSON.stringify({ content: comment }) });
      setComment('');
      loadDetail(selected.id);
    } catch { toast.error('댓글 등록에 실패했습니다.'); }
  }

  async function deleteComment(commentId: number) {
    if (!selected) return;
    try {
      await apiCall(`/boards/${SLUG}/posts/${selected.id}/comments/${commentId}`, { method:'DELETE' });
      loadDetail(selected.id);
    } catch { toast.error('삭제에 실패했습니다.'); }
  }

  useEffect(() => { loadPosts(); }, []);

  const inp: React.CSSProperties = { width:'100%', padding:'10px 12px', border:'1.5px solid #e2e8f0', borderRadius:9, fontSize:13, outline:'none', fontFamily:'inherit', background:'#f8fafc', boxSizing:'border-box' };

  return (
    <div style={{ maxWidth:860, margin:'0 auto' }}>
      {/* 목록 */}
      {view === 'list' && (
        <>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14, flexWrap:'wrap' }}>
            <div style={{ fontSize:20, fontWeight:900, color:'#0f172a' }}>공지사항</div>
            <div style={{ position:'relative', flex:1, maxWidth:260 }}>
              <Search size={13} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#94a3b8' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key==='Enter' && loadPosts()} placeholder="검색..." style={{ ...inp, paddingLeft:30 }} />
            </div>
            {canWrite && (
              <button onClick={() => setView('write')} style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 18px', background:'#1d4ed8', color:'#fff', border:'none', borderRadius:9, fontSize:13, fontWeight:700, cursor:'pointer', marginLeft:'auto' }}>
                <Plus size={14} /> 글쓰기
              </button>
            )}
          </div>
          <div style={{ background:'#fff', borderRadius:14, border:'1px solid #e2e8f0', overflow:'hidden' }}>
            <div style={{ display:'grid', gridTemplateColumns:'56px 1fr 90px 72px 60px', padding:'9px 18px', background:'#f8fafc', borderBottom:'1px solid #e2e8f0', fontSize:11, fontWeight:700, color:'#64748b' }}>
              <div style={{ textAlign:'center' }}>번호</div><div>제목</div><div>작성자</div><div>날짜</div><div style={{ textAlign:'center' }}>조회</div>
            </div>
            {loading ? (
              <div style={{ padding:40, textAlign:'center' }}><Loader2 size={20} style={{ animation:'spin 1s linear infinite' }} /></div>
            ) : posts.length === 0 ? (
              <div style={{ padding:40, textAlign:'center', color:'#94a3b8', fontSize:13 }}>게시글이 없습니다.</div>
            ) : posts.map((p, i) => {
              const cat = catMap[p.category] || catMap.general;
              return (
                <div key={p.id} onClick={() => loadDetail(p.id)}
                  style={{ display:'grid', gridTemplateColumns:'56px 1fr 90px 72px 60px', padding:'13px 18px', borderBottom:'1px solid #f1f5f9', cursor:'pointer', alignItems:'center', background: p.is_pinned ? '#fffbeb' : '#fff' }}
                  onMouseEnter={e => (e.currentTarget.style.background = p.is_pinned ? '#fef9c3' : '#f8fafc')}
                  onMouseLeave={e => (e.currentTarget.style.background = p.is_pinned ? '#fffbeb' : '#fff')}>
                  <div style={{ textAlign:'center', fontSize:12, color:'#94a3b8' }}>{p.is_pinned ? '📌' : posts.length - i}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                    <span style={{ padding:'2px 8px', borderRadius:5, fontSize:10, fontWeight:700, background:cat.bg, color:cat.color, flexShrink:0 }}>{cat.label}</span>
                    <span style={{ fontSize:13, fontWeight: p.is_pinned ? 700 : 500, color:'#0f172a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.title}</span>
                    {p.comment_count > 0 && <span style={{ fontSize:11, color:'#94a3b8', flexShrink:0 }}>({p.comment_count})</span>}
                  </div>
                  <div style={{ fontSize:12, color:'#64748b' }}>{p.author_name}</div>
                  <div style={{ fontSize:12, color:'#94a3b8' }}>{format(new Date(p.created_at), 'MM-dd')}</div>
                  <div style={{ fontSize:12, color:'#94a3b8', textAlign:'center' }}>{p.view_count}</div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* 상세 */}
      {view === 'detail' && selected && (
        <div style={{ background:'#fff', borderRadius:14, border:'1px solid #e2e8f0' }}>
          <div style={{ padding:'24px 24px 18px', borderBottom:'1px solid #f1f5f9' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
              <span style={{ padding:'2px 9px', borderRadius:5, fontSize:11, fontWeight:700, background: catMap[selected.category]?.bg, color: catMap[selected.category]?.color }}>{catMap[selected.category]?.label}</span>
              {selected.is_pinned ? <span style={{ fontSize:12, color:'#94a3b8' }}>📌 고정됨</span> : null}
            </div>
            <div style={{ fontSize:20, fontWeight:900, color:'#0f172a', marginBottom:14 }}>{selected.title}</div>
            <div style={{ display:'flex', alignItems:'center', gap:16, fontSize:12, color:'#64748b' }}>
              <span style={{ fontWeight:600, color:'#0f172a' }}>{selected.author_name}</span>
              <span>{format(new Date(selected.created_at), 'yyyy-MM-dd')}</span>
              <span>조회 {selected.view_count}</span>
              <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
                {(canWrite || user?.id === (selected as any).author_id) && (
                  <button onClick={() => deletePost(selected.id)} style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 12px', border:'1.5px solid #fca5a5', borderRadius:8, background:'#fef2f2', color:'#ef4444', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                    <Trash2 size={13} /> 삭제
                  </button>
                )}
              </div>
            </div>
          </div>
          <div style={{ padding:'22px 24px', fontSize:14, color:'#374151', lineHeight:1.9, whiteSpace:'pre-line', borderBottom:'1px solid #f1f5f9', minHeight:120 }}>{selected.content}</div>
          <div style={{ padding:'14px 24px', borderBottom:'1px solid #f1f5f9' }}>
            <button onClick={() => { setView('list'); setSelected(null); }} style={{ display:'flex', alignItems:'center', gap:5, padding:'8px 16px', border:'1.5px solid #e2e8f0', borderRadius:8, background:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', color:'#475569' }}>
              <ChevronLeft size={14} /> 목록으로
            </button>
          </div>
          {/* 댓글 */}
          <div style={{ padding:'20px 24px' }}>
            <div style={{ fontSize:14, fontWeight:800, color:'#0f172a', marginBottom:14 }}>댓글 {selected.comments?.length || 0}</div>
            {selected.comments?.map((c: any) => (
              <div key={c.id} style={{ display:'flex', gap:10, marginBottom:14 }}>
                <div style={{ width:30, height:30, borderRadius:'50%', background:'#eff6ff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#3b82f6', flexShrink:0 }}>{c.author_name?.[0]}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:'#0f172a' }}>{c.author_name}</span>
                    <span style={{ fontSize:11, color:'#94a3b8' }}>{format(new Date(c.created_at), 'MM-dd HH:mm')}</span>
                    {(user?.id === c.author_id || canWrite) && (
                      <span onClick={() => deleteComment(c.id)} style={{ fontSize:11, color:'#94a3b8', cursor:'pointer', marginLeft:'auto' }}>삭제</span>
                    )}
                  </div>
                  <div style={{ fontSize:13, color:'#374151', background:'#f8fafc', padding:'10px 13px', borderRadius:'0 10px 10px 10px', lineHeight:1.6 }}>{c.content}</div>
                </div>
              </div>
            ))}
            <div style={{ display:'flex', gap:8, marginTop:14, alignItems:'flex-end' }}>
              <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="댓글을 입력하세요..." rows={2} style={{ flex:1, padding:'10px 14px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:13, outline:'none', fontFamily:'inherit', resize:'none', lineHeight:1.5 }} />
              <button onClick={submitComment} style={{ padding:'10px 16px', background:'#1d4ed8', color:'#fff', border:'none', borderRadius:9, fontSize:13, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' }}>등록</button>
            </div>
          </div>
        </div>
      )}

      {/* 글쓰기 */}
      {view === 'write' && (
        <div style={{ background:'#fff', borderRadius:14, border:'1px solid #e2e8f0', padding:24 }}>
          <div style={{ fontSize:18, fontWeight:900, color:'#0f172a', marginBottom:18 }}>새 공지 작성</div>
          <div style={{ display:'flex', gap:8, marginBottom:12 }}>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ ...inp, width:'auto' }}>
              <option value="general">일반</option><option value="notice">공지</option><option value="urgent">긴급</option><option value="system">시스템</option>
            </select>
            <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'#374151', cursor:'pointer', padding:'0 8px' }}>
              <input type="checkbox" checked={form.isPinned} onChange={e => setForm(f => ({ ...f, isPinned: e.target.checked }))} style={{ accentColor:'#3b82f6' }} /> 상단 고정
            </label>
            <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'#374151', cursor:'pointer', padding:'0 8px' }}>
              <input type="checkbox" checked={form.allowComments} onChange={e => setForm(f => ({ ...f, allowComments: e.target.checked }))} style={{ accentColor:'#3b82f6' }} /> 댓글 허용
            </label>
          </div>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="제목을 입력하세요" style={{ ...inp, fontSize:16, fontWeight:700, marginBottom:10 }} />
          <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={10} placeholder="내용을 입력하세요..." style={{ ...inp, resize:'vertical', lineHeight:1.7 }} />
          <div style={{ display:'flex', justifyContent:'flex-end', gap:8, marginTop:12 }}>
            <button onClick={() => setView('list')} style={{ padding:'10px 20px', border:'1.5px solid #e2e8f0', borderRadius:9, background:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', color:'#64748b' }}>취소</button>
            <button onClick={submitPost} disabled={submitting} style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 24px', background:'#1d4ed8', color:'#fff', border:'none', borderRadius:9, fontSize:13, fontWeight:700, cursor:'pointer', opacity: submitting ? 0.7 : 1 }}>
              {submitting && <Loader2 size={14} />} 등록하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
