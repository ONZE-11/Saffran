"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-2xl text-red-500 mb-4">Erro in data fetchin !</h2>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          try again!
        </button>
      </div>
    </div>
  );
}
