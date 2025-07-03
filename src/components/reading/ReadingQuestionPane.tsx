import React from "react";
import { allowedQuestionTypes } from "@/utils/readingQuestionTypes";
import { getQuestionTypeInfo } from "@/utils/readingQuestionTypes";

// Fallback choices for key types
const T_F_NG = ["TRUE", "FALSE", "NOT GIVEN"];
const Y_N_NG = ["YES", "NO", "NOT GIVEN"];

// Helper: Render options for MCQ, Matching, etc.
function OptionList({
  options,
  value,
  onChange,
  multi = false,
  disabled = false,
}: {
  options: string[];
  value: string | string[];
  onChange: (v: string | string[]) => void;
  multi?: boolean;
  disabled?: boolean;
}) {
  if (multi) {
    // Checkbox group for multi-select
    return (
      <div className="flex flex-col gap-2">
        {options.map((opt, idx) => (
          <label key={idx} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={Array.isArray(value) && value.includes(opt)}
              disabled={disabled}
              onChange={e => {
                if (!Array.isArray(value)) return;
                if (e.target.checked) {
                  onChange([...value, opt]);
                } else {
                  onChange(value.filter((v: string) => v !== opt));
                }
              }}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    );
  }
  // Radio group for single select
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt, idx) => (
        <label key={idx} className="flex items-center gap-2">
          <input
            type="radio"
            name="option"
            value={opt}
            checked={value === opt}
            disabled={disabled}
            onChange={() => onChange(opt)}
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
}

// Main component
export default function ReadingQuestionPane({
  passages,
  answers,
  flags,
  onAnswerChange,
  onFlag,
  readOnly = false,
}: {
  passages: any[];
  answers: Record<string, string | string[]>;
  flags: Record<string, boolean>;
  onAnswerChange: (qnId: string, value: string | string[]) => void;
  onFlag: (qnId: string) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="space-y-8">
      {passages.map((p: any, pi: number) =>
        p.question_groups.map((g: any, gi: number) => (
          <div key={pi + "-" + gi} className="mb-8">
            {g.instruction && (
              <div className="mb-3 p-2 rounded bg-blue-50 border-l-4 border-blue-400 text-blue-700 text-sm">
                {g.instruction}
              </div>
            )}
            {g.questions.map((q: any, qidx: number) => {
              const qnId = q.id || `p${p.passage_number}q${q.question_number}`;
              const userAnswer = answers[qnId] || (Array.isArray(q.correct_answer) ? [] : "");
              const flagged = flags[qnId];
              const qType = q.question_type;
              const qTypeInfo = getQuestionTypeInfo(qType);

              // Use question_text if present, else fallback to text.
              const mainText = q.question_text || q.text || "";

              // Dropdown: Handle TFNG/YNNG etc.
              const isTFNG =
                qType === "Identifying Information (True/False/Not Given)";
              const isYNNG =
                qType === "Identifying Writer's Views/Claims (Yes/No/Not Given)";
              const dropdownOptions =
                q.options && q.options.length > 0
                  ? q.options
                  : isTFNG
                  ? T_F_NG
                  : isYNNG
                  ? Y_N_NG
                  : qTypeInfo?.answerChoices || [];

              return (
                <div
                  key={qnId}
                  id={`question-${qnId}`}
                  className={`mb-6 p-4 rounded-xl border shadow-sm bg-white relative ${
                    flagged ? "border-yellow-500" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-4 mb-1">
                    <span className="font-bold text-lg">
                      Q{q.question_number}
                    </span>
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs">
                      {qType}
                    </span>
                    {qTypeInfo?.studentInstructions && (
                      <span className="ml-2 text-xs text-gray-500">
                        {qTypeInfo.studentInstructions}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => onFlag(qnId)}
                      className={`ml-auto text-xs px-3 py-1 rounded ${
                        flagged
                          ? "bg-yellow-200 text-yellow-900 border border-yellow-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {flagged ? "Flagged" : "Flag"}
                    </button>
                  </div>
                  <div className="mb-2 text-base font-medium">
                    {mainText}
                  </div>
                  {q.instruction && (
                    <div className="mb-2 text-sm text-blue-700">
                      <em>{q.instruction}</em>
                    </div>
                  )}

                  {/* Render UI by question type */}
                  {qTypeInfo ? (
                    <>
                      {(() => {
                        // Handle dropdown override for TFNG/YNNG
                        if (isTFNG || isYNNG) {
                          return (
                            <select
                              value={userAnswer || ""}
                              onChange={e => onAnswerChange(qnId, e.target.value)}
                              disabled={readOnly}
                              className="w-52 p-2 border rounded"
                            >
                              <option value="">Select…</option>
                              {dropdownOptions.map(opt => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          );
                        }
                        switch (qTypeInfo.ui) {
                          case "mcq":
                            return (
                              <OptionList
                                options={q.options || []}
                                value={userAnswer}
                                onChange={v => onAnswerChange(qnId, v)}
                                disabled={readOnly}
                              />
                            );
                          case "dropdown":
                            return (
                              <select
                                value={userAnswer || ""}
                                onChange={e => onAnswerChange(qnId, e.target.value)}
                                disabled={readOnly}
                                className="w-52 p-2 border rounded"
                              >
                                <option value="">Select…</option>
                                {(dropdownOptions || []).map(opt => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            );
                          case "matching":
                            // Render as two-column input for each sub-question
                            return (
                              <div className="flex flex-col gap-3">
                                {(q.options || []).map((opt: string, idx: number) => (
                                  <div key={idx} className="flex gap-3 items-center">
                                    <div className="w-56 font-medium">{opt}</div>
                                    <select
                                      className="p-2 border rounded"
                                      value={
                                        (userAnswer && typeof userAnswer === "object"
                                          ? userAnswer[idx] || ""
                                          : "")
                                      }
                                      onChange={e => {
                                        const arr =
                                          Array.isArray(userAnswer) &&
                                          userAnswer.length === q.options.length
                                            ? [...userAnswer]
                                            : Array(q.options.length).fill("");
                                        arr[idx] = e.target.value;
                                        onAnswerChange(qnId, arr);
                                      }}
                                      disabled={readOnly}
                                    >
                                      <option value="">Choose…</option>
                                      {q.matching_targets?.length
                                        ? q.matching_targets.map((t: string) => (
                                            <option key={t} value={t}>
                                              {t}
                                            </option>
                                          ))
                                        : // Fallback: allow answers A, B, C, etc.
                                          ["A", "B", "C", "D", "E", "F", "G"].map(c => (
                                            <option key={c} value={c}>
                                              {c}
                                            </option>
                                          ))}
                                    </select>
                                  </div>
                                ))}
                              </div>
                            );
                          case "options":
                            return (
                              <OptionList
                                options={q.options || []}
                                value={userAnswer}
                                onChange={v => onAnswerChange(qnId, v)}
                                multi
                                disabled={readOnly}
                              />
                            );
                          case "title":
                            return (
                              <OptionList
                                options={q.options || []}
                                value={userAnswer}
                                onChange={v => onAnswerChange(qnId, v)}
                                disabled={readOnly}
                              />
                            );
                          case "blank":
                          case "input":
                            return (
                              <input
                                type="text"
                                className="w-64 p-2 border rounded"
                                value={userAnswer || ""}
                                onChange={e => onAnswerChange(qnId, e.target.value)}
                                disabled={readOnly}
                                placeholder="Your answer…"
                                autoComplete="off"
                              />
                            );
                          default:
                            return (
                              <input
                                type="text"
                                className="w-64 p-2 border rounded"
                                value={userAnswer || ""}
                                onChange={e => onAnswerChange(qnId, e.target.value)}
                                disabled={readOnly}
                                placeholder="Your answer…"
                                autoComplete="off"
                              />
                            );
                        }
                      })()}
                    </>
                  ) : (
                    <input
                      type="text"
                      className="w-64 p-2 border rounded"
                      value={userAnswer || ""}
                      onChange={e => onAnswerChange(qnId, e.target.value)}
                      disabled={readOnly}
                      placeholder="Your answer…"
                      autoComplete="off"
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
}
