"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setErrorMsg("");
    setAnalysisResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userRequest: inputText }),
      });
      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }
      const data = await res.json();
      setAnalysisResult(data);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-4">ファンクションポイント 自動算出サンプル</h1>
      <p className="mb-4">要件を自然言語で入力し、「解析」ボタンを押してください。</p>
      <div className="mb-4">
        <Textarea
          className="w-full md:w-2/3 lg:w-1/2"
          placeholder="例: パスワードリセット機能とCSVエクスポート機能が必要"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={5}
        />
      </div>
      <Button onClick={handleAnalyze} disabled={loading}>
        {loading ? "解析中..." : "解析する"}
      </Button>

      {loading && (
        <div className="mt-4">
          <Skeleton className="h-4 w-[250px]" />
          <p className="mt-2">推論中です。お待ちください...</p>
        </div>
      )}

      {errorMsg && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}

      {analysisResult && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>解析結果</CardTitle>
          </CardHeader>
          <CardContent>
            {analysisResult.functions && (
              <ul className="space-y-2">
                {analysisResult.functions.map((fn: any, idx: number) => (
                  <li key={idx} className="border-b pb-2 last:border-b-0">
                    <span className="font-semibold">機能名:</span> {fn.name} /{" "}
                    <span className="font-semibold">FP:</span> {fn.fp}
                    {fn.desc && <div className="text-sm text-gray-600 mt-1">説明: {fn.desc}</div>}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-4 font-bold">
              合計FP: {analysisResult.totalFP}
            </p>
          </CardContent>
        </Card>
      )}
    </main>
  );
}

