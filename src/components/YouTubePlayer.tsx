import React, { useState, useEffect, useRef } from 'react';
import { MusicTrack } from '../types';
import { MUSIC_TRACKS } from '../data/mockData';
import { Music, ChevronRight, ExternalLink, Sparkles, Link, Check, Radio, Volume2, VolumeX } from 'lucide-react';

interface YouTubePlayerProps {
  currentTrack: MusicTrack;
  onSelectTrack: (track: MusicTrack) => void;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ currentTrack, onSelectTrack }) => {
  const [showTrackList, setShowTrackList] = useState<boolean>(false);
  const [customUrl, setCustomUrl] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState<boolean>(false);

  // Web Audio API를 활용한 자연 앰비언트 사운드 (빗소리 & 파도 사운드 제너레이터 - 유튜브 대체용)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);

  // 유튜브 URL에서 비디오 ID 추출 헬퍼
  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractYouTubeId(customUrl.trim());
    if (!id) {
      alert('올바른 유튜브 영상 링크를 입력해 주세요. (예: https://youtu.be/...)');
      return;
    }
    const customTrack: MusicTrack = {
      id: 'custom-' + Date.now(),
      title: '내가 선택한 아침 음악',
      youtubeId: id,
      genre: '사용자 플레이리스트',
      duration: 'Custom',
      description: '직접 등록하신 유튜브 영상입니다.',
    };
    onSelectTrack(customTrack);
    setCustomUrl('');
    setShowCustomInput(false);
  };

  // 브라우저 내장 앰비언트 (빗소리/백색소음) 토글 (유튜브가 차단될 때 100% 안전한 대안)
  const toggleAmbientSound = () => {
    if (isAmbientPlaying) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsAmbientPlaying(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        // 브라운 노이즈 (따뜻한 빗소리/파도소리 효과) 생성
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5; // 음량 적절화
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800; // 부드러운 빗소리 톤

        const gain = ctx.createGain();
        gain.gain.value = 0.15; // 편안한 볼륨
        ambientGainRef.current = gain;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start();
        setIsAmbientPlaying(true);
      } catch (err) {
        console.error('Ambient sound error', err);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-stone-200/80 transition-all hover:shadow-md">
      {/* 헤더 및 컨트롤 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
            <Music className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-semibold text-amber-800 tracking-wider uppercase">오늘의 모닝 사운드</span>
            <span className="ml-2 text-[11px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
              {currentTrack.genre}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* 브라우저 내장 자연 소리 토글 버튼 */}
          <button
            onClick={toggleAmbientSound}
            className={`text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition font-medium ${
              isAmbientPlaying
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200/80'
            }`}
            title="유튜브 대신 브라우저 내장 빗소리/자연음 재생"
          >
            {isAmbientPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <Radio className="w-3.5 h-3.5 text-stone-400" />}
            <span>{isAmbientPlaying ? '자연음 재생 중' : '자연음 듣기'}</span>
          </button>

          <button
            onClick={() => setShowTrackList(!showTrackList)}
            className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-0.5 bg-stone-50 hover:bg-stone-100 px-2.5 py-1.5 rounded-lg transition"
          >
            목록 <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 현재 트랙 타이틀 & 설명 */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-base font-bold text-stone-900">{currentTrack.title}</h3>
          <p className="text-xs text-stone-500 mt-0.5">{currentTrack.description}</p>
        </div>

        <button
          onClick={() => setShowCustomInput(!showCustomInput)}
          className="text-[11px] text-amber-700 hover:text-amber-900 shrink-0 flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md border border-amber-200/60"
        >
          <Link className="w-3 h-3" />
          <span>링크 직접 넣기</span>
        </button>
      </div>

      {/* 사용자 지정 유튜브 링크 입력창 */}
      {showCustomInput && (
        <form onSubmit={handleApplyCustomUrl} className="mb-4 p-3 bg-amber-50/50 rounded-xl border border-amber-200">
          <p className="text-xs font-semibold text-amber-900 mb-1.5">좋아하는 유튜브 음악/플레이리스트 링크를 입력하세요</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="https://youtu.be/... 또는 watch?v=..."
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition"
            >
              적용
            </button>
          </div>
        </form>
      )}

      {/* 유튜브 임베드 플레이어 (가장 호환성 높은 youtube-nocookie 도메인 사용) */}
      <div className="rounded-xl overflow-hidden shadow-inner bg-stone-900 aspect-video max-h-56 relative w-full border border-stone-800">
        <iframe
          key={currentTrack.youtubeId}
          className="w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${currentTrack.youtubeId}?rel=0&modestbranding=1&playsinline=1`}
          title={currentTrack.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>

      {/* 유튜브 앱에서 직접 열기 안내 배너 (외부 임베드 제한 시 확실한 대안) */}
      <div className="mt-3 p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
        <div className="text-[11px] text-stone-600 leading-tight">
          💡 <span className="font-medium text-stone-800">영상 소유자가 웹 임베드를 제한한 경우</span> 앱에서 바로 들어보세요.
        </div>
        <a
          href={`https://www.youtube.com/watch?v=${currentTrack.youtubeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition shrink-0 shadow-sm"
        >
          <span>YouTube에서 열기</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* 다른 추천 트랙 목록 */}
      {showTrackList && (
        <div className="mt-4 pt-3 border-t border-stone-100">
          <p className="text-xs font-semibold text-stone-500 mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            검증된 추천 아침 사운드 목록
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {MUSIC_TRACKS.map((track) => (
              <button
                key={track.id}
                onClick={() => {
                  onSelectTrack(track);
                  setShowTrackList(false);
                }}
                className={`text-left p-2.5 rounded-xl border text-xs transition flex flex-col justify-between ${
                  track.id === currentTrack.id
                    ? 'border-amber-400 bg-amber-50/60 font-semibold text-amber-900'
                    : 'border-stone-100 hover:border-stone-300 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium truncate">{track.title}</span>
                  <span className="text-[10px] text-stone-400 shrink-0 ml-1">{track.genre}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
