import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.metrics import classification_report, confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt

# Disable TensorFlow OneDNN optimizations for compatibility
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

# Define paths
MODEL_PATH = "dental_model.h5"
TEST_DIR = "data/test_xrays"

# Image settings (must match training settings)
IMG_SIZE = (128, 128)
BATCH_SIZE = 32

# Load trained model
print("🚀 Loading trained model...")
model = load_model(MODEL_PATH)
print("✅ Model loaded successfully!")

# Preprocess test data
test_datagen = ImageDataGenerator(rescale=1.0 / 255.0)

test_generator = test_datagen.flow_from_directory(
    TEST_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    shuffle=False
)

# Evaluate model
print("🚀 Evaluating model on test data...")
test_loss, test_accuracy = model.evaluate(test_generator, verbose=2)

print(f"✅ Model Evaluation Completed!")
print(f"📊 Test Loss: {test_loss:.4f}")
print(f"🎯 Test Accuracy: {test_accuracy:.4%}")

# Generate Predictions & Confusion Matrix
y_true = test_generator.classes
y_pred = model.predict(test_generator)
y_pred_classes = np.argmax(y_pred, axis=1)

# Classification Report
print("\n📜 Classification Report:\n", classification_report(y_true, y_pred_classes))

# Plot Confusion Matrix
cm = confusion_matrix(y_true, y_pred_classes)
plt.figure(figsize=(6,6))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=test_generator.class_indices, yticklabels=test_generator.class_indices)
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix")
plt.show()
