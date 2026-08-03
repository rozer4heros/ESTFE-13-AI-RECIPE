import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

function RecentRecipes({}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");

        const { data, error } = await supabase
          .from("recipes")
          .select()
          .order("created_at", { ascending: false })
          .limit(10);
        if (error) throw error;

        setItems(data);
      } catch (e) {
        setError(e.message ?? "Load_failed");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  console.log(items);

  return (
    <>
      {items.map(item => (
        <article>
          {item.image_url && <img src={item.image_url} alt={item.title} />}
          <div>
            <h3>{item.title}</h3>
            <div>
              {(item.recipe ?? "").replaceAll("#", "").replaceAll("*", "").replaceAll(/\s+/g, " ").slice(0, 345)}
              {(item.recipe ?? "").length > 345 ? "..." : ""}
            </div>
            <time>{new Date(item.created_at).toLocaleString("ko-KR")}</time>
          </div>
        </article>
      ))}
    </>
  );
}

export default RecentRecipes;
