import OpenAI from 'openai';

export class LlmServcice {
  #client;

  #BASE_PROMPT = `
    I am going you to send some text. Text is going to be mainly in Finnish. However,
    some words are going to be substituted with English. Your job is to correct the Finnish
    text, substitute the English word with Finnish. Lastly create a JSON out of filler English words 
    in base form for both languages. Return format should be strictly this:
    
    Corrected text: <Corrected_text> | JSON with translations: <JSON>


    Here is the text you should translate: Se on maybe tosi pitkä sentence ja mä en tiedä can I kirtjoitteta it all itse
  `;

  constructor() {
    if (!process.env.EXTERNAL_LLM_API_KEY) {
      throw new Error('External API key for LLM is not set');
    }
    this.#client = new OpenAI({
      apiKey: process.env.EXTERNAL_LLM_API_KEY,
    });
  }

  async makeTranslationRequest(_userInput: string) {
    const chat = await this.#client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: this.#BASE_PROMPT,
        },
      ],
      model: 'gpt-4o-mini',
    });

    if (chat.choices.length !== 1) {
      throw new Error('Malformed LLM response');
    }

    return chat.choices[0].message.content;
  }

  static parseModelResponse(input: string) {
    const matcher = /Corrected text: (.+?) \| JSON with translations: (\{.+\})/;
    const res = input.match(matcher);

    if (!res || !res.length) {
      throw new Error('Malformed Regex match');
    }

    const [_, text, transaltions] = res;
    return { text, transaltions };
  }
}
