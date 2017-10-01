import gdal
from gdal import GDT_Byte
import numpy as np

def chunk(iterable, size_of_chunk):
    result = []
    for i in range(0, len(iterable), size_of_chunk):
        result.append(iterable[i:i + size_of_chunk])
    return result

driver = gdal.GetDriverByName('GTiff')

xsize = 4
ysize = 4
bands = 1
options = ["NBITS=2"]
ds_out = driver.Create("uint2.tif", xsize, ysize, bands, GDT_Byte, options)
print "ds_out:", ds_out

shape = (xsize, ysize)
values = range(1, xsize * ysize + 1) # [0 ... 16]
chunks = chunk(values, 4)
print "chunks:", chunks
array = [chunk for chunk in chunks]
#array = np.array(values)
#print "array:", array
#array.shape = shape
#ds_out.GetRasterBand(1).WriteArray(array)
#ds_out = None # Close.


