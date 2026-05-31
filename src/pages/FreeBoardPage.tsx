import { useState, useEffect } from 'react';
import { Plus, Search, ChevronLeft, Trash2, Heart, Loader2 } from 'lucide-react';
import { useAuth, apiCall } from '../lib/store';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const SLUG = 'free';
const cats = [
  { v:'', l:'전체' }, { v:'general', l:'자유' }, { v:'notice', l:'질문' }, { v:'urgent', l:'정보' }, { v:'system', l:'모집' },
];
const catStyle: Record<string, { bg:string; color:string }> = {
  general: { bg:'#f0fdf4', color:'#15803d' },
  notice:  { bg:'#fdf4ff', color:'#7e22ce' },
  urgent:  { bg:'#fff7ed', color:'#c2410c' },
  system:  { bg:'#eff6ff', color:'#1d4ed8' },
};
const catLabel: Record<string, string> = { general:'자유', notice:'질문', urgent:'정보', system:'모집' };

interface Post { id:number; title:string; category:string; view_count:number; created_at:string; author_name:string; comment_count:number; content?:string; comments?:any[]; }

export default function FreeBoardPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list'|'detail'|'write'>('list');
  const [selected, setSelected] = useState<Post|null>(null);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [form, setForm] = useState({ title:'', content:'', category:'general' });
  const [submitting, setSubmitting] = useState(false);
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(false);

  async function loadPosts() {
    setLoading(true);
    try {
      const q = new URLSearchParams({ limit:'20', ...(search && { search }), ...(catFilter && { category: catFilter }) });
      const data = await apiCall(`/boards/${SLUG}/posts?${q}`);
      setPosts(data.posts || []);
    } catch { toast.error('게시글을 불러오지 못했습니다.'); }
    finally { setLoading(false); }
  }

  async function loadDetail(id: number) {
    try {
      const data = await apiCall(`/boards/${SLUG}/posts/${id}`);
      setSelected(data); setView('detail'); setLiked(false);
    } catch { toast.error('게시글을 불러오지 못했습니다.'); }
  }

  async function submitPost() {
    if (!form.title.trim()) return toast.error('제목을 입력하세요.');
    if (!form.content.trim()) return toast.error('내용을 입력하세요.');
    setSubmitting(true);
    try {
      await apiCall(`/boards/${SLUG}/posts`, { method:'POST', body: JSON.stringify(form) });
      toast.success('게시글이 등록되었습니다.');
      setForm({ title:'', content:'', category:'general' });
      setView('list'); loadPosts();
    } catch (e: any) { toast.error(e.error || '등록에 실패했습니다.'); }
    finally { setSubmitting(false); }
  }

  async function deletePost(id: number) {
    if (!confirm('삭제하시겠습니까?')) return;
    try {
      await apiCall(`/boards/${SLUG}/posts/${id}`, { method:'DELETE' });
      toast.success('삭제되었습니다.'); setView('list'); loadPosts();
    } catch { toast.error('삭제에 실패했습니다.'); }
  }

  async function submitComment() {
    if (!comment.trim() || !selected) return;
    try {
      await apiCall(`/boards/${SLUG}/posts/${selected.id}/comments`, { method:'POST', body: JSON.stringify({ content: comment }) });
      setComment(''); loadDetail(selected.id);
    } catch { toast.error('댓글 등록에 실패했습니다.'); }
  }

  async function deleteComment(commentId: number) {
    if (!selected) return;
    try {
      await apiCall(`/boards/${SLUG}/posts/${selected.id}/comments/${commentId}`, { method:'DELETE' });
      loadDetail(selected.id);
    } catch { toast.error('삭제에 실패했습니다.'); }
  }

  useEffect(() => { loadPosts(); }, [catFilter]);

  const inp: React.CSSProperties = { width:'100%', padding:'10px 12px', border:'1.5px solid #e2e8f0', borderRadius:9, fontSize:13, outline:'none', fontFamily:'inherit', background:'#f8fafc', boxSizing:'border-box' };

  return (
    <div style={{ maxWidth:860, margin:'0 auto' }}>
      {/* 목록 */}
      {view === 'list' && (
        <>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, flexWrap:'wrap' }}>
            <div style={{ fontSize:20, fontWeight:900, color:'#0f172a' }}>자유게시판</div>
            <div style={{ position:'relative', flex:1, maxWidth:240 }}>
              <Search size={13} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#94a3b8' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key==='Enter' && loadPosts()} placeholder="검색..." style={{ ...inp, paddingLeft:30 }} />
            </div>
            <button onClick={() => setView('write')} style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 18px', background:'#1d4ed8', color:'#fff', border:'none', borderRadius:9, fontSize:13, fontWeight:700, cursor:'pointer', marginLeft:'auto' }}>
              <Plus size={14} /> 글쓰기
            </button>
          </div>
          {/* 카테고리 필터 */}
          <div style={{ display:'flex', gap:6, marginBottom:12, flexWrap:'wrap' }}>
            {cats.map(c => (
              <div key={c.v} onClick={() => setCatFilter(c.v)}
                style={{ padding:'5px 13px', border:`1.5px solid ${catFilter===c.v?'#3b82f6':'#e2e8f0'}`, borderRadius:99, fontSize:12, fontWeight:600, cursor:'pointer', background: catFilter===c.v?'#3b82f6':'#f8fafc', color: catFilter===c.v?'#fff':'#64748b', transition:'all .15s' }}>
                {c.l}
              </div>
            ))}
          </div>
          <div style={{ background:'#fff', borderRadius:14, border:'1px solid #e2e8f0', overflow:'hidden' }}>
            {loading ? (
              <div style={{ padding:40, textAlign:'center' }}><Loader2 size={20} style={{ animation:'spin 1s linear infinite' }} /></div>
            ) : posts.length === 0 ? (
              <div style={{ padding:40, textAlign:'center', color:'#94a3b8', fontSize:13 }}>게시글이 없습니다. 첫 글을 작성해보세요!</div>
            ) : posts.map(p => {
              const cs = catStyle[p.category] || catStyle.general;
              return (
                <div key={p.id} onClick={() => loadDetail(p.id)}
                  style={{ padding:'16px 20px', borderBottom:'1px solid #f1f5f9', cursor:'pointer', background:'#fff' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                    <span style={{ padding:'2px 8px', borderRadius:5, fontSize:11, fontWeight:700, background:cs.bg, color:cs.color, flexShrink:0 }}>{catLabel[p.category] || '자유'}</span>
                    <span style={{ fontSize:14, fontWeight:700, color:'#0f172a' }}>{p.title}</span>
                    <span style={{ fontSize:11, color:'#94a3b8', flexShrink:0 }}>댓글 {p.comment_count}</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:12, color:'#64748b' }}>
                    <span style={{ fontWeight:600 }}>{p.author_name}</span>
                    <span>{format(new Date(p.created_at), 'MM-dd')}</span>
                    <span style={{ marginLeft:'auto', color:'#94a3b8' }}>조회 {p.view_count}</span>
                  </div>
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
            <div style={{ display:'flex', gap:8, marginBottom:10 }}>
              <span style={{ padding:'2px 9px', borderRadius:5, fontSize:11, fontWeight:700, background: catStyle[selected.category]?.bg, color: catStyle[selected.category]?.color }}>{catLabel[selected.category] || '자유'}</span>
            </div>
            <div style={{ fontSize:20, fontWeight:900, color:'#0f172a', marginBottom:14 }}>{selected.title}</div>
            <div style={{ display:'flex', alignItems:'center', gap:12, fontSize:12, color:'#64748b' }}>
              <span style={{ fontWeight:600, color:'#0f172a' }}>{selected.author_name}</span>
              <span>{format(new Date(selected.created_at), 'yyyy-MM-dd')}</span>
              <span>조회 {selected.view_count}</span>
            </div>
          </div>
          <div style={{ padding:'22px 24px', fontSize:14, color:'#374151', lineHeight:1.9, whiteSpace:'pre-line', minHeight:120, borderBottom:'1px solid #f1f5f9' }}>{selected.content}</div>
          <div style={{ padding:'12px 24px', display:'flex', alignItems:'center', gap:8, borderBottom:'1px solid #f1f5f9' }}>
            <button onClick={() => setLiked(v => !v)} style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 14px', borderRadius:8, border:`1.5px solid ${liked?'#f43f5e':'#e2e8f0'}`, background: liked?'#fff0f3':'#fff', color: liked?'#f43f5e':'#64748b', fontSize:13, fontWeight:600, cursor:'pointer' }}>
              <Heart size={14} fill={liked?'#f43f5e':'none'} /> 좋아요
            </button>
            {(user?.id === (selected as any).author_id || user?.role === 'admin') && (
              <button onClick={() => deletePost(selected.id)} style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 14px', border:'1.5px solid #fca5a5', borderRadius:8, background:'#fef2f2', color:'#ef4444', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                <Trash2 size={13} /> 삭제
              </button>
            )}
            <button onClick={() => { setView('list'); setSelected(null); }} style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 14px', border:'1.5px solid #e2e8f0', borderRadius:8, background:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', color:'#64748b', marginLeft:'auto' }}>
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
                    {(user?.id === c.author_id || user?.role === 'admin') && (
                      <span onClick={() => deleteComment(c.id)} style={{ fontSize:11, color:'#94a3b8', cursor:'pointer', marginLeft:'auto' }}>삭제</span>
                    )}
                  </div>
                  <div style={{ fontSize:13, color:'#374151', background:'#f8fafc', padding:'10px 13px', borderRadius:'0 10px 10px 10px' }}>{c.content}</div>
                </div>
              </div>
            ))}
            <div style={{ display:'flex', gap:8, marginTop:14, alignItems:'flex-end' }}>
              <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="댓글을 입력하세요..." rows={2} style={{ flex:1, padding:'10px 14px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:13, outline:'none', fontFamily:'inherit', resize:'none' }} />
              <button onClick={submitComment} style={{ padding:'10px 16px', background:'#1d4ed8', color:'#fff', border:'none', borderRadius:9, fontSize:13, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' }}>등록</button>
            </div>
          </div>
        </div>
      )}

      {/* 글쓰기 */}
      {view === 'write' && (
        <div style={{ background:'#fff', borderRadius:14, border:'1px solid #e2e8f0', padding:24 }}>
          <div style={{ fontSize:18, fontWeight:900, color:'#0f172a', marginBottom:18 }}>글쓰기</div>
          <div style={{ marginBottom:12 }}>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ ...inp, width:'auto' }}>
              <option value="general">자유</option><option value="notice">질문</option><option value="urgent">정보</option><option value="system">모집</option>
            </select>
          </div>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="제목을 입력하세요" style={{ ...inp, fontSize:16, fontWeight:700, marginBottom:10 }} />
          <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={10} placeholder="내용을 자유롭게 작성하세요..." style={{ ...inp, resize:'vertical', lineHeight:1.7 }} />
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
