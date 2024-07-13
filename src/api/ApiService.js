import { useState, useEffect } from "react";

export default function useApiRequest(url, method, body, id, reloadCounter) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
 
    const fetchData = async () => {
      setLoading(true);
      try {
        let response;

        if (method === "GET" || method === "DELETE") {
          const urlWithId = method === "GET" ? url : `${url}/${id}`;
          response = await fetch(urlWithId, {
            method,
            headers: {
              'Content-Type': 'application/json',
            
            }
          });
        }

        else if (method === "PUT" || method === "POST") {
          const finalUrl = method === "PUT" ? `${url}/${id}` : url;
          response = await fetch(finalUrl, {
            method,
            headers: {
              'Content-Type': 'application/json',
             
            },
            body: JSON.stringify(body),
          });
        }

        else if (method === "GET1") {
          const urlWithId = `${url}${id}/`;
          response = await fetch(urlWithId, { method: "GET" });
        }

      

        const responseData = await response.json();

        if(responseData){
          setError(false);
        }else{
          setError(true);
        }

        setData(responseData);
        setLoading(false);
      } catch (error) {
        console.log("error")
      }
    };
    fetchData();
  }, [method, id, body, reloadCounter]);



  return { data, loading, error };
}