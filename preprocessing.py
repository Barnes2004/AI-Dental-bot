import os
import cv2
import numpy as np
from tqdm import tqdm
from glob import glob

# Define Paths
RAW_FOLDER = "data/train_xrays"  # Folder containing raw images in subfolders
OUTPUT_FOLDER = "data/processed_xrays"  # Folder to save processed images
IMAGE_SIZE = (128, 128)  # Resize images to this size

# Create output directory if not exists
if not os.path.exists(OUTPUT_FOLDER):
    os.makedirs(OUTPUT_FOLDER)

# Loop through all subdirectories in train_xrays
for subfolder in os.listdir(RAW_FOLDER):
    subfolder_path = os.path.join(RAW_FOLDER, subfolder)
    
    if os.path.isdir(subfolder_path):  # Ensure it's a directory
        output_subfolder = os.path.join(OUTPUT_FOLDER, subfolder)
        os.makedirs(output_subfolder, exist_ok=True)  # Create subfolder in processed_xrays
        
        print(f"Processing images from {subfolder}...")
        
        # Process each image in the subfolder
        for img_path in tqdm(glob(os.path.join(subfolder_path, "*.*")), desc=f"Processing {subfolder}"):
            try:
                # Read image
                img = cv2.imread(img_path, cv2.IMREAD_COLOR)  # Read as RGB
                if img is None:
                    print(f"Skipping {img_path}, unable to read image.")
                    continue
                
                # Resize image
                img_resized = cv2.resize(img, IMAGE_SIZE)

                # Normalize pixel values (0 to 1 range)
                img_resized = img_resized / 255.0  

                # Save processed image
                img_name = os.path.basename(img_path)
                save_path = os.path.join(output_subfolder, img_name)
                cv2.imwrite(save_path, (img_resized * 255).astype(np.uint8))  # Convert back to 0-255 range for saving

            except Exception as e:
                print(f"Error processing {img_path}: {e}")

print("✅ Preprocessing Completed! All images are saved in 'data/processed_xrays/'")
