#!/bin/bash
git checkout dev && \
(git branch -D dist || true) && \
git checkout -b dist && \
rm .gitignore && \
cd utils && ./mk_bubbles.sh && cd .. && \
npm run build-dev && \
cp dist/budgetkey/browser/index.html dist/budgetkey/browser/404.html && \
cp CNAME dist/budgetkey/browser/ && \
git add dist/budgetkey/browser/ && \
git commit -m dist && \
(git branch -D gh-pages || true) && \
git subtree split --prefix dist/budgetkey/browser -b gh-pages && \
git push -f origin gh-pages:gh-pages && \
git checkout dev && \
git branch -D gh-pages && \
git branch -D dist && \
git checkout . 