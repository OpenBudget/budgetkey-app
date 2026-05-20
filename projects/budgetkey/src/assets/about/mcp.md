# התחברו בעזרת AI — שרת MCP של מפתח התקציב

מפתח התקציב חושף שרת **MCP** (Model Context Protocol) ציבורי, פתוח וללא צורך באימות, שמאפשר לעוזרי AI כמו Claude, ChatGPT ו-Cursor לחפש ולנתח ישירות את נתוני תקציב המדינה.

## כתובת השרת

```
https://next.obudget.org/mcp
```

תעבורה: `streamable-http` (HTTP עם הזרמה דו-כיוונית). פרוטוקול MCP גרסה `2025-06-18`.

## מה אפשר לעשות עם זה?

באמצעות השרת, עוזר ה-AI שלכם יכול לגשת ישירות למאגרי המידע של מפתח התקציב, ובכלל זה:

- **ספר התקציב** — סעיפי הוצאות והכנסות מתוכננים ובוצעים, משנת 1997 ועד היום.
- **תמיכות תקציביות** — תוכניות תמיכה ותשלומים בפועל.
- **התקשרויות רכש** — חוזים והתקשרויות של הממשלה.
- **מכרזים וקולות קוראים** — מכרזים, פטורים ממכרז, קולות קוראים.
- **ארגונים** — חברות, עמותות, רשויות מקומיות וגופים נוספים.
- **שינויים תקציביים** — בקשות העברה ופירוט תנועות.

## איך להתחבר?

### Claude Desktop / Claude.ai

הוסיפו לרשימת שרתי ה-MCP הרחוקים בהגדרות Claude:

```json
{
  "mcpServers": {
    "budgetkey": {
      "url": "https://next.obudget.org/mcp",
      "transport": "streamable-http"
    }
  }
}
```

### ChatGPT (Developer Mode / Apps SDK)

הוסיפו את `https://next.obudget.org/mcp` כשרת MCP חיצוני בהגדרות. אין צורך באימות.

### Cursor / VS Code

ב-`mcp.json`:

```json
{
  "mcpServers": {
    "budgetkey": {
      "url": "https://next.obudget.org/mcp"
    }
  }
}
```

## גילוי אוטומטי (Discovery)

השרת מפרסם את עצמו בכמה אופנים סטנדרטיים כך שלקוחות חכמים יוכלו לזהות אותו אוטומטית:

- `https://next.obudget.org/.well-known/mcp` — מניפסט לפי SEP-1960
- `https://next.obudget.org/.well-known/mcp/server-card.json` — Server Card לפי SEP-1649
- `https://next.obudget.org/.well-known/mcp-server` — לפי IETF draft-serra-mcp-discovery-uri

## קוד פתוח

הקוד של מפתח התקציב ושל השרת זמין בגיטהאב:

- [github.com/OpenBudget/BudgetKey](https://github.com/OpenBudget/BudgetKey)

תקלות, בקשות והצעות? [פתחו issue](https://github.com/OpenBudget/BudgetKey/issues/new).
