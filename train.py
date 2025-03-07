import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, Input
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau

# Disable TensorFlow OneDNN optimizations for compatibility
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

# Define Image Size & Paths
IMG_SIZE = (128, 128)
BATCH_SIZE = 32
EPOCHS = 20
TRAIN_DIR = "data/processed_xrays"
TEST_DIR = "data/test_xrays"

# Check if directories exist
if not os.path.exists(TRAIN_DIR):
    raise FileNotFoundError(f"Training directory '{TRAIN_DIR}' not found. Please check the path.")
if not os.path.exists(TEST_DIR):
    raise FileNotFoundError(f"Test directory '{TEST_DIR}' not found. Please check the path.")

# Initialize the CNN Model
model = Sequential([
    Input(shape=IMG_SIZE + (3,)),  # RGB input
    Conv2D(32, (3,3), activation='relu'),
    MaxPooling2D(pool_size=(2,2)),

    Conv2D(64, (3,3), activation='relu'),
    MaxPooling2D(pool_size=(2,2)),

    Conv2D(128, (3,3), activation='relu'),
    MaxPooling2D(pool_size=(2,2)),

    Flatten(),
    Dense(256, activation='relu'),
    Dropout(0.5),  # Prevent overfitting
    Dense(4, activation='softmax')  # Adjust the number of classes accordingly
])

# Compile the Model
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Data Augmentation for Training with Validation Split
train_datagen = ImageDataGenerator(
    rescale=1.0 / 255.0,
    rotation_range=30,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest',
    validation_split=0.2  # 20% validation split
)

train_generator = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='training'
)

val_generator = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='validation'
)

# Implement EarlyStopping & ReduceLROnPlateau
early_stopping = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)
lr_reduction = ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=3, min_lr=1e-6)

# Train the Model
model.fit(
    train_generator,
    validation_data=val_generator,
    epochs=EPOCHS,
    callbacks=[early_stopping, lr_reduction]
)

# Save the Model
model.save("dental_model.h5")
print("✅ Model training complete. Model saved as 'dental_model.h5'.")
