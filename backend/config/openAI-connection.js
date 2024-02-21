const OpenAiApi = require("openai");

module.exports = {
    sendOpenAI,
    // sendOpenAIConditional
};

console.log("openAI launched!")

const openai = new OpenAiApi({
    apiKey: process.env.OPENAI_API_KEY,
});


async function sendOpenAI(prompt) {
    try {
      console.log("sending request to openAI")
      const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        // model: 'gpt-3.5-turbo',
        model: 'gpt-4',
        // model: 'gpt-4-1106-preview',
      });
      const output = completion.choices[0].message.content
      console.log(completion)
      console.log(output)
      return output;
    } catch (err) {
      console.log(err);
    }
  }

  