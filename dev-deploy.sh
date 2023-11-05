#!/bin/bash
git checkout dev && \
(git branch -D dist || true) && \
git checkout -b dist && \
rm .gitignore && \
cd utils && ./mk_bubbles.sh && cd .. && \
npm run build-dev && \
cp dist/budgetkey/index.html dist/budgetkey/404.html && \
cp CNAME dist/budgetkey/ || true && \
git add dist/budgetkey && \
git commit -m dist && \
(git branch -D gh-pages || true) && \
git subtree split --prefix dist/budgetkey -b gh-pages && \
git push -f origin gh-pages:gh-pages && \
git checkout dev && \
git branch -D gh-pages && \
git branch -D dist && \
git checkout . 