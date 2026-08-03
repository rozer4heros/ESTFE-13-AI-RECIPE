import { useState } from "react";
import "./App.css";

import RecentRecipes from "./components/RecentRecipes";

function App() {
  const [title, setTitle] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    try {
      setLoading(true);
      setResult(null);

      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/recipe`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "content-Type": "applications/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) {
        const text = await res.text();
        try {
          const err = JSON.parse(text);
          if (
            err.status === 429 ||
            (err.error === "openai_recipe_failed" && String(err.detail).includes("insufficient_quota"))
          ) {
            alert("OpenAI 크레딧이 부족합니다. Billing에서 크레딧을 충전한 뒤 다시 시도해주세요.");
          } else {
            alert(`HTTP ${res.status}: ${text}`);
          }
        } catch {
          alert(`HTTP ${res.status}: ${text}`);
        }
      }
      const r = await res.json();
      setResult(r);
    } catch (e) {
      console.error(e);
      alert(e.message ?? "요청 실패");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1>My Recipe App</h1>
      <input
        type="text"
        value={title}
        onChange={e => {
          setTitle(e.target.value);
        }}
        placeholder="요리명을 입력하세요"
      />
      <button disabled={loading || !title.trim()} onClick={handleGenerate}>
        레시피 {loading ? "생성중..." : "생성하기"}
      </button>
      <hr />
      {result && (
        <div>
          <h2>{result.title}</h2>
          <div>{result.recipe}</div>
          {result.image_url && <img src={result.image_url} alt={result.title} />}
        </div>
      )}
      <hr />
      <section className="list-section">
        <RecentRecipes />
      </section>
    </>
  );
}

export default App;
