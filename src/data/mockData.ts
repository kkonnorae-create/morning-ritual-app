import { PersonaInfo, MusicTrack, DailyQuote } from '../types';

export const PERSONAS: Record<string, PersonaInfo> = {
  burnout: {
    id: 'burnout',
    title: '번아웃 회복',
    badge: '🌿 지친 일상 쉼표',
    tagline: '오늘 하루, 무리하지 않고 무탈하게',
    description: '출근 전 밀려오는 피로감과 부담감을 내려놓고, 나를 위한 안전한 호흡을 찾습니다.',
    themeColor: 'from-amber-100 to-orange-50 border-amber-200 text-amber-900',
  },
  jobseeker: {
    id: 'jobseeker',
    title: '자신감 & 멘탈 케어',
    badge: '☀️ 불안 극복과 용기',
    tagline: '흔들리지 않고 나의 속도로',
    description: '결과에 대한 불안과 조급함을 잠시 멈추고, 오늘 내가 할 수 있는 작은 성취에 집중합니다.',
    themeColor: 'from-sky-100 to-indigo-50 border-sky-200 text-sky-900',
  },
  miracle: {
    id: 'miracle',
    title: '미라클 모닝',
    badge: '⚡ 활기찬 하루 시작',
    tagline: '가볍게 깨어나는 나만의 리추얼',
    description: '완벽하려 애쓰지 않고, 맑은 정신과 가벼운 마음으로 기분 좋은 몰입을 시작합니다.',
    themeColor: 'from-emerald-100 to-teal-50 border-emerald-200 text-emerald-900',
  },
};

export const MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'nature-piano',
    title: '숲속 새소리와 잔잔한 피아노 명상',
    youtubeId: 'W_LMM7h_9Zk', // Forest Bird Sounds & Soft Piano
    genre: '자연의 소리 & 피아노',
    duration: '3:00:00',
    description: '아침 햇살과 함께 맑은 새소리로 뇌를 부드럽게 깨우는 사운드스케이프',
  },
  {
    id: 'singing-bowl',
    title: '마음을 비우는 싱잉볼 힐링 차크라 사운드',
    youtubeId: '1ZYbU82GVz4', // Singing Bowl Meditation
    genre: '싱잉볼 & 딥 명상',
    duration: '1:00:00',
    description: '깊은 울림으로 복잡한 생각을 지우고 내면의 고요함을 되찾아줍니다.',
  },
  {
    id: 'morning-jazz',
    title: '따뜻한 모닝 커피 & 어쿠스틱 보사노바 재즈',
    youtubeId: '5qap5aO4i9A', // Lofi / Cozy Morning
    genre: '모닝 재즈 & 어쿠스틱',
    duration: '2:30:00',
    description: '기분 좋은 하루의 시작을 돕는 감미롭고 차분한 카페 재즈 음악',
  },
  {
    id: 'rain-lofi',
    title: '창밖 잔잔한 빗소리와 차분한 로파이 비트',
    youtubeId: 'jfKfPfyJRdk', // Lofi Girl Chill Beats
    genre: '차분한 로파이 (Lofi)',
    duration: 'Live / 24h',
    description: '부담 없는 편안한 비트 위에서 생각과 다짐을 자유롭게 정리해 보세요.',
  },
  {
    id: 'theta-waves',
    title: '스트레스 완화와 깊은 이완 세타파 명상',
    youtubeId: 'WPni755-Krg', // Theta Waves Relaxation
    genre: '바이노럴 비트 & 힐링',
    duration: '1:30:00',
    description: '뇌파를 안정시키고 긴장된 근육과 마음을 풀어주는 음향 테라피',
  },
];

export const DAILY_QUOTES: DailyQuote[] = [
  // 번아웃 페르소나
  {
    id: 'q-bo-1',
    persona: 'burnout',
    quote: '완벽할 필요는 없다. 오늘 하루 그저 존재하는 것만으로도 당신은 충분히 가치 있다.',
    author: '헤르만 헤세',
    takeaway: '오늘은 스스로를 다그치지 말고, 할 수 있는 만큼만 천천히 호흡해 보세요.',
  },
  {
    id: 'q-bo-2',
    persona: 'burnout',
    quote: '쉬는 것은 게으름이 아니다. 푸른 풀밭에 누워 흐르는 구름을 바라보는 것은 결코 시간 낭비가 아니다.',
    author: '존 러벅',
    takeaway: '에너지가 바닥났다면 비우는 시간이 먼저입니다. 편안한 마음으로 시작하세요.',
  },
  {
    id: 'q-bo-3',
    persona: 'burnout',
    quote: '나무는 꽃을 피우려 서두르지 않는다. 그저 계절이 오기를 기다릴 뿐이다.',
    author: '라이너 마리아 릴케',
    takeaway: '나의 계절을 믿고 조급함을 내려놓는 아침을 만들어 보세요.',
  },

  // 취준 / 이직 페르소나
  {
    id: 'q-js-1',
    persona: 'jobseeker',
    quote: '다른 사람의 속도에 주눅 들지 마라. 꽃마다 피어나는 계절이 다를 뿐이다.',
    author: '틱낫한',
    takeaway: '타인의 결과와 비교하지 말고, 오늘 나만의 한 걸음에 집중하세요.',
  },
  {
    id: 'q-js-2',
    persona: 'jobseeker',
    quote: '불안은 미래를 미리 살아가려는 마음에서 온다. 지금 이 순간 당신이 통제할 수 있는 것은 오늘의 생각뿐이다.',
    author: '마르쿠스 아우렐리우스',
    takeaway: '불확실한 미래 대신 오늘 아침 내가 직접 선택할 수 있는 긍정의 마인드셋을 잡으세요.',
  },
  {
    id: 'q-js-3',
    persona: 'jobseeker',
    quote: '성공은 매일 반복되는 작은 노력들의 합이다.',
    author: '로버트 콜리어',
    takeaway: '거대한 성공도 오늘의 10분 아침 루틴에서 시작됩니다. 당신을 믿으세요.',
  },

  // 미라클 모닝 페르소나
  {
    id: 'q-mm-1',
    persona: 'miracle',
    quote: '당신이 아침을 지배하면, 그 아침이 당신의 하루 전체를 지배하게 된다.',
    author: '팀 페리스',
    takeaway: '눈부신 하루를 설계할 첫 번째 기회가 바로 지금 당신 손안에 있습니다.',
  },
  {
    id: 'q-mm-2',
    persona: 'miracle',
    quote: '어제보다 나은 오늘을 만드는 가장 확실한 방법은, 오늘 아침을 맑고 단단한 마음으로 맞이하는 것이다.',
    author: '에피쿠로스',
    takeaway: '어제의 아쉬움은 잊고 활기찬 마음으로 오늘 하루를 선물처럼 받아들이세요.',
  },
  {
    id: 'q-mm-3',
    persona: 'miracle',
    quote: '행동은 모든 성공의 가장 기초적인 열쇠다.',
    author: '파블로 피카소',
    takeaway: '가벼운 생각 하나를 행동으로 옮길 때 기적은 시작됩니다. 힘차게 출발해 보세요!',
  },
];

export const MOOD_TAGS = [
  { id: 'calm', label: '차분함 ☕', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 'peace', label: '평온/힐링 🌿', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { id: 'energy', label: '열정/활력 ⚡', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { id: 'grateful', label: '감사함 🙏', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 'confidence', label: '자신감 💪', color: 'bg-blue-100 text-blue-800 border-blue-200' },
];
