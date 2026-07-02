module.exports = async function (req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { code, targetLang } = req.body;

        if (!code || !targetLang) {
            return res.status(400).json({ error: 'Code and Target Language are required' });
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'Vercel सेटिंग्स में OPENAI_API_KEY नहीं मिला।' });
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${apiKey}` 
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { 
                        role: "system", 
                        content: "You are an expert code converter. Automatically detect the source language and convert the code directly to the requested target language. Return ONLY the executable code, no markdown block ticks (```) or conversations." 
                    },
                    { 
                        role: "user", 
                        content: `Convert this code into ${targetLang}:\n\n${code}` 
                    }
                ]
            })
        });

        const data = await response.json();
        
        if (data.choices && data.choices[0]) {
            return res.status(200).json({ result: data.choices[0].message.content });
        } else {
            return res.status(500).json({ error: 'OpenAI API से गलत जवाब मिला।', details: data });
        }

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
