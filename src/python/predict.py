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
scaler = joblib.load(os.path.join(current_dir, 'scaler_compras.pkl'))

# Leer los argumentos pasados al script (JSON string)
# input_data = json.loads(sys.argv[1])

# Datos de entrada
materialID = sys.argv[1]
totalQuantityUsed = float(sys.argv[2])
totalQuantityPurchased = float(sys.argv[3])
lastPurchasedDate = sys.argv[6]
avgDailyUsed = float(sys.argv[4])
usedTrend = sys.argv[7]
avgTimeBetweenPurchases = float(sys.argv[5])
daysSinceLastPurchase = float(sys.argv[8])

# Transformar los datos para el modelo
# Usar el LabelEncoder para materialID y usedTrend
materialID_encoded = label_encoder_material.transform([materialID])[0]
usedTrend_encoded = label_encoder_trend.transform([usedTrend])[0]

# Preparar los datos para el modelo (asegúrate que el orden es el correcto)
purchaseInEvent = 0
usageInEvent = 120
# data = [[
#     materialID_encoded,
#     avgDailyUsed,
#     avgTimeBetweenPurchases,
#     usedTrend_encoded,
#     daysSinceLastPurchase,
#     # totalQuantityPurchased,
#     # totalQuantityUsed,
#     purchaseInEvent,
# usageInEvent,
#     # lastPurchasedDate,  # Asegúrate que el formato sea correcto si es una fecha
# ]]

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
    # totalQuantityPurchased,
    # totalQuantityUsed,
    purchaseInEvent,
    usageInEvent,
]], columns=columns)

# Seleccionar las características numéricas que deben ser escaladas
numeric_features = ['usageInEvent', 'purchaseInEvent', 'avgDailyUsed', 'avgTimeBetweenPurchases', 'daysSinceLastPurchase']

# Aplicar el escalado solo a las características numéricas
new_data_df[numeric_features] = scaler.transform(new_data_df[numeric_features])

# Combinar las características escaladas con las categóricas no escaladas
features = ['materialID_encoded', 'usageInEvent', 'purchaseInEvent', 'avgDailyUsed', 'avgTimeBetweenPurchases', 'daysSinceLastPurchase', 'usedTrend_encoded']
X_new = new_data_df[features]


# # Realizar predicciones con los modelos
# predicted_cantidad = modelo_cantidad.predict(data_scaled)[0]
# predicted_dias_scaled = modelo_dias.predict(data_scaled)[0]

# Hacer las predicciones
predicted_cantidad = modelo_cantidad.predict(X_new)[0]
predicted_dias = modelo_dias.predict(X_new)[0]

# Invertir el escalado para los días
# predicted_dias = scaler.inverse_transform([[0, predicted_dias_scaled]])[0][1]  # Suponiendo que los días son la segunda columna
# predicted_dias = predicted_days

# Calcular la fecha de la siguiente compra
predicted_next_purchase_date = datetime.strptime(lastPurchasedDate, '%Y-%m-%d') + timedelta(days=int(predicted_dias))




# Devolver los resultados como un diccionario
result = {
    "materialID": materialID,
    "predicted_cantidad": predicted_cantidad,
    "predicted_dias": predicted_dias,
    "predicted_fecha": predicted_next_purchase_date.strftime('%Y-%m-%d')  # Ajusta esto si necesitas calcularlo
}
# print(result)

# Convertir el resultado a JSON y escribirlo en stdout (para ser leído por NestJS)
print(json.dumps(result))