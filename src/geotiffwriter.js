'use strict';
//!!!!! If strip definition tags are omitted, the image is assumed to contain a single strip.
var globals = require("./globals.js");

import { assign, forEach, invert, times } from "lodash"; 

var code2typeName = globals.fieldTagTypes;
var tagName2Code = invert(globals.fieldTagNames);
var geoKeyName2Code = invert(globals.geoKeyNames);

var name2code = {};
assign(name2code, tagName2Code);
assign(name2code, geoKeyName2Code);

var typeName2byte = invert(globals.fieldTypeNames);

//config variables
var num_bytes_in_ifd = 2000;


var _binBE = {
	writeUshort: function(buff, p, n) {
	    buff[p] = (n>> 8)&255;
	    buff[p+1] = n&255;
	},
	writeUint: function(buff, p, n) {
	    buff[p] = (n>>24)&255;
	    buff[p+1] = (n>>16)&255;
	    buff[p+2] = (n>>8)&255;
	    buff[p+3] = (n>>0)&255;
	},
	writeASCII: function(buff, p, s) {
		times(s.length, function(i){ buff[p+i] = s.charCodeAt(i); });
    },
	ui8: new Uint8Array(8)
};
var ui8buffer = _binBE.ui8.buffer;
_binBE.i16 = new Int16Array(ui8buffer);
_binBE.i32 = new Int32Array(ui8buffer);
_binBE.ui32 = new Uint32Array(ui8buffer);
_binBE.fl32 = new Float32Array(ui8buffer);
_binBE.fl64 = new Float64Array(ui8buffer);

var _writeIFD = function(bin, data, offset, ifd) {
    
	var keys = Object.keys(ifd);
	//console.log("keys:", keys);
	
	bin.writeUshort(data, offset, keys.length);
	offset += 2;

	var eoff = offset + 12 * keys.length + 4;

    keys.forEach(function(key) {
		var tag = typeof key === "number" ? key : typeof key === "string" ? parseInt(key) : null;
		
		var typeName = code2typeName[tag];
		//console.log("typeName:", typeName);
		var typeNum = typeName2byte[typeName];
		//console.log("typeNum:", typeNum);
		
		if (typeName == null || typeName === undefined || typeof typeName === "undefined") {
		    throw "unknown type of tag: " + tag;
		}
		
		var val = ifd[key];
		
		if (typeName === "ASCII") {
		    val = val[0] + "\u0000";
		}
		
		var num = val.length;
		
		bin.writeUshort(data, offset, tag );
		offset+=2;
		
		bin.writeUshort(data, offset, typeNum);
		offset+=2;
		
		bin.writeUint(data, offset, num );
		offset+=4;

		var dlen = [-1, 1, 1, 2, 4, 8][typeNum] * num;
		var toff = offset;
		
		if(dlen > 4) {
		    bin.writeUint(data, offset, eoff);
		    toff=eoff;
		}

		if(typeName === "ASCII") {
		    bin.writeASCII(data, toff, val);
		} else if(typeName === "SHORT") {
		    times(num, function(i){
		        bin.writeUshort(data, toff+2*i, val[i]);
		    });
		} else if(typeName === "LONG") {
		    times(num, function(i){
		        bin.writeUint(data, toff + 4 * i, val[i]);
            });
		} else if(typeName === "RATIONAL") {
		    times(num, function(i){
		        bin.writeUint(data, toff + 8 * i, Math.round(val[i]*10000));
		        bin.writeUint(data, toff + 8 * i + 4, 10000);
		    });
        }
		

		if(dlen>4) {  dlen += (dlen&1);  eoff += dlen;  }
		
		offset += 4;     
		
    });
    
	return [offset, eoff];
};

var encode_ifds = function(ifds) {
    
    var data = new Uint8Array(num_bytes_in_ifd);
    var offset = 4;
    var bin = _binBE;
    data[0]=77;
    data[1]=77;
    data[3]=42;

	var ifdo = 8;
	
	bin.writeUint(data, offset, ifdo);
	
	offset += 4;
	//console.log("ifds.length:", ifds.length);
	
	ifds.forEach(function(ifd, i) {
		var noffs = _writeIFD(bin, data, ifdo, ifd);
		ifdo = noffs[1];
		console.log("ifds:", ifds);
		if(i < ifds.length - 1) {
		    bin.writeUint(data, noffs[0], ifdo);
		}
	});
	
	if (data.slice) {
	    return data.slice(0, ifdo).buffer;
	} else {
	    // node hasn't implemented slice on Uint8Array yet 
	    var result = new Uint8Array(ifdo);
	    for (var i = 0; i < ifdo; i++) {
	        result[i] = data[i];
	    }
	    return result.buffer;
	}
};

var encodeImage = function(values, width, height, metadata) {
    
	var ifd = {
	    256: [ width ],
	    257: [ height ],
	    258: [ 8, 8, 8, 8 ],
	    259: [ 1 ],
	    262: [ 2 ],
	    273: [ num_bytes_in_ifd ], // strips offset
	    277: [ 4 ],
	    278: [ height ], /* rows per strip */
	    279: [ width * height * 4 ], // strip byte counts
	    284: [ 1 ],
	    286: [ 0 ],
	    287: [ 0 ],
	    305: [ "geotiff.js" ],
	    338: [ 1 ]
	};
	
	if (metadata) {
		for (var i in metadata) {
			ifd[i] = metadata[i];
		}
	}
	
	var prfx = new Uint8Array(encode_ifds([ifd]));
	//console.log("prfx:", prfx);
	
	var img = new Uint8Array(values);
	
	var data = new Uint8Array(num_bytes_in_ifd + width * height * 4);
	times(prfx.length, function(i){ data[i] = prfx[i]; });
    times(img.length, function(i){ data[num_bytes_in_ifd + i] = img[i]; });
	return data.buffer;
};





var convert_to_tids = function(input) {

    var result = {};
    for (var key in input) {
        if (key !== "StripOffsets") {
            if (!name2code[key]) {
                console.error(key, "not in name2code:", Object.keys(name2code));
            }
            result[name2code[key]] = input[key];
        }
    }
    return result;
};



var toArray = function(input) {
  if (Array.isArray(input)) {
      return input;
  } else {
      return [input];
  }
};

var write_geotiff = function(data, metadata) {
    //console.log("starting write_geotiff with:", typeof data);

    var number_of_bands = data.length;

    var height = data[0].length;
    var width = data[0][0].length;

    var flattened = [];
    times(height, function(row_index) {
       times(width, function(column_index) {
           times(number_of_bands, function(band_index) {
                flattened.push(data[band_index][row_index][column_index]);
           });
       });
    });
    //console.log("flattened:", JSON.stringify(flattened));


    //consult https://www.loc.gov/preservation/digital/formats/content/tiff_tags.shtml

    if (!metadata.BitsPerSample) {
        metadata.BitsPerSample = times(number_of_bands, function(i) { return 8; });
    }
    console.log("bitsPerSample:", metadata.BitsPerSample);

    console.log("metadata.Compression:", metadata.Compression);
    if (!metadata.Compression) {
        metadata.Compression = [1]; //no compression
    }
    
    // The color space of the image data.
    // 1=black is zero and 2=RGB. 
    if (!metadata.PhotometricInterpretation) {
        metadata.PhotometricInterpretation = metadata.bitsPerSample.length === 3 ? 2 : 1;
    }
    // For each strip, the byte offset of that strip.
    //if (!metadata.StripOffsets) metadata.StripOffsets = [2000];  // assumes there's only 1 strip
    //metadata.StripOffsets = toArray(metadata.StripOffsets);
    
    //The number of components per pixel.
    if (!metadata.SamplesPerPixel) {
        metadata.SamplesPerPixel = [number_of_bands];
    }
    //if (!metadata.RowsPerStrip) metadata.RowsPerStrip = [height]; // assumes there's only 1 strip
    //metadata.RowsPerStrip = toArray(metadata.RowsPerStrip);
    
    //if (!metadata.StripByteCounts) metadata.StripByteCounts = [height * width * 4]; // assumes 8-bit
    //metadata.StripByteCounts = toArray(metadata.StripByteCounts);
    
    if (!metadata.PlanarConfiguration) {
        metadata.PlanarConfiguration = [1]; //no compression
    }
    if (!metadata.XPosition) {
        metadata.XPosition = [0];
    }
    if (!metadata.YPosition) {
        metadata.YPosition = [0];
    }
    
    // Code 1 for actual pixel count or 2 for pixels per inch.
    if (!metadata.ResolutionUnit) {
        metadata.ResolutionUnit = [1];
    }

    
    // For example, full-color RGB data normally has SamplesPerPixel=3. If SamplesPerPixel is greater than 3, then the ExtraSamples field describes the meaning of the extra samples. If SamplesPerPixel is, say, 5 then ExtraSamples will contain 2 values, one for each extra sample. ExtraSamples is typically used to include non-color information, such as opacity, in an image. The possible values for each item in the field's value are:
    if (!metadata.ExtraSamples) {
        metadata.ExtraSamples = [0];
    }

    //if (!metadata.GTModelTypeGeoKey) metadata.GTModelTypeGeoKey = [0];

    //if (!metadata.GTModelTypeGeoKey) metadata.GTModelTypeGeoKey = [0];
    
    //console.log("stripoffsets:", metadata.StripOffsets, metadata.StripOffsets[0]);

    [
        "Compression",
        "ExtraSamples",
        "GeographicTypeGeoKey",
        "GTModelTypeGeoKey",
        "GTRasterTypeGeoKey",
        "PhotometricInterpretation",
        "PlanarConfiguration",
        "ResolutionUnit",
        "SamplesPerPixel",
        "XPosition",
        "YPosition"
    ].forEach(function(name) {
        if (metadata[name]) {
            metadata[name] = toArray(metadata[name]);
        }
    });
    
    
    var encoded_metadata = convert_to_tids(metadata);
    console.log("encoded_metadata:", typeof encoded_metadata);
    
    var output_image = encodeImage(flattened, width, height, encoded_metadata);
    console.log("output_image:", output_image);
    
    return output_image;
};

module.exports = { write_geotiff: write_geotiff };