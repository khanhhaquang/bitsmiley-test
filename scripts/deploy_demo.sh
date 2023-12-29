rm -rf dist &&
npm run build &&
cd dist &&
git init &&
git add . &&
git commit -m "deploy" &&
git branch -M main &&
git remote add origin git@github.com:EvaLLLLL/bitsmiley-dev.git &&
git push -f -u origin main &&
rm -rf .git &&
cd -
echo https://bitsmiley-dev.vercel.app/
