import type { QuizQuestion } from "@/lib/types";
import { cx } from "@/lib/format";

const optionLabels = ["A", "B", "C", "D", "E", "F"];
const voiceModes = [
  { label: "Browser voice", value: "browser" },
  { label: "AI voice", value: "ai" },
  { label: "Off", value: "off" }
] as const;

export type QuizVoiceMode = (typeof voiceModes)[number]["value"];

interface QuizQuestionCardProps {
  autoReadEnabled: boolean;
  canUseBrowserVoice: boolean;
  isSpeaking: boolean;
  isSupported: boolean;
  onAutoReadChange: (enabled: boolean) => void;
  onReadAloud: () => void;
  onSelectAnswer: (answerIndex: number) => void;
  onStopReading: () => void;
  onVoiceModeChange: (mode: QuizVoiceMode) => void;
  onPitchChange: (pitch: number) => void;
  onRateChange: (rate: number) => void;
  onVoiceChange: (voiceURI: string) => void;
  onVolumeChange: (volume: number) => void;
  pitch: number;
  question: QuizQuestion;
  questionNumber: number;
  rate: number;
  selectedAnswer?: number;
  selectedVoiceURI: string;
  voiceMode: QuizVoiceMode;
  voiceOptions: Array<{ lang: string; name: string; voiceURI: string }>;
  volume: number;
}

export function QuizQuestionCard({
  autoReadEnabled,
  canUseBrowserVoice,
  isSpeaking,
  isSupported,
  onAutoReadChange,
  onReadAloud,
  onSelectAnswer,
  onStopReading,
  onVoiceModeChange,
  onPitchChange,
  onRateChange,
  onVoiceChange,
  onVolumeChange,
  pitch,
  question,
  questionNumber,
  rate,
  selectedAnswer,
  selectedVoiceURI,
  voiceMode,
  voiceOptions,
  volume
}: QuizQuestionCardProps) {
  const readStatus =
    voiceMode === "off"
      ? "Voice mode is off."
      : voiceMode === "ai"
        ? "AI voice is not connected yet. Quiz text is not sent to an external AI service."
        : !isSupported
          ? "Read-aloud is not supported on this browser. Read-aloud uses this browser only. Quiz text is not sent to an external AI service."
          : isSpeaking
            ? "Reading question aloud."
            : "Read-aloud uses this browser only. Quiz text is not sent to an external AI service.";
  const voiceControls = [
    { label: "Rate", value: rate, min: 0.6, max: 1.4, step: 0.05, onChange: onRateChange },
    { label: "Pitch", value: pitch, min: 0.5, max: 1.8, step: 0.05, onChange: onPitchChange },
    { label: "Volume", value: volume, min: 0, max: 1, step: 0.05, onChange: onVolumeChange }
  ];

  return (
    <>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-lqcs-teal">Question {questionNumber}</p>
      <h2 className="mt-3 text-2xl font-bold text-ink">{question.text}</h2>
      <div className="mt-4 rounded-lg border border-lqcs-line bg-slate-50 p-4">
        <div className="flex flex-col gap-4">
          <div aria-label="Voice mode" className="flex flex-col gap-2" role="radiogroup">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Voice mode</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {voiceModes.map((mode) => (
                <button
                  aria-checked={voiceMode === mode.value}
                  aria-label={`Use ${mode.label}`}
                  className={cx(
                    "focus-ring rounded-md border px-3 py-2 text-sm font-bold",
                    voiceMode === mode.value ? "border-lqcs-blue bg-lqcs-sky text-lqcs-blue" : "border-lqcs-line bg-white text-ink"
                  )}
                  key={mode.value}
                  onClick={() => onVoiceModeChange(mode.value)}
                  role="radio"
                  type="button"
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                aria-label={`Read question ${questionNumber} and all answer options aloud`}
                className="focus-ring rounded-md bg-lqcs-blue px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!canUseBrowserVoice}
                onClick={onReadAloud}
                type="button"
              >
                Read question aloud
              </button>
              <button
                aria-label="Stop reading the quiz question aloud"
                className="focus-ring rounded-md border border-lqcs-line bg-white px-4 py-2 text-sm font-bold text-ink disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!canUseBrowserVoice || !isSpeaking}
                onClick={onStopReading}
                type="button"
              >
                Stop reading
              </button>
            </div>
            <label className={cx("flex items-start gap-2 text-sm font-semibold leading-6 text-ink", !canUseBrowserVoice && "cursor-not-allowed opacity-60")}>
              <input
                aria-label="Automatically read each question when it opens"
                checked={autoReadEnabled}
                className="mt-1 h-4 w-4 rounded border-lqcs-line"
                disabled={!canUseBrowserVoice}
                onChange={(event) => onAutoReadChange(event.target.checked)}
                type="checkbox"
              />
              <span>Automatically read each question when it opens</span>
            </label>
          </div>
          <div className={cx("grid gap-3 rounded-md border border-lqcs-line bg-white p-3 md:grid-cols-2", !canUseBrowserVoice && "opacity-60")}>
            <label className="md:col-span-2">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Browser voice</span>
              <select
                aria-label="Select browser read-aloud voice"
                className="focus-ring mt-2 w-full rounded-md border border-lqcs-line bg-white px-3 py-2 text-sm font-semibold text-ink"
                disabled={!canUseBrowserVoice}
                onChange={(event) => onVoiceChange(event.target.value)}
                value={selectedVoiceURI}
              >
                <option value="">Default browser voice</option>
                {voiceOptions.map((voice) => (
                  <option key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </label>
            {voiceControls.map((control) => (
              <label className="text-sm font-semibold text-ink" key={control.label}>
                <span>
                  {control.label}: {control.value.toFixed(2)}
                </span>
                <input
                  aria-label={`Read-aloud ${control.label}`}
                  className="mt-2 w-full accent-lqcs-blue"
                  disabled={!canUseBrowserVoice}
                  max={control.max}
                  min={control.min}
                  onChange={(event) => control.onChange(Number.parseFloat(event.target.value))}
                  step={control.step}
                  type="range"
                  value={control.value}
                />
              </label>
            ))}
          </div>
        </div>
        <p className={cx("mt-3 text-xs font-medium", canUseBrowserVoice ? "text-slate-600" : "text-care-amber")} role="status">
          {readStatus}
        </p>
      </div>
      <div className="mt-6 grid gap-3">
        {question.options.map((option, index) => (
          <label
            className={cx(
              "flex cursor-pointer items-start gap-3 rounded-lg border p-4 text-sm font-semibold focus-within:ring-2 focus-within:ring-lqcs-blue/30",
              selectedAnswer === index ? "border-lqcs-blue bg-lqcs-sky text-ink" : "border-lqcs-line bg-white text-slate-700"
            )}
            key={option}
          >
            <input
              checked={selectedAnswer === index}
              className="mt-0.5 h-4 w-4"
              name={question.id}
              onChange={() => onSelectAnswer(index)}
              type="radio"
            />
            <span>
              <span className="font-black text-lqcs-blue">Option {optionLabels[index] ?? index + 1}: </span>
              {option}
            </span>
          </label>
        ))}
      </div>
    </>
  );
}
