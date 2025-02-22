import dotenv from 'dotenv';
dotenv.config();
import { generateJwt } from './utils/authorization';

async function main() {
  const token = generateJwt(2);

  console.log(token);
}

main()
  .then((res) => {
    console.log(res);
  })
  .catch((e) => console.error(e));
