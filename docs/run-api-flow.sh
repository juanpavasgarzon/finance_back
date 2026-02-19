#!/usr/bin/env bash
set -e
BASE="${BASE_URL:-http://localhost:8000/api}"
EMAIL="${API_EMAIL:-user@example.com}"
PASS="${API_PASSWORD:-password123}"

echo "Base URL: $BASE"
echo ""

echo "=== 1. Register ==="
curl -s -w "\nHTTP %{http_code}\n" -X POST "$BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASS\"}"
echo ""

echo "=== 2. Login ==="
LOGIN_RESP=$(curl -s -X POST "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASS\"}")
echo "$LOGIN_RESP"
TOKEN=$(echo "$LOGIN_RESP" | jq -r '.accessToken')
if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "Error: no accessToken in login response. Is the server running and .env set?"
  exit 1
fi
echo "Token OK (length ${#TOKEN})"
echo ""

echo "=== 3. Create categories ==="
curl -s -w "\nHTTP %{http_code}\n" -X POST "$BASE/categories" \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Supermercado","type":"EXPENSE"}'
curl -s -w "\nHTTP %{http_code}\n" -X POST "$BASE/categories" \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Salario","type":"INCOME"}'
echo ""

echo "=== 4. List categories ==="
EXPENSE_ID=$(curl -s -X GET "$BASE/categories?type=EXPENSE" -H "Authorization: Bearer $TOKEN" | jq -r '.[0].id')
INCOME_ID=$(curl -s -X GET "$BASE/categories?type=INCOME" -H "Authorization: Bearer $TOKEN" | jq -r '.[0].id')
echo "Expense category: $EXPENSE_ID | Income category: $INCOME_ID"
echo ""

echo "=== 5. Create schedule (expense) ==="
curl -s -w "\nHTTP %{http_code}\n" -X POST "$BASE/schedules" \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d "{\"categoryId\":\"$EXPENSE_ID\",\"type\":\"EXPENSE\",\"amount\":150000,\"currencyCode\":\"COP\",\"recurrenceInterval\":1,\"recurrenceUnit\":\"MONTH\",\"nextDueDate\":\"2025-02-01\",\"description\":\"Alquiler\"}"
echo ""

echo "=== 6. Generate schedule occurrences ==="
curl -s -w "\nHTTP %{http_code}\n" -X POST "$BASE/schedules/generate" -H "Authorization: Bearer $TOKEN"
echo ""

echo "=== 7. Create expense ==="
curl -s -w "\nHTTP %{http_code}\n" -X POST "$BASE/expenses" \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d "{\"categoryId\":\"$EXPENSE_ID\",\"amount\":85000,\"currencyCode\":\"COP\",\"description\":\"Mercado\",\"dueDate\":\"2025-02-18\"}"
echo ""

echo "=== 8. Create income ==="
curl -s -w "\nHTTP %{http_code}\n" -X POST "$BASE/incomes" \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d "{\"categoryId\":\"$INCOME_ID\",\"amount\":5000000,\"currencyCode\":\"COP\",\"description\":\"Salario\",\"dueDate\":\"2025-02-28\"}"
echo ""

echo "=== 9. List expenses ==="
curl -s -X GET "$BASE/expenses" -H "Authorization: Bearer $TOKEN" | jq .
echo ""

echo "=== 10. List incomes ==="
curl -s -X GET "$BASE/incomes" -H "Authorization: Bearer $TOKEN" | jq .
echo ""

echo "=== 11. Dashboard ==="
curl -s -X GET "$BASE/reports/dashboard?period=MONTHLY&date=2025-02-18" -H "Authorization: Bearer $TOKEN" | jq .
echo ""

echo "=== 12. Download Excel ==="
curl -s -X GET "$BASE/reports/financial/excel?period=MONTHLY&date=2025-02-18" \
  -H "Authorization: Bearer $TOKEN" -o "estado-financiero-$(date +%Y%m%d-%H%M).xlsx"
echo "Saved: estado-financiero-*.xlsx"
echo ""
echo "Done."
