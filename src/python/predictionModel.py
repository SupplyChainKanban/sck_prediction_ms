import sys
from datetime import datetime, timedelta
import json

def predict_next_purchase(total_quantity_used, total_quantity_purchased, avg_daily_used, avg_time_between_purchases, last_purchase_date):
    next_purchase_quantity = avg_daily_used * avg_time_between_purchases
    last_purchase_date_dt = datetime.strptime(last_purchase_date, '%Y-%m-%d')
    next_purchase_date = last_purchase_date_dt + timedelta(days=avg_time_between_purchases)

    return next_purchase_quantity, next_purchase_date.strftime('%Y-%m-%d')

if __name__ == '__main__':
    materialID = sys.argv[1]
    total_quantity_used = float(sys.argv[2])
    total_quantity_purchased = float(sys.argv[3])
    avg_daily_used = float(sys.argv[4])
    avg_time_between_purchases = float(sys.argv[5])
    last_purchase_date = sys.argv[6]

    next_purchase_quantity, next_purchase_date = predict_next_purchase(
        total_quantity_used,
        total_quantity_purchased,
        avg_daily_used,
        avg_time_between_purchases,
        last_purchase_date
    )

    result = {
        "materialID": materialID,
        "nextPurchaseQuantity": next_purchase_quantity,
        "nextPurchaseDate": next_purchase_date
    }

    print(json.dumps(result))
