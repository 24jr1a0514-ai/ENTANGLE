import React, { useState } from 'react';
import type { RealVideoConfig } from '../../data/chapterMedia';
import {
  Play,
  Tv,
  Clock,
  ExternalLink,
  BookOpen,
  Sparkles,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export interface TopicVideoItem {
  id: string;
  title: string;
  videoEmbedId?: string;
  videoTitle?: string;
  keyConcepts?: string[];
  explanation?: string;
}

interface QuantumVideoPlayerProps {
  video: RealVideoConfig;
  topicVideos?: TopicVideoItem[];
}

export const QuantumVideoPlayer: React.FC<QuantumVideoPlayerProps> = ({ video, topicVideos }) => {
  const [selectedEmbedId, setSelectedEmbedId] = useState<string>(video.embedId);
  const [selectedTitle, setSelectedTitle] = useState<string>(video.title);
  const [selectedChannel, setSelectedChannel] = useState<string>(video.channel);
  const [activeTimestamp, setActiveTimestamp] = useState<number | null>(null);
  const [autoplayFlag, setAutoplayFlag] = useState<number>(0);

  const validTopicVideos = topicVideos?.filter((t) => t.videoEmbedId) || [];

  const handleSelectTopic = (embedId: string, title: string, topicName?: string) => {
    setSelectedEmbedId(embedId);
    setSelectedTitle(topicName ? `${topicName} - ${title}` : title);
    setSelectedChannel('Quantum Topic Lecture');
    setActiveTimestamp(null);
    setAutoplayFlag(1);
  };

  const handleJumpToTimestamp = (seconds: number) => {
    setActiveTimestamp(seconds);
    setAutoplayFlag(1);
  };

  const currentIframeSrc = activeTimestamp !== null
    ? `https://www.youtube-nocookie.com/embed/${selectedEmbedId}?autoplay=1&start=${activeTimestamp}&rel=0&modestbranding=1`
    : `https://www.youtube-nocookie.com/embed/${selectedEmbedId}?autoplay=${autoplayFlag}&rel=0&modestbranding=1`;

  return (
    <div className="flex flex-col bg-card rounded-3xl border border-border overflow-hidden shadow-2xl space-y-4">
      {/* Topic Video Playlist Selector */}
      {validTopicVideos.length > 0 && (
        <div className="bg-muted/40 p-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" /> Select Topic Video to Play Directly ({validTopicVideos.length} Topics):
            </h4>
            <button
              onClick={() => handleSelectTopic(video.embedId, video.title)}
              className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${
                selectedEmbedId === video.embedId
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary text-secondary-foreground border-border hover:bg-muted'
              }`}
            >
              Full Chapter Overview
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {validTopicVideos.map((topic) => {
              const isCurrent = selectedEmbedId === topic.videoEmbedId;
              return (
                <button
                  key={topic.id}
                  onClick={() => handleSelectTopic(topic.videoEmbedId!, topic.videoTitle || topic.title, topic.title)}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs text-left transition-all group ${
                    isCurrent
                      ? 'bg-primary/20 border-primary text-primary font-bold shadow-md shadow-primary/10 ring-1 ring-primary'
                      : 'bg-card border-border hover:border-primary/40 text-foreground'
                  }`}
                >
                  <div className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary font-bold text-[11px]">
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <div className="truncate">
                    <p className="truncate font-semibold text-foreground group-hover:text-primary transition-colors">
                      {topic.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {topic.videoTitle || 'Click to Play Directly'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Video Viewport Header */}
      <div className="bg-gradient-to-r from-purple-950/60 via-card to-blue-950/40 p-4 border-b border-border flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-2xl border border-primary/30 flex items-center justify-center shadow-md shadow-primary/10">
            <Tv className="w-5 h-5 text-primary animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground leading-snug">{selectedTitle}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
              <span className="text-primary font-semibold">📺 {selectedChannel}</span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3 text-muted-foreground" /> {video.duration}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Direct Player
          </div>
          <a
            href={`https://www.youtube.com/watch?v=${selectedEmbedId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-secondary hover:bg-muted text-secondary-foreground border border-border transition-colors"
          >
            Watch on YouTube <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Embedded Real HD Video Player */}
      <div className="relative w-full aspect-video bg-black overflow-hidden border-y border-border">
        <iframe
          src={currentIframeSrc}
          title={selectedTitle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>

      {/* Interactive Key Timestamps Bar */}
      {video.keyTimestamps && video.keyTimestamps.length > 0 && (
        <div className="px-6 py-2">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-primary" /> Key Video Chapters & Jump Timestamps:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {video.keyTimestamps.map((ts, idx) => {
              const isActive = activeTimestamp === ts.seconds;
              return (
                <button
                  key={idx}
                  onClick={() => handleJumpToTimestamp(ts.seconds)}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs text-left transition-all group ${
                    isActive
                      ? 'bg-primary/20 border-primary text-primary font-bold shadow-md shadow-primary/10'
                      : 'bg-secondary/60 border-border hover:border-primary/40 text-foreground'
                  }`}
                >
                  <span className="px-2 py-1 rounded-lg bg-background font-mono text-[11px] font-bold text-primary border border-border shrink-0 flex items-center gap-1">
                    <Play className="w-3 h-3 fill-current" /> {ts.time}
                  </span>
                  <span className="truncate group-hover:text-primary transition-colors font-medium">
                    {ts.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Video Description & Educational Summary */}
      <div className="p-6 bg-muted/20 border-t border-border space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
            Lecture Summary & Key Concepts
          </h4>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {video.description}
        </p>

        <div className="flex items-center gap-4 text-xs font-semibold text-emerald-400 pt-1">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> High Definition Video
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Expert Verified Lecture
          </span>
        </div>
      </div>
    </div>
  );
};
