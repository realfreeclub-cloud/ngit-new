"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Keyboard, XCircle, Scissors, AlertCircle, Timer, Download, Target } from "lucide-react";
import Link from "next/link";

export default function TypingResultDetails({ params }: { params: { id: string } }) {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorFormulaOn, setErrorFormulaOn] = useState(true);
  const [detailedComparison, setDetailedComparison] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/typing/results/details/${params.id}`);
        const data = await res.json();
        setResult(data);
      } catch (error) {
        console.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  if (loading) return <div className="p-20 text-center animate-pulse font-bold">Generating your report...</div>;
  if (!result || !result.examId || !result.examId.passageId) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-xl font-bold">Result Data Incomplete</h2>
        <p className="text-slate-500 mt-2">Some information about this exam or passage is no longer available.</p>
        <Link href="/student/results" className="text-blue-600 underline mt-4 inline-block">Back to Results</Link>
      </div>
    );
  }

  const originalWords = result.examId.passageId.content?.trim().split(/\s+/) || [];
  const submittedWords = result.submittedText?.trim().split(/\s+/) || [];

  const totalKeystrokesGiven = result.examId.passageId.content?.length || 0;
  const keystrokesTyped = result.submittedText?.length || 0;
  const wordsTyped = submittedWords.length > 0 && submittedWords[0] !== "" ? submittedWords.length : 0;

  // Calculate detailed mistakes
  let fullMistakes = 0;
  let halfMistakes = 0;
  
  submittedWords.forEach((word: string, idx: number) => {
    const originalWord = originalWords[idx];
    if (word !== originalWord) {
      if (!originalWord || Math.abs(word.length - originalWord.length) > 2) {
        fullMistakes++;
      } else {
        halfMistakes++;
      }
    }
  });

  const totalWrongWords = fullMistakes + halfMistakes;
  const netWrongWords = fullMistakes + (halfMistakes / 2);
  const netCorrectWords = Math.max(0, wordsTyped - netWrongWords);
  const timeDurationMins = result.examId.duration || 10;
  const timeTakenMins = (result.timeTaken || 0) / 60;
  const netWpm = timeTakenMins > 0 ? (netCorrectWords / timeTakenMins).toFixed(2) : "0.00";
  
  const minKeystrokes = Math.round((timeDurationMins * 30 * 5) / 2); // Example minimum threshold
  const isQualified = parseFloat(netWpm) >= 30;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs} min.`;
  };

  const getFontFamily = () => {
    const lang = result.examId?.language?.toLowerCase() || "";
    if (lang.includes("kruti") || lang.includes("kurti")) return "'Kruti Dev 010', Arial, sans-serif";
    if (lang.includes("mangal") || lang.includes("hindi")) return "Mangal, Arial, sans-serif";
    return "Inter, Arial, sans-serif";
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 print:py-0 print:bg-white font-sans">
      <div className="max-w-6xl mx-auto px-4 print:px-0">
        
        {/* Print Header */}
        <div className="flex justify-between items-center mb-8 print:hidden">
          <Link href="/student/results" className="text-slate-500 hover:text-black font-bold">
            ← Back to Dashboard
          </Link>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-[#2a9d8f] text-white px-4 py-2 rounded font-bold shadow hover:bg-[#21867a]"
          >
            <Download className="w-4 h-4" /> Save as PDF
          </button>
        </div>

        <div className="bg-white p-8 border border-slate-200 rounded shadow-sm print:border-none print:shadow-none print:p-0">
          
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-sm font-medium border-b pb-6 print:border-b-2">
            <div className="space-y-4">
              <p><span className="font-bold">Exam Title:</span> {result.examId?.title || "N/A"}</p>
              <p><span className="font-bold">Passage Title:</span> {result.examId?.passageId?.title || `Id- ${result.examId?.passageId?._id?.toString().substring(0,5)}`}</p>
            </div>
            <div className="space-y-4">
              <p><span className="font-bold">Total Key Strokes Given:</span> {totalKeystrokesGiven}</p>
              <p><span className="font-bold">Time Duration:</span> {timeDurationMins.toString().padStart(2, '0')}:00 min.</p>
            </div>
            <div className="space-y-4">
              <p><span className="font-bold">Typing Date:</span> {result.createdAt ? format(new Date(result.createdAt), "dd/MM/yyyy") : "N/A"}</p>
              <p><span className="font-bold">Time Taken:</span> {formatTime(result.timeTaken || 0)}</p>
            </div>
          </div>

          {/* Toggle Formula */}
          <div className="flex items-center gap-3 mb-6 print:hidden">
            <span className="font-bold text-sm text-slate-800">Key Stroke Based Error Formula</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={errorFormulaOn} onChange={() => setErrorFormulaOn(!errorFormulaOn)} />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e63946]"></div>
            </label>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="border border-slate-300 rounded-md p-4 flex flex-col justify-between h-24">
              <p className="text-xs font-bold text-slate-700">Total Keystrokes / Words Typed</p>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-black">{keystrokesTyped} / {wordsTyped}</span>
                <Keyboard className="w-5 h-5 text-slate-400" />
              </div>
            </div>
            <div className="border border-slate-300 rounded-md p-4 flex flex-col justify-between h-24">
              <p className="text-xs font-bold text-slate-700">Full Mistake (Words)</p>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-black">{fullMistakes}</span>
                <XCircle className="w-5 h-5 text-slate-400" />
              </div>
            </div>
            <div className="border border-slate-300 rounded-md p-4 flex flex-col justify-between h-24">
              <p className="text-xs font-bold text-slate-700">Half Mistake (Words)</p>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-black">{halfMistakes}</span>
                <Scissors className="w-5 h-5 text-slate-400" />
              </div>
            </div>
            <div className="border border-slate-300 rounded-md p-4 flex flex-col justify-between h-24">
              <p className="text-xs font-bold text-slate-700">Total Wrong Words</p>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-black">{totalWrongWords}</span>
                <XCircle className="w-5 h-5 text-slate-400" />
              </div>
            </div>
            <div className="border border-slate-300 rounded-md p-4 flex flex-col justify-between h-24">
              <p className="text-xs font-bold text-slate-700">Net Wrong Words</p>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-black">{netWrongWords.toFixed(2)}</span>
                <Scissors className="w-5 h-5 text-slate-400" />
              </div>
            </div>
            <div className="border border-slate-300 rounded-md p-4 flex flex-col justify-between h-24">
              <p className="text-xs font-bold text-slate-700">Net Typing Speed (wpm)</p>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-black">{netWpm}</span>
                <Timer className="w-5 h-5 text-slate-400" />
              </div>
            </div>
            <div className="border border-slate-300 rounded-md p-4 flex flex-col justify-between h-24">
              <p className="text-xs font-bold text-slate-700">Backspace Count</p>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-black">{result.backspaces || 0}</span>
                <XCircle className="w-5 h-5 text-slate-400" />
              </div>
            </div>
            <div className="border border-slate-300 rounded-md p-4 flex flex-col justify-between h-24">
              <p className="text-xs font-bold text-slate-700">Result</p>
              <div className="flex justify-between items-end">
                <span className={`text-xl font-black ${isQualified ? "text-emerald-600" : "text-slate-800"}`}>
                  {isQualified ? "Qualified" : "Not Qualified"}
                </span>
                <Target className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Alert Box */}
          <div className="bg-[#f0f4f8] border border-[#d6e4f0] rounded p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
            <p className="text-sm font-medium text-[#2d4a66]">
              {keystrokesTyped < minKeystrokes 
                ? `Key Strokes typed is less than minimum ${minKeystrokes} key strokes. Calculation of Net Correct Words = ${wordsTyped} - (( ${fullMistakes} ) + ( ${halfMistakes} ) * 0.5 )`
                : `Calculation of Net Correct Words = ${wordsTyped} - (( ${fullMistakes} ) + ( ${halfMistakes} ) * 0.5 )`
              }
            </p>
          </div>

          {/* Detailed Comparison Toggle */}
          <div className="flex items-center gap-3 mb-6 print:hidden">
            <span className="font-bold text-sm text-slate-800">Detailed Comparision</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={detailedComparison} onChange={() => setDetailedComparison(!detailedComparison)} />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007bff]"></div>
            </label>
          </div>

          {/* Split View */}
          {detailedComparison && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-slate-200">
              {/* Original */}
              <div className="border-b md:border-b-0 md:border-r border-slate-200">
                <div className="bg-slate-50 py-2 px-4 border-b border-slate-200">
                  <p className="text-xs font-bold text-slate-600">Original Passage</p>
                </div>
                <div className="p-4 bg-[#ffebee] min-h-[300px]">
                  <p 
                    className="text-sm leading-loose text-slate-800"
                    style={{ fontFamily: getFontFamily() }}
                  >
                    {originalWords.map((word: string, i: number) => (
                      <span key={i}>{word} </span>
                    ))}
                  </p>
                </div>
              </div>

              {/* Typed */}
              <div>
                <div className="bg-slate-50 py-2 px-4 border-b border-slate-200">
                  <p className="text-xs font-bold text-slate-600">Typed Passage</p>
                </div>
                <div className="p-4 bg-white min-h-[300px]">
                  <p 
                    className="text-sm leading-loose text-slate-800"
                    style={{ fontFamily: getFontFamily() }}
                  >
                    {submittedWords.map((word: string, i: number) => {
                      const isCorrect = word === originalWords[i];
                      return (
                        <span 
                          key={i} 
                          className={isCorrect ? "" : "text-red-600 font-bold decoration-red-500 underline decoration-wavy"}
                        >
                          {word}{' '}
                        </span>
                      );
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
