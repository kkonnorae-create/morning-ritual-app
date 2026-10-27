import React, { useState, useEffect, useRef } from 'react';
import { PersonaType, MusicTrack, DailyQuote, RitualLog } from './types';
import { PERSONAS, MUSIC_TRACKS, DAILY_QUOTES, MOOD_TAGS } from './data/mockData';
import { YouTubePlayer } from './components/YouTubePlayer';
import { OnboardingModal } from './components/OnboardingModal';
import { CalendarArchive } from './components/CalendarArchive';
import { SpeechHandler } from './utils/speech';
import {
  Sun,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Calendar,
  CheckCircle,
  RotateCcw,
  SlidersHorizontal,
  Heart,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export const App: React.FC = () => {
  // 상태 관리
  const [activeTab, setActiveTab] = useState<'ritual' | 'archive'>('ritual');
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>('burnout');
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack>(MUSIC_TRACKS[0]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState<number>(0);
  const [noteText, setNoteText] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState<string>(MOOD_TAGS[0].id);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isSpeakingQuote, setIsSpeakingQuote] = useState<boolean>(false);
  const [logs, setLogs] = useState<RitualLog[]>([]);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const speechHandlerRef = useRef<SpeechHandler | null>(null);

  // 로컬스토리지에서 기존 기록 및 설정 불러오기
  useEffect(() => {
    try {
      const savedLogs = localStorage.getItem('morning_ritual_logs');
      if (savedLogs) {
        setLogs(JSON.parse(savedLogs));
      }
      const savedPersona = localStorage.getItem('morning_ritual_persona') as PersonaType;
      if (savedPersona && PERSONAS[savedPersona]) {
        setSelectedPersona(savedPersona);
      } else {
        // 첫 방문 시 온보딩 모달 열기
        setShowOnboarding(true);
      }
    } catch (e) {
      console.error('Failed to load local storage', e);
    }
  }, []);

  // 페르소나 변경 시 로컬스토리지 저장 및 추천 트랙/글귀 갱신
  const handleSelectPersona = (p: PersonaType) => {
    setSelectedPersona(p);
    localStorage.setItem('morning_ritual_persona', p);
    setCurrentQuoteIndex(0);

    // 페르소나에 맞는 음악 추천
    if (p === 'burnout') setCurrentTrack(MUSIC_TRACKS[0]); // 피아노 새소리
    else if (p === 'jobseeker') setCurrentTrack(MUSIC_TRACKS[4]); // 세타파
    else if (p === 'miracle') setCurrentTrack(MUSIC_TRACKS[2]); // 모닝 재즈
  };

  // 현재 페르소나의 인용문 목록
  const personaQuotes = DAILY_QUOTES.filter((q) => q.persona === selectedPersona);
  const currentQuote = personaQuotes[currentQuoteIndex % personaQuotes.length] || DAILY_QUOTES[0];

  // 음성 인식 핸들러 초기화
  useEffect(() => {
    speechHandlerRef.current = new SpeechHandler(
      (transcript, isFinal) => {
        setNoteText((prev) => {
          // 실시간으로 텍스트 추가
          if (isFinal) {
            return prev ? `${prev} ${transcript}` : transcript;
          }
          return prev;
        });
      },
      (errorMsg) => {
        alert(errorMsg);
        setIsRecording(false);
      },
      (listening) => {
        setIsRecording(listening);
      }
    );

    return () => {
      speechHandlerRef.current?.stop();
      SpeechHandler.stopSpeaking();
    };
  }, []);

  // 음성 녹음 토글
  const toggleRecording = () => {
    if (!speechHandlerRef.current) return;
    if (!speechHandlerRef.current.isSupported()) {
      alert('현재 브라우저에서는 음성 인식을 지원하지 않습니다. 텍스트로 직접 입력해 주세요.');
      return;
    }
    speechHandlerRef.current.toggle();
  };

  // 글귀 음성 낭독 (TTS) 토글
  const toggleSpeakQuote = () => {
    if (isSpeakingQuote) {
      SpeechHandler.stopSpeaking();
      setIsSpeakingQuote(false);
    } else {
      setIsSpeakingQuote(true);
      SpeechHandler.speak(`${currentQuote.quote}. ${currentQuote.takeaway}`, () => {
        setIsSpeakingQuote(false);
      });
    }
  };

  // 리추얼 저장하기
  const handleSaveRitual = () => {
    if (!noteText.trim()) {
      alert('오늘의 마음가짐이나 다짐을 한마디라도 남겨주세요.');
      return;
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    const newLog: RitualLog = {
      id: 'log-' + Date.now(),
      date: todayStr,
      persona: selectedPersona,
      trackId: currentTrack.id,
      trackTitle: currentTrack.title,
      youtubeId: currentTrack.youtubeId,
      quote: currentQuote.quote,
      quoteAuthor: currentQuote.author,
      note: noteText.trim(),
      mood: selectedMood,
      createdAt: Date.now(),
    };

    const updated = [newLog, ...logs];
    setLogs(updated);
    localStorage.setItem('morning_ritual_logs', JSON.stringify(updated));

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setActiveTab('archive'); // 저장 후 아카이브 탭으로 이동
    }, 1500);
  };

  // 기록 삭제
  const handleDeleteLog = (id: string) => {
    const updated = logs.filter((l) => l.id !== id);
    setLogs(updated);
    localStorage.setItem('morning_ritual_logs', JSON.stringify(updated));
  };

  // 전체 초기화
  const handleClearAll = () => {
    setLogs([]);
    localStorage.removeItem('morning_ritual_logs');
  };

  const personaInfo = PERSONAS[selectedPersona];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-20">
      {/* 상단 네비게이션 & 헤더 */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-300 flex items-center justify-center text-white shadow-md shadow-amber-200/50">
            <Sun className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-stone-900">모닝 리추얼</h1>
            <p className="text-[11px] text-stone-500 font-medium">매일 아침 나를 깨우는 10분의 시간</p>
          </div>
        </div>

        {/* 페르소나 설정 변경 버튼 */}
        <button
          onClick={() => setShowOnboarding(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200 bg-white/80 hover:bg-stone-50 text-xs font-semibold text-stone-700 shadow-sm transition"
        >
          <span>{personaInfo.badge}</span>
          <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
        </button>
      </header>

      {/* 탭 전환 바 */}
      <div className="flex p-1 bg-stone-200/60 backdrop-blur rounded-2xl mb-6 shadow-inner">
        <button
          onClick={() => setActiveTab('ritual')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'ritual'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          오늘의 리추얼
        </button>
        <button
          onClick={() => setActiveTab('archive')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'archive'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-stone-500" />
          나의 마음 아카이브 ({logs.length})
        </button>
      </div>

      {/* 탭 컨텐츠 */}
      {activeTab === 'ritual' ? (
        <div className="space-y-6">
          {/* STEP 1: 오늘의 명상 음악 */}
          <section>
            <YouTubePlayer currentTrack={currentTrack} onSelectTrack={setCurrentTrack} />
          </section>

          {/* STEP 2: 오늘의 마인드셋 글귀 */}
          <section className="bg-gradient-to-br from-white via-amber-50/30 to-orange-50/40 rounded-2xl p-6 border border-amber-200/70 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-800 tracking-wider uppercase flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                오늘의 마인드셋 글귀
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleSpeakQuote}
                  className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition ${
                    isSpeakingQuote
                      ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                      : 'bg-white/80 hover:bg-white text-stone-600 border-stone-200'
                  }`}
                  title={isSpeakingQuote ? '낭독 멈추기' : '부드러운 목소리로 듣기'}
                >
                  {isSpeakingQuote ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span className="text-[11px] font-medium">{isSpeakingQuote ? '멈춤' : '듣기'}</span>
                </button>

                <button
                  onClick={() => setCurrentQuoteIndex((prev) => prev + 1)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 bg-white/80 hover:bg-white border border-stone-200 rounded-lg transition"
                  title="다른 글귀 보기"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <blockquote className="my-3">
              <p className="text-base sm:text-lg font-bold text-stone-900 leading-snug tracking-tight">
                "{currentQuote.quote}"
              </p>
              <footer className="text-xs font-semibold text-amber-800 mt-2 text-right">
                — {currentQuote.author}
              </footer>
            </blockquote>

            <div className="mt-3 pt-3 border-t border-amber-100 text-xs text-stone-600 leading-relaxed bg-white/60 p-3 rounded-xl">
              💡 <span className="font-medium text-stone-800">오늘의 실천 제안:</span> {currentQuote.takeaway}
            </div>
          </section>

          {/* STEP 3: Voice-First 다짐 기록 (음성/텍스트 저널링) */}
          <section className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  나의 마음가짐 기록하기
                </h3>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  마이크 버튼을 누르고 오늘 하루의 다짐을 편하게 소리내어 말해보세요.
                </p>
              </div>

              {/* 음성 녹음 버튼 */}
              <button
                onClick={toggleRecording}
                className={`relative px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
                  isRecording
                    ? 'bg-red-500 text-white animate-pulse shadow-red-200'
                    : 'bg-stone-900 hover:bg-stone-800 text-white'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isRecording ? '듣는 중...' : '음성으로 말하기'}</span>
              </button>
            </div>

            {/* 입력 텍스트 영역 */}
            <div className="relative">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="예: 오늘 아침엔 조급해하지 않고, 나만의 호흡으로 차분하게 하나씩 끝내보자."
                rows={3}
                className="w-full p-4 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition resize-none leading-relaxed"
              />
              {isRecording && (
                <div className="absolute right-3 bottom-3 flex items-center gap-1 text-[11px] text-red-500 font-semibold bg-red-50 px-2 py-0.5 rounded-full border border-red-200 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  음성 인식 중...
                </div>
              )}
            </div>

            {/* 기분 태그 선택 */}
            <div>
              <p className="text-xs font-semibold text-stone-500 mb-2">오늘 아침 나의 마음 상태는?</p>
              <div className="flex flex-wrap gap-2">
                {MOOD_TAGS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMood(m.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                      selectedMood === m.id
                        ? `${m.color} ring-2 ring-stone-800 ring-offset-1`
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 완료 및 저장 버튼 */}
            <div className="pt-2">
              <button
                onClick={handleSaveRitual}
                disabled={savedSuccess}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md ${
                  savedSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-200'
                }`}
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>오늘의 리추얼 완료! 아카이브에 저장되었습니다</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 fill-white" />
                    <span>오늘의 마음가짐 저장하고 하루 시작하기</span>
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      ) : (
        /* 탭 2: 나의 마음 아카이브 (캘린더 & 검색) */
        <CalendarArchive logs={logs} onDeleteLog={handleDeleteLog} onClearAll={handleClearAll} />
      )}

      {/* 온보딩 모달 */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        selectedPersona={selectedPersona}
        onSelectPersona={handleSelectPersona}
      />
    </div>
  );
};
