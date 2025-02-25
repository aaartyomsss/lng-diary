import dotenv from 'dotenv';
dotenv.config();
import { LlmServcice } from './services/llmService';

async function main() {
  const llm = new LlmServcice();
  const res = await llm.makeTranslationRequest('Text');
  res.choices.forEach((c) => {
    console.log(c.message);
  });
  console.log(res.choices);
}

main()
  .then((_) => {
    console.log('Done');
  })
  .catch((e) => console.error(e));
