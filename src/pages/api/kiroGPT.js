import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function kiroGPT(req, res) {
    if (!configuration.apiKey) {
        res.status(500).json({
            error: {
                message: "OpenAI API key not configured, please follow instructions in README.md",
            }
        });
        return;
    }

    const input = req.body.animal || '';
    if (input.trim().length === 0) {
        res.status(400).json({
            error: {
                message: "Please enter a valid animal",
            }
        });
        return;
    }

    const message = [
        {
            role: "system",
            content: "You are a Kiro Beauty expert, do not recommend any non Kiro products (website: https://kirobeauty.com/)."
        },
        {
            role: "user",
            content: "Tell me about Kiro SHADOW ME EYESHADOW palette?",
        },
        {
            role: "assistant",
            content: `The Kiro Shadow Me Eyeshadow Palette is a highly pigmented and versatile eyeshadow palette that offers a variety of shades to create different eye looks. The palette includes 9 shades that range from neutral to bold, making it suitable for both everyday wear and special occasions. 
            In addition to the wide range of colors, this eyeshadow palette is also infused with natural ingredients that offer several benefits to the skin. For example, the avocado oil in the formula helps to reduce skin damage, while macadamia oil moisturizes the skin around the eyes. The moringa oil in the palette helps to reduce signs of aging, such as fine lines and wrinkles.
            Overall, if you're looking for an eyeshadow palette that offers high-quality, long-lasting pigments, as well as natural ingredients that take care of your skin, then the Kiro Shadow Me Eyeshadow Palette may be a good choice for you.`,
        },
        { role: "user", content: `${input}` },
    ];

    try {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: message,
            temperature: 0,
        });
        res.status(200).json({ result: response.data.choices[0].message.content });
    } catch (error) {
        // Consider adjusting the error handling logic for your use case
        if (error.response) {
            console.error(error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                    message: 'An error occurred during your request.',
                }
            });
        }
    }
}
