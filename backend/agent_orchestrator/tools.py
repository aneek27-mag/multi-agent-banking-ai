"""Deterministic mock financial tools for the SIH sandbox.

These tools deliberately do not connect to real exchanges, banks, brokers or
depositories. They model the APIs the production system would integrate with.
"""
from langchain_core.tools import tool
from datetime import datetime, timezone
import uuid, re

CUSTOMERS = {
    "demo_user": {
        "name": "Rahul Sharma",
        "balance": 500000.0,
        "kyc_status": "VERIFIED",
        "pan_verified": True,
        "demat_accounts": [],
        "linked_demat": None,
        "lrs_used_usd": 12000.0,
        "lrs_limit_usd": 250000.0,
    }
}

STOCKS = {
    "TCS": {"price": 4100.50, "exchange": "NSE", "isin": "INE467B01029"},
    "RELIANCE": {"price": 2950.00, "exchange": "NSE", "isin": "INE002A01018"},
    "HDFC": {"price": 1650.75, "exchange": "NSE", "isin": "INE040A01034"},
    "INFY": {"price": 1850.20, "exchange": "NSE", "isin": "INE009A01021"},
}
FX = {
    ("USD", "INR"): 87.10,
    ("EUR", "INR"): 101.20,
    ("GBP", "INR"): 116.80,
    ("AED", "INR"): 23.72,
}

def customer(user_id: str):
    return CUSTOMERS.setdefault(user_id, CUSTOMERS["demo_user"].copy())

@tool
def get_stock_price(symbol: str) -> str:
    """Get the current mocked stock price for a supported sandbox symbol."""
    s = symbol.upper()
    q = STOCKS.get(s)
    if not q:
        return f"Unknown supported sandbox symbol: {s}"
    return f"{s} LTP ₹{q['price']:.2f} on {q['exchange']}."


@tool
def check_bank_balance(account_id: str) -> str:
    """Check the customer's available mocked bank balance."""
    return f"Available balance: ₹{customer(account_id)['balance']:,.2f}"


@tool
def get_demat_status(user_id: str) -> str:
    """Check the customer's mocked Demat account and linking status."""
    c = customer(user_id)
    return f"Demat accounts: {len(c['demat_accounts'])}; linked: {c['linked_demat'] or 'none'}"


@tool
def get_fx_rate(from_currency: str, to_currency: str) -> str:
    """Get an indicative mocked foreign-exchange rate for a supported currency pair."""
    pair = (from_currency.upper(), to_currency.upper())
    rate = FX.get(pair)

    if rate is None and pair == ("INR", "USD"):
        rate = 1 / FX[("USD", "INR")]

    if rate is None:
        return "Pair not supported in sandbox."

    return f"Indicative rate: 1 {pair[0]} = {rate:.4f} {pair[1]}"

def open_demat(user_id: str, dp: str = "NEXUS-NSDL") -> dict:
    c = customer(user_id)
    if c["kyc_status"] != "VERIFIED":
        return {"status":"blocked","reason":"KYC must be VERIFIED before Demat opening."}
    if c["demat_accounts"]:
        return {"status":"exists","bo_id": c["demat_accounts"][0]["bo_id"]}
    bo_id = "1208" + "".join(str(uuid.uuid4().int)[-12:])
    acct = {"bo_id": bo_id, "depository": dp, "status":"ACTIVE", "created_at": datetime.now(timezone.utc).isoformat()}
    c["demat_accounts"].append(acct)
    c["linked_demat"] = bo_id
    return {"status":"success", **acct}

def link_demat(user_id: str, bo_id: str) -> dict:
    c = customer(user_id)
    if not re.fullmatch(r"\d{16}", bo_id):
        return {"status":"failed","reason":"BO ID must be a 16-digit sandbox identifier."}
    c["linked_demat"] = bo_id
    return {"status":"success","bo_id":bo_id,"message":"Demat linked to bank profile."}

def buy_stock(user_id: str, symbol: str, qty: int) -> dict:
    c = customer(user_id); s = symbol.upper()
    if not c["linked_demat"]:
        return {"status":"failed","reason":"No linked Demat account."}
    if s not in STOCKS or qty <= 0:
        return {"status":"failed","reason":"Invalid symbol or quantity."}
    gross = STOCKS[s]["price"] * qty
    charges = round(gross * 0.0015, 2)
    total = round(gross + charges, 2)
    if c["balance"] < total:
        return {"status":"failed","reason":"Insufficient funds","required":total,"available":c["balance"]}
    c["balance"] -= total
    return {"status":"success","order_id":"ORD-"+uuid.uuid4().hex[:10].upper(),"symbol":s,"qty":qty,
            "price":STOCKS[s]["price"],"charges":charges,"total":total,"bo_id":c["linked_demat"]}

def forex_trade(user_id: str, base: str, quote: str, side: str, amount: float) -> dict:
    c = customer(user_id); base=base.upper(); quote=quote.upper(); side=side.upper()
    rate = FX.get((base,quote))
    if rate is None and (base,quote)==("INR","USD"): rate=1/FX[("USD","INR")]
    if rate is None: return {"status":"failed","reason":"Unsupported currency pair."}
    if side not in {"BUY","SELL"} or amount <= 0: return {"status":"failed","reason":"Invalid forex order."}
    notional_inr = amount*rate if quote=="INR" else amount/rate
    if side=="BUY" and quote=="INR" and c["balance"] < notional_inr:
        return {"status":"failed","reason":"Insufficient INR balance.","required":round(notional_inr,2)}
    if side=="BUY" and quote=="INR":
        c["balance"] -= notional_inr
    return {"status":"success","trade_id":"FX-"+uuid.uuid4().hex[:10].upper(),
            "pair":f"{base}/{quote}","side":side,"amount":amount,"rate":round(rate,4),
            "notional_inr":round(notional_inr,2),"timestamp":datetime.now(timezone.utc).isoformat()}

wealth_tools=[get_stock_price,check_bank_balance,get_demat_status,get_fx_rate]
