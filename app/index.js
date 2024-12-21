import { useState, useEffect } from "react";
import Link from "next/link";
import BlogItem from "../components/BlogItem";

export default function Homepage() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const res = await fetch("/api/posts");
      if (!res.ok) throw new Error("Unable to fetch articles");
      const result = await res.json();
      setArticles(result);
    } catch (err) {
      setFetchError("Unable to retrieve articles at this time");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-10 text-lg">
        Loading articles...
      </div>
    );
  if (fetchError)
    return <div className="text-center text-red-600 p-10">{fetchError}</div>;

  return (
    <div className="max-w-screen-lg mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-semibold">Latest Articles</h1>
        <Link
          href="/create"
          className="bg-indigo-500 px-5 py-2 rounded-md hover:bg-indigo-600 text-white"
        >
          Add New Article
        </Link>
      </div>

      {articles.length === 0 ? (
        <p className="text-center text-gray-600">
          No articles found. Be the first to create one!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {articles.map((article) => (
            <BlogItem
              key={article._id}
              article={article}
              onRefresh={loadArticles}
            />
          ))}
        </div>
      )}
    </div>
  );
}
