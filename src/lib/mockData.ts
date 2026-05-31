export const mockNotices = [
  {id:1,cat:'urgent',catLabel:'긴급',catBg:'#fef2f2',catColor:'#dc2626',title:'기말고사 일정 공지 (전체 필독)',author:'관리자',authorRole:'admin',date:'2026-05-28',views:142,pinned:true,content:'2026년 1학기 기말고사 일정을 안내드립니다.\n\n■ 시험 기간: 2026년 6월 15일(월) ~ 6월 21일(일)\n■ 시험 범위: 각 교과목 담당 교수 공지 참조\n■ 유의사항: 시험 기간 중 부정행위 적발 시 해당 과목 0점 처리',comments:[]},
  {id:2,cat:'notice',catLabel:'공지',catBg:'#eff6ff',catColor:'#1d4ed8',title:'2026년도 1학기 수강신청 안내',author:'관리자',authorRole:'admin',date:'2026-05-20',views:318,pinned:true,content:'2026년도 1학기 수강신청 일정을 안내드립니다.\n\n■ 수강신청 기간: 2026년 6월 1일(월) ~ 6월 7일(일)\n■ 수강신청 방법: 학생포털 → 수강신청 메뉴 이용\n\n문의사항은 학과 사무실로 연락 주세요.',comments:[{id:1,author:'홍길동',date:'05-21',text:'감사합니다!'}]},
  {id:3,cat:'system',catLabel:'시스템',catBg:'#f0fdf4',catColor:'#15803d',title:'AI 챗봇 시스템 업데이트 안내',author:'김스마트 교수',authorRole:'professor',date:'2026-05-15',views:87,pinned:false,content:'AI 챗봇 시스템이 업데이트되었습니다.\n\n■ 응답 속도 30% 개선\n■ 코드 분석 기능 추가\n■ UI/UX 전면 개편',comments:[]},
  {id:4,cat:'general',catLabel:'일반',catBg:'#f8fafc',catColor:'#475569',title:'스마트콘텐츠학과 MT 일정 안내',author:'이콘텐츠 교수',authorRole:'professor',date:'2026-05-10',views:204,pinned:false,content:'스마트콘텐츠학과 MT 일정을 안내드립니다.\n\n■ 일시: 2026년 6월 3일(수) ~ 4일(목)\n■ 장소: 미정\n■ 참가 신청: 5월 25일까지',comments:[]},
];

export const mockPosts = [
  {id:1,cat:'자유',catBg:'#f0fdf4',catColor:'#15803d',title:'스마트콘텐츠학과 생활 꿀팁 모음',author:'박다현',avatar:'박',avatarBg:'#eff6ff',avatarColor:'#3b82f6',date:'2026-05-27',views:138,likes:24,content:'수강신청할 때 꼭 알아야 할 것들, 교수님 연구실 이용법, 동아리 추천 등 학과 생활에서 도움됐던 것들 공유해요!\n\n1. 수강신청은 미리 위시리스트 넣어두기\n2. 김스마트 교수님 연구실은 화요일 오후에 방문하면 상담 가능\n3. 스마트미디어 동아리 강추!\n4. 도서관 3층 스터디룸은 하루 전에 예약해야 해요',comments:[{id:1,author:'이나윤',avatar:'이',avatarBg:'#fdf4ff',avatarColor:'#8b5cf6',date:'05-27',text:'정말 도움됐어요! 동아리 저도 가입했는데 진짜 좋더라고요 ㅎㅎ'}]},
  {id:2,cat:'질문',catBg:'#fdf4ff',catColor:'#7e22ce',title:'React 상태관리 라이브러리 뭐 써요?',author:'이나윤',avatar:'이',avatarBg:'#fdf4ff',avatarColor:'#8b5cf6',date:'2026-05-26',views:97,likes:12,content:'프로젝트 시작하려는데 Zustand vs Redux 뭐가 더 낫나요?\n\n교수님은 Redux 추천하셨는데 요즘은 Zustand 많이 쓰는 것 같아서요.',comments:[]},
  {id:3,cat:'정보',catBg:'#fff7ed',catColor:'#c2410c',title:'기말고사 족보 공유방 오픈했어요',author:'김민준',avatar:'김',avatarBg:'#fff7ed',avatarColor:'#f97316',date:'2026-05-25',views:312,likes:41,content:'스마트콘텐츠학과 오픈채팅방에 기출문제 자료 올렸습니다.\n\n링크는 댓글로 달게요. 같이 열심히 해봐요!',comments:[]},
  {id:4,cat:'자유',catBg:'#f0fdf4',catColor:'#15803d',title:'점심 뭐 먹을지 추천해주세요',author:'최서연',avatar:'최',avatarBg:'#f0fdf4',avatarColor:'#22c55e',date:'2026-05-24',views:54,likes:7,content:'학교 근처 맛집 아시는 분 추천 부탁드려요. 요즘 매일 편의점만 가서 질렸어요 ㅠㅠ',comments:[]},
];

export const mockSchedules = [
  {title:'기말고사',date:'2026-06-15',color:'#ef4444',type:'시험'},
  {title:'기말고사 종료',date:'2026-06-21',color:'#ef4444',type:'시험'},
  {title:'수강신청 시작',date:'2026-06-01',color:'#22c55e',type:'행사'},
  {title:'React 과제 마감',date:'2026-06-10',color:'#a855f7',type:'과제'},
  {title:'여름방학 시작',date:'2026-07-15',color:'#f97316',type:'방학'},
];

export const catConfig: Record<string,{label:string;bg:string;color:string;dot:string}> = {
  study:   {label:'공부',     bg:'#eff6ff',color:'#1d4ed8',dot:'#3b82f6'},
  assign:  {label:'과제',     bg:'#fdf4ff',color:'#7e22ce',dot:'#a855f7'},
  exam:    {label:'시험 준비',bg:'#fef2f2',color:'#dc2626',dot:'#ef4444'},
  project: {label:'프로젝트', bg:'#f0fdf4',color:'#15803d',dot:'#22c55e'},
  etc:     {label:'기타',     bg:'#fff7ed',color:'#c2410c',dot:'#f97316'},
};

export const ptuDepartments: Record<string,string[]> = {
  it:   ['스마트콘텐츠학과','미디어디자인학과','ICT환경융합학과','스마트모빌리티학과','IT공학자율전공'],
  biz:  ['국제물류학과','국제무역행정학과','도시계획부동산학과','경영학과'],
  intl: ['미국학전공','중국학전공','일본학전공','국제지역및신학자율전공'],
  svc:  ['사회복지학과','재활상담학과','아동청소년교육상담학과','신학과','광고홍보학과','인문사회자율전공'],
  art:  ['커뮤니케이션디자인학과','패션디자인및브랜딩학과','연극영화과','실용음악학과','음악학과'],
  etc:  ['피어선칼리지(교양전공)','융복합전공','사회맞춤형융복합전공'],
};

export const collegeLabels: Record<string,string> = {
  it:'IT공과대학',biz:'국제비즈니스',intl:'국제지역',svc:'사회서비스',art:'문화예술',etc:'기타',
};
