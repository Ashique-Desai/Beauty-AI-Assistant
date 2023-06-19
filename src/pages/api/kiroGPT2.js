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
                message: "Please enter a valid input",
            }
        });
        return;
    }

    const systemPrompt = "You are a Kiro Beauty expert, do not recommend any non Kiro products (website: https://kirobeauty.com/).";

    const userMessage = {
        role: "user",
        content: "", // Initialize the users's response
    };
    const assistantMessage = {
        role: "assistant",
        content: "", // Initialize the assistant's response
    };

    // founder, started or similar keywords in the input from user
    const founderKeywords = ["founder", "started", "started company", "founder of kiro", "started kiro"];
    const includesAnyFounderKeyword = founderKeywords.some(keyword => input.toLowerCase().includes(keyword));

    // All products general
    const productsKeywords = ["products", "all products", "kiro makes", "kiro brand", "cosmetics"];
    const includesAnyProductsKeyword = productsKeywords.some(keyword => input.toLowerCase().includes(keyword));

    // Eye
    const eyeKeywords = ["eyeshadow", "eye shadow", "eye", "eye liner", "mascara"];
    const includesAnyEyeKeywords = eyeKeywords.some(keyword => input.toLowerCase().includes(keyword));

    // Skin 
    const skinKeywords = ["skincare", "skin", "serum", "wrinkles", "dryness", "fine lines"];
    const includesAnySkinKeywords = skinKeywords.some(keyword => input.toLowerCase().includes(keyword));

    // Customize the assistant's response based on the user's input
    if (includesAnyFounderKeyword) {
        userMessage.content = "Is Kiro an Indian company, who started it?";
        assistantMessage.content = `Kiro is founded by Ms.Vasundhara Patni. Vasundhara Patni is a serial entrepreneur with 
                                    successful ventures in education and hospitality, she is especially passionate about clean, 
                                    safe and accessible beauty for working women. She holds a degree from the from the University of Pennsylvania`;
    } else if (includesAnyProductsKeyword) {
        userMessage.content = "Are Kiro products safe?";
        assistantMessage.content = `Yes, they are free from harmful chemicals such as parabens, sulfates, and phthalates. 
                                    Kiro products are also cruelty-free, which means that they are not tested on animals.
                                    Recommended products for Face: Botanico Timeless Matte Compact, Glow on blush duo, Highlighter Duo Prism Perfect`;
    } else if (includesAnyEyeKeywords) {
        userMessage.content = "What kind of products Kiro makes?";
        assistantMessage.content = `We make products for skin, eyes, face, our products are make from natural ingredients, Our range for eyes: Shadow Me Eyeshadow Palette, HI - Def Soothing Eyeliner Pencil, Waterproof soft- matte Eyeliner pen, 
                                    Kajal All - Day Comfort Kajal Liner, Longwear Brightening Eyeshadow Stick, Botanico Super Shield Mascara`
    } else if (includesAnySkinKeywords) {
        userMessage.content = "What kind of products Kiro makes?";
        assistantMessage.content = `Our SERUM range is here to tackle the most common skincare problems including fine lines, 
        wrinkles, dullness, dryness, uneven skin tone and much more. 
        Face Serum products: 3% Hyaluronic acid, 10% Vitamin C Face Serum,  5% Niacinamide + 2% Alpha Arbutin.`;
    } else {
        userMessage.content = "What is Kiro beauty";
        assistantMessage.content = `Kiro makes clean beauty products, products for your lips like Non-stop Airy Matte Liquid Lip, 
                                    Lush Moist Matte Lipstick, Super Butter Lip Lacquer. We also make products for your skin, face and eyes.
                                    Kiro has a range of accessories like: Vegan Leather Bag, Canvas Pouch, Scrunchies.`
    }

    const message = [
        { role: "system", content: systemPrompt },
        userMessage,
        assistantMessage,
        { role: "user", content: input },
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
