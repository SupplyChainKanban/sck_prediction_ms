import sys
import joblib
import json
import os
import pandas as pd
from datetime import datetime, timedelta

current_dir = os.path.dirname(os.path.abspath(__file__))

# Cargar los modelos y los encoders
label_encoder_material = joblib.load(os.path.join(current_dir, 'label_encoder_material.pkl'))
label_encoder_trend = joblib.load(os.path.join(current_dir, 'label_encoder_trend.pkl'))
modelo_cantidad = joblib.load(os.path.join(current_dir, 'modelo_cantidad_compras.pkl'))
modelo_dias = joblib.load(os.path.join(current_dir, 'modelo_dias_compras.pkl'))
scaler_dias_x = joblib.load(os.path.join(current_dir, 'scaler_dias_compras_x.pkl'))
scaler_dias_y = joblib.load(os.path.join(current_dir, 'scaler_dias_compras_y.pkl'))
scaler_cantidad_x = joblib.load(os.path.join(current_dir, 'scaler_cantidad_compras_x.pkl'))
scaler_cantidad_y = joblib.load(os.path.join(current_dir, 'scaler_cantidad_compras_y.pkl'))

# Datos de entrada
materialID = sys.argv[1]
totalQuantityUsed = float(sys.argv[2])
totalQuantityPurchased = float(sys.argv[3])
lastPurchasedDate = sys.argv[6]
avgDailyUsed = float(sys.argv[4])
usedTrend = sys.argv[7]
avgTimeBetweenPurchases = float(sys.argv[5])
daysSinceLastPurchase = float(sys.argv[8])
purchaseInEvent = float(sys.argv[9])
usageInEvent = float(sys.argv[10])

# Transformar los datos para el modelo
# Usar el LabelEncoder para materialID y usedTrend
materialID_encoded = label_encoder_material.transform([materialID])[0]
usedTrend_encoded = label_encoder_trend.transform([usedTrend])[0]

# Crear un DataFrame con los nombres de las columnas esperadas por el StandardScaler
columns = [
    'materialID_encoded',
    'avgDailyUsed',
    'avgTimeBetweenPurchases',
    'usedTrend_encoded',
    'daysSinceLastPurchase',
    'purchaseInEvent',
    'usageInEvent',
]

# Crear un DataFrame con los datos de entrada
new_data_df = pd.DataFrame([[
    materialID_encoded,
    avgDailyUsed,
    avgTimeBetweenPurchases,
    usedTrend_encoded,
    daysSinceLastPurchase,
    purchaseInEvent,
    usageInEvent,
]], columns=columns)

# Seleccionar las características para la predicción
features_dias = ['materialID_encoded', 'usageInEvent', 'purchaseInEvent', 'avgDailyUsed', 'avgTimeBetweenPurchases', 'daysSinceLastPurchase', 'usedTrend_encoded']
features_cantidad = features_dias  # Usaremos las mismas características para ambos modelos
    
# 2. Escalar los datos para los modelos de días
X_dias = scaler_dias_x.transform(new_data_df[features_dias])

# 3. Predecir los días hasta la próxima compra
y_pred_dias_scaled = modelo_dias.predict(X_dias)
y_pred_dias = scaler_dias_y.inverse_transform(y_pred_dias_scaled.reshape(-1, 1)).flatten()

# Obtener la predicción de días hasta la próxima compra
days_until_next_purchase = y_pred_dias[0]

# 4. Escalar los datos para el modelo de cantidad
X_cantidad = scaler_cantidad_x.transform(new_data_df[features_cantidad])
    
# 5. Predecir la cantidad de la próxima compra
y_pred_cantidad_scaled = modelo_cantidad.predict(X_cantidad)
y_pred_cantidad = scaler_cantidad_y.inverse_transform(y_pred_cantidad_scaled.reshape(-1, 1)).flatten()
    
# Obtener la predicción de cantidad
next_purchase_quantity = y_pred_cantidad[0]

# Calcular la fecha de la siguiente compra
predicted_next_purchase_date = datetime.strptime(lastPurchasedDate, '%Y-%m-%d') + timedelta(days=int(days_until_next_purchase))

# Devolver los resultados como un diccionario
result = {
    "materialID": materialID,
    "predicted_cantidad": next_purchase_quantity,
    "predicted_dias": days_until_next_purchase,
    "predicted_fecha": predicted_next_purchase_date.strftime('%Y-%m-%d')  # Ajusta esto si necesitas calcularlo
}

print(json.dumps(result))