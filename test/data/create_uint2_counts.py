from collections import Counter
import rasterio

with rasterio.open("uint2.tiff") as src:
    values = src.read().flatten().tolist()
    counts = Counter(values)
    print(counts)
