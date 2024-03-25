from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np

app = Flask(__name__)

model = load_model('best_model.keras')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    file = request.files
    if file:
        img = image.load_img(file, target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_array_expanded_dims = np.expand_dims(img_array, axis=0)

        prediction = model.predict(img_array_expanded_dims)

        return jsonify({'prediction': str(prediction)}), 200
     
    return jsonify({'error': 'Error processing file'}), 500

if __name__ == '__main__':
    app.run(port=3267, debug=True)