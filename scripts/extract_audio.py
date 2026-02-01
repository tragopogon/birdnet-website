import json
import numpy as np
import librosa
import os

def extract_audio_data(file_path, output_json, n_peaks=400, spec_shape=(50, 300)):
    """
    Extracts waveform peaks and a simplified spectrogram from an audio file.
    Requires: librosa, numpy
    """
    print(f"Processing {file_path}...")
    
    # Load audio
    y, sr = librosa.load(file_path, offset=0.5, duration=7.0)
    
    # Calculate peaks (abs max in windows)
    peaks = []
    n_peaks = 400 # Higher resolution for scrolling
    chunk_size = len(y) // n_peaks
    for i in range(n_peaks):
        chunk = y[i*chunk_size : (i+1)*chunk_size]
        if len(chunk) > 0:
            peaks.append(float(np.max(np.abs(chunk))))
        else:
            peaks.append(0.0)

    # Normalize peaks to 0-1 range
    max_peak = max(peaks) if peaks else 1
    if max_peak > 0:
        peaks = [p / max_peak for p in peaks]
    
    # Calculate spectrogram
    S = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=128)
    S_db = librosa.power_to_db(S, ref=np.max)
    
    # Normalize to 0-1 range
    S_norm = (S_db - S_db.min()) / (S_db.max() - S_db.min())
    
    # Downsample spectrogram to spec_shape
    from scipy.ndimage import zoom
    spec_small = zoom(S_norm, (spec_shape[0]/S_norm.shape[0], spec_shape[1]/S_norm.shape[1]))
    spec_list = spec_small.tolist()
    
    data = {
        "peaks": [round(p, 3) for p in peaks],
        "spectrogram": [[round(v, 2) for v in row] for row in spec_list]
    }
    
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    
    print(f"Data saved to {output_json}")

if __name__ == "__main__":
    # Use the actual Blue Jay file
    input_file = "public/audio/XC1059662_Blue_Jay.mp3"
    output_file = "src/_data/bluejay.json"
    
    if os.path.exists(input_file):
        extract_audio_data(input_file, output_file)
    else:
        print(f"Error: {input_file} not found.")
