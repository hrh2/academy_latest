// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import axios from "axios";

function Quote() {
    const [quote, setQuote] = useState("");
    const [author, setAuthor] = useState("");
   const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const response = await axios.get("https://quotes15.p.rapidapi.com/quotes/random/", {
                    headers: {
                        "X-RapidAPI-Host": "quotes15.p.rapidapi.com",
                        "X-RapidAPI-Key": "573576d3famshb244a1a1c1c4162p117801jsnbc9bd4d91fc4" // Replace with your RapidAPI key
                    }
                });
                setQuote(response.data.content);
                setAuthor(response.data.originator.name);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching the quote", error);
                setError("Failed to fetch quote.");
                setLoading(false);
            }
        };

        fetchQuote();
    }, []);

    if (loading) {
        return <p className=" bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">Loading...</p>;
    }

    if (error) {
        return <p className=" bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500"></p>;
    }
    return (
        <div className="content-top-quote text-lg  mt-4">
            <blockquote className=" bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                "{quote}"
            </blockquote>
            <cite className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500 px-3">- {author}</cite>
        </div>
    );
}

export default Quote;
