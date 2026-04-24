import json
import os

import psycopg2  # noqa: F401 — installed via requirements.txt


def handler(event: dict, context) -> dict:
    """Сохраняет результат шахматного теста и возвращает общую статистику."""
    import psycopg2 as pg

    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    conn = pg.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    if event.get("httpMethod") == "POST":
        body = json.loads(event.get("body") or "{}")
        score = int(body.get("score", 0))
        percent = int(body.get("percent", 0))
        cur.execute(
            "INSERT INTO chess_quiz_results (score, percent) VALUES (%s, %s)",
            (score, percent),
        )
        conn.commit()

    cur.execute("SELECT COUNT(*), ROUND(AVG(percent)) FROM chess_quiz_results")
    row = cur.fetchone()
    total = int(row[0]) if row[0] else 0
    avg_percent = int(row[1]) if row[1] else 0

    cur.close()
    conn.close()

    return {
        "statusCode": 200,
        "headers": cors,
        "body": json.dumps({"total": total, "avgPercent": avg_percent}),
    }
