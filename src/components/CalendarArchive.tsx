import React, { useState } from 'react';
import { RitualLog } from '../types';
import { PERSONAS, MOOD_TAGS } from '../data/mockData';
import { Calendar, Search, Music, Quote, Trash2, Download, Sparkles, Clock, ExternalLink } from 'lucide-react';

interface CalendarArchiveProps {
  logs: RitualLog[];
  onDeleteLog: (id: string) => void;
  onClearAll: () => void;
}

export const CalendarArchive: React.FC<CalendarArchiveProps> = ({ logs, onDeleteLog, onClearAll }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // 검색 및 날짜 필터링
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.quote.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.trackTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = selectedDate ? log.date === selectedDate : true;
    return matchesSearch && matchesDate;
  });

  // 고유한 날짜 목록 (정렬)
  const availableDates = Array.from(new Set(logs.map((l) => l.date))).sort().reverse();

  // JSON 내보내기 백업
  const exportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `morning-ritual-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 검색 & 필터 바 */}
      <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="다짐 내용 또는 키워드 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {availableDates.length > 0 && (
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="">모든 날짜 ({logs.length}개)</option>
              {availableDates.map((date) => (
                <option key={date} value={date}>
                  📅 {date}
                </option>
              ))}
            </select>
          )}

          {logs.length > 0 && (
            <button
              onClick={exportData}
              title="데이터 백업 다운로드"
              className="p-2 border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition flex items-center gap-1 text-xs"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">백업</span>
            </button>
          )}
        </div>
      </div>

      {/* 기록 리스트 */}
      {filteredLogs.length === 0 ? (
        <div className="bg-white/60 rounded-3xl p-12 text-center border border-dashed border-stone-300">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mx-auto mb-3">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-800">아직 저장된 마음가짐 기록이 없습니다</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto leading-relaxed">
            오늘 아침 명상 음악을 듣고, 영감 글귀를 읽은 후 첫 번째 마음가짐을 음성이나 글로 남겨보세요.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLogs.map((log) => {
            const persona = PERSONAS[log.persona] || PERSONAS.burnout;
            const mood = MOOD_TAGS.find((m) => m.id === log.mood) || MOOD_TAGS[0];

            return (
              <div
                key={log.id}
                className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  {/* 상단 메타 */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        {log.date}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium">
                        {persona.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${mood.color}`}>
                        {mood.label}
                      </span>
                      <button
                        onClick={() => onDeleteLog(log.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-red-500 rounded transition"
                        title="기록 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 나의 마음가짐 기록 */}
                  <div className="bg-[#FAF7F2] p-3.5 rounded-xl mb-3 border border-stone-100">
                    <p className="text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      오늘 나의 다짐 & 마음가짐
                    </p>
                    <p className="text-sm font-medium text-stone-900 leading-relaxed whitespace-pre-wrap">
                      "{log.note}"
                    </p>
                  </div>

                  {/* 그날의 영감 글귀 */}
                  <div className="mb-3 px-1">
                    <p className="text-[11px] text-stone-500 italic line-clamp-2">
                      <Quote className="w-3 h-3 inline mr-1 text-stone-400" />
                      {log.quote} — <span className="font-medium text-stone-600">{log.quoteAuthor}</span>
                    </p>
                  </div>
                </div>

                {/* 그날 함께한 음악 */}
                <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <div className="flex items-center gap-1.5 truncate">
                    <Music className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">{log.trackTitle}</span>
                  </div>
                  <a
                    href={`https://www.youtube.com/watch?v=${log.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-400 hover:text-red-600 p-1 shrink-0"
                    title="유튜브에서 다시 듣기"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {logs.length > 0 && (
        <div className="text-center pt-4">
          <button
            onClick={() => {
              if (confirm('저장된 모든 마음가짐 기록을 삭제하시겠습니까? (이 작업은 되돌릴 수 없습니다)')) {
                onClearAll();
              }
            }}
            className="text-[11px] text-stone-400 hover:text-red-600 transition"
          >
            기록 전체 초기화
          </button>
        </div>
      )}
    </div>
  );
};
