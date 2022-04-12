import { useEffect, useState } from "react";

export default function ThumbDisplay({thumbs}) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [jsonData, setJsonData] = useState([]);

  useEffect(() => {
    setIsRefreshing(false);
  }, [thumbs])


  return (
    <div>Hai!</div>
  );
}