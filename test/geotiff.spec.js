var chai = require("chai");
var expect = chai.expect;

var Promise = require('es6-promise').Promise;

var _ = require("underscore");

import GeoTIFF from "../src/main.js"

var retrieve = function(filename, done, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/base/test/data/' + filename, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    console.log("onload");
    callback(GeoTIFF.parse(this.response));
  };
  xhr.onerror = function(e) {
    console.error(e);
    done(error);
  };
  callback;
  xhr.send();
  console.log("sent");
};

var retrieveSync = function(filename, done, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/base/test/data/' + filename, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    callback(GeoTIFF.parse(this.response));
  };
  xhr.onerror = function(e) {
    console.error(e);
    done(error);
  };
  callback;
  xhr.send();
};

describe("mainTests", function() {
  it("geotiff.js module available", function() {
    expect(GeoTIFF).to.be.ok;
  });

  it("should work on stripped tiffs", function(done) {
    retrieve("stripped.tiff", done, function(tiff) {
      expect(tiff).to.be.ok;
      var image = tiff.getImage();
      expect(image).to.be.ok;
      expect(image.getWidth()).to.equal(539);
      expect(image.getHeight()).to.equal(448);
      expect(image.getSamplesPerPixel()).to.equal(15);

      try {
        var allData = image.readRasters({window: [200, 200, 210, 210]});
        expect(allData).to.have.length(15);
        expect(allData[0]).to.be.an.instanceof(Uint16Array);
        var data = image.readRasters({window: [200, 200, 210, 210], samples: [5]});
        expect(data[0]).to.deep.equal(allData[5]);
        done();
      }
      catch (error) {
        done(error);
      }
    });
  });

  it("should work on tiled tiffs", function(done) {
    retrieve("tiled.tiff", done, function(tiff) {
      expect(tiff).to.be.ok;
      var image = tiff.getImage();
      expect(image).to.be.ok;
      expect(image.getWidth()).to.equal(539);
      expect(image.getHeight()).to.equal(448);
      expect(image.getSamplesPerPixel()).to.equal(15);

      try {
        var allData = image.readRasters({window: [200, 200, 210, 210]});
        expect(allData).to.have.length(15);
        expect(allData[0]).to.be.an.instanceof(Uint16Array);
        var data = image.readRasters({window: [200, 200, 210, 210], samples: [5]});
        expect(data[0]).to.deep.equal(allData[5]);
        done();
      }
      catch (error) {
        done(error);
      }
    });
  });

  it("should work on band interleaved tiffs", function(done) {
    retrieve("interleave.tiff", done, function(tiff) {
      expect(tiff).to.be.ok;
      var image = tiff.getImage();
      expect(image).to.be.ok;
      expect(image.getWidth()).to.equal(539);
      expect(image.getHeight()).to.equal(448);
      expect(image.getSamplesPerPixel()).to.equal(15);

      try {
        var allData = image.readRasters({window: [200, 200, 210, 210]});
        expect(allData).to.have.length(15);
        expect(allData[0]).to.be.an.instanceof(Uint16Array);
        var data = image.readRasters({window: [200, 200, 210, 210], samples: [5]});
        expect(data[0]).to.deep.equal(allData[5]);
        done();
      }
      catch (error) {
        done(error);
      }
    });
  });

  it("should work on band interleaved and tiled tiffs", function(done) {
    retrieve("interleave.tiff", done, function(tiff) {
      expect(tiff).to.be.ok;
      var image = tiff.getImage();
      expect(image).to.be.ok;
      expect(image.getWidth()).to.equal(539);
      expect(image.getHeight()).to.equal(448);
      expect(image.getSamplesPerPixel()).to.equal(15);

      try {
        var allData = image.readRasters({window: [200, 200, 210, 210]});
        expect(allData).to.have.length(15);
        expect(allData[0]).to.be.an.instanceof(Uint16Array);
        var data = image.readRasters({window: [200, 200, 210, 210], samples: [5]});
        expect(data[0]).to.deep.equal(allData[5]);
        done();
      }
      catch (error) {
        done(error);
      }
    });
  });

  it("should work on LZW compressed images", function(done) {
    retrieve("lzw.tiff", done, function(tiff) {
      expect(tiff).to.be.ok;
      var image = tiff.getImage();
      expect(image).to.be.ok;
      expect(image.getWidth()).to.equal(539);
      expect(image.getHeight()).to.equal(448);
      expect(image.getSamplesPerPixel()).to.equal(15);

      try {
        var allData = image.readRasters({window: [200, 200, 210, 210]});
        expect(allData).to.have.length(15);
        expect(allData[0]).to.be.an.instanceof(Uint16Array);
        var data = image.readRasters({window: [200, 200, 210, 210], samples: [5]});
        expect(data[0]).to.deep.equal(allData[5]);
        done();
      }
      catch (error) {
        done(error);
      }
    });
  });

  it("should work on band interleaved, lzw compressed, and tiled tiffs", function(done) {
    retrieve("tiledplanarlzw.tiff", done, function(tiff) {
      expect(tiff).to.be.ok;
      var image = tiff.getImage();
      expect(image).to.be.ok;
      expect(image.getWidth()).to.equal(539);
      expect(image.getHeight()).to.equal(448);
      expect(image.getSamplesPerPixel()).to.equal(15);

      try {
        var allData = image.readRasters({window: [200, 200, 210, 210]});
        expect(allData).to.have.length(15);
        expect(allData[0]).to.be.an.instanceof(Uint16Array);
        var data = image.readRasters({window: [200, 200, 210, 210], samples: [5]});
        expect(data[0]).to.deep.equal(allData[5]);
        done();
      }
      catch (error) {
        done(error);
      }
    });
  });

  it("should work on Int32 tiffs", function(done) {
    retrieve("int32.tiff", done, function(tiff) {
      expect(tiff).to.be.ok;
      var image = tiff.getImage();
      expect(image).to.be.ok;
      expect(image.getWidth()).to.equal(539);
      expect(image.getHeight()).to.equal(448);
      expect(image.getSamplesPerPixel()).to.equal(15);

      try {
        var allData = image.readRasters({window: [200, 200, 210, 210]});
        expect(allData).to.have.length(15);
        expect(allData[0]).to.be.an.instanceof(Int32Array);
        var data = image.readRasters({window: [200, 200, 210, 210], samples: [5]});
        expect(data[0]).to.deep.equal(allData[5]);
        done();
      }
      catch (error) {
        done(error);
      }
    });
  });

  it("should work on UInt32 tiffs", function(done) {
    retrieve("uint32.tiff", done, function(tiff) {
      expect(tiff).to.be.ok;
      var image = tiff.getImage();
      expect(image).to.be.ok;
      expect(image.getWidth()).to.equal(539);
      expect(image.getHeight()).to.equal(448);
      expect(image.getSamplesPerPixel()).to.equal(15);

      try {
        var allData = image.readRasters({window: [200, 200, 210, 210]});
        expect(allData).to.have.length(15);
        expect(allData[0]).to.be.an.instanceof(Uint32Array);
        var data = image.readRasters({window: [200, 200, 210, 210], samples: [5]});
        expect(data[0]).to.deep.equal(allData[5]);
        done();
      }
      catch (error) {
        done(error);
      }
    });
  });

  it("should work on Float32 tiffs", function(done) {
    retrieve("float32.tiff", done, function(tiff) {
      expect(tiff).to.be.ok;
      var image = tiff.getImage();
      expect(image).to.be.ok;
      expect(image.getWidth()).to.equal(539);
      expect(image.getHeight()).to.equal(448);
      expect(image.getSamplesPerPixel()).to.equal(15);

      try {
        var allData = image.readRasters({window: [200, 200, 210, 210]});
        expect(allData).to.have.length(15);
        expect(allData[0]).to.be.an.instanceof(Float32Array);
        var data = image.readRasters({window: [200, 200, 210, 210], samples: [5]});
        expect(data[0]).to.deep.equal(allData[5]);
        done();
      }
      catch (error) {
        done(error);
      }
    });
  });

  it("should work on Float64 tiffs", function(done) {
    retrieve("float64.tiff", done, function(tiff) {
      expect(tiff).to.be.ok;
      var image = tiff.getImage();
      expect(image).to.be.ok;
      expect(image.getWidth()).to.equal(539);
      expect(image.getHeight()).to.equal(448);
      expect(image.getSamplesPerPixel()).to.equal(15);

      try {
        var allData = image.readRasters({window: [200, 200, 210, 210]});
        expect(allData).to.have.length(15);
        expect(allData[0]).to.be.an.instanceof(Float64Array);
        var data = image.readRasters({window: [200, 200, 210, 210], samples: [5]});
        expect(data[0]).to.deep.equal(allData[5]);
        done();
      }
      catch (error) {
        done(error);
      }
    });
  });

  it("should work on Float64 and lzw compressed tiffs", function(done) {
    retrieve("float64lzw.tiff", done, function(tiff) {
      expect(tiff).to.be.ok;
      var image = tiff.getImage();
      expect(image).to.be.ok;
      expect(image.getWidth()).to.equal(539);
      expect(image.getHeight()).to.equal(448);
      expect(image.getSamplesPerPixel()).to.equal(15);

      try {
        var allData = image.readRasters({window: [200, 200, 210, 210]});
        expect(allData).to.have.length(15);
        expect(allData[0]).to.be.an.instanceof(Float64Array);
        var data = image.readRasters({window: [200, 200, 210, 210], samples: [5]});
        expect(data[0]).to.deep.equal(allData[5]);
        done();
      }
      catch (error) {
        done(error);
      }
    });
  });

  it("should work on packbit compressed tiffs", function(done) {
    retrieve("packbits.tiff", done, function(tiff) {
      expect(tiff).to.be.ok;
      var image = tiff.getImage();
      expect(image).to.be.ok;
      expect(image.getWidth()).to.equal(539);
      expect(image.getHeight()).to.equal(448);
      expect(image.getSamplesPerPixel()).to.equal(15);

      try {
        var allData = image.readRasters({window: [200, 200, 210, 210]});
        expect(allData).to.have.length(15);
        expect(allData[0]).to.be.an.instanceof(Uint16Array);
        var data = image.readRasters({window: [200, 200, 210, 210], samples: [5]});
        expect(data[0]).to.deep.equal(allData[5]);
        done();
      }
      catch (error) {
        done(error);
      }
    });
  });

  it("should work with no options other than a callback", function(done) {
    retrieve("small.tiff", done, function(tiff) {
      expect(tiff).to.be.ok;
      var image = tiff.getImage();
      image.readRasters(function(allData) {
        expect(allData).to.have.length(15);
        expect(allData[0].length).to.equal(53*44);
        done();
      });
    });
  });

  it("should work with callback and error callback", function(done) {
    retrieve("small.tiff", done, function(tiff) {
      expect(tiff).to.be.ok;
      var image = tiff.getImage();
      image.readRasters(function(allData) {
        expect(allData).to.have.length(15);
        expect(allData[0].length).to.equal(53*44);
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  it("should work with options and callback", function(done) {
    retrieve("packbits.tiff", done, function(tiff) {
      expect(tiff).to.be.ok;
      var image = tiff.getImage();
      image.readRasters({window: [200, 200, 210, 210]}, function(allData) {
        expect(allData).to.have.length(15);
        expect(allData[0].length).to.equal(10*10);
        done();
      });
    });
  });

  it("should work with options, callback and error callback", function(done) {
    retrieve("packbits.tiff", done, function(tiff) {
      expect(tiff).to.be.ok;
      var image = tiff.getImage();
      image.readRasters({window: [200, 200, 210, 210]}, function(allData) {
        expect(allData).to.have.length(15);
        expect(allData[0].length).to.equal(10*10);
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  it("should work with interleaved reading", function(done) {
    retrieve("packbits.tiff", done, function(tiff) {
      expect(tiff).to.be.ok;
      var image = tiff.getImage();
      try {
        var raster = image.readRasters({window: [200, 200, 210, 210], samples: [0, 1, 2, 3], interleave: true});
        expect(raster).to.have.length(10 * 10 * 4);
        expect(raster).to.be.an.instanceof(Uint16Array);
        done();
      }
      catch (error) {
        done(error);
      }
    });
  });

  it("should work with BigTIFFs", function(done) {
    retrieve("BigTIFF.tif", done, function(tiff) {
      expect(tiff).to.be.ok;
      var image = tiff.getImage();
      try {
        var raster = image.readRasters({samples: [0, 1, 2], interleave: true});
        // expect(raster).to.have.length(10 * 10 * 3);
        expect(raster).to.be.an.instanceof(Uint8Array);
        done();
      }
      catch (error) {
        done(error);
      }
    });
  });
});

describe("RGB-tests", function() {
  var options = { window: [250, 250, 300, 300], interleave: true };

  var comparisonPromise = new Promise(function(resolve, reject) {
    retrieve("rgb.tiff", reject, function(tiff) {
      try {
        var image = tiff.getImage();
        resolve(image.readRasters(options));
      } catch(error) {
        reject(error);
      }
    });
  });

  it("should work with CMYK files", function(done) {
    retrieve("cmyk.tif", done, function(tiff) {
      comparisonPromise.then(function(comparisonRaster) {
        expect(tiff).to.be.ok;
        var image = tiff.getImage();
        image.readRGB(options, function(rgbRaster) {
          expect(rgbRaster).to.have.lengthOf(comparisonRaster.length);
          var diff = new Float32Array(rgbRaster);
          for (var i = 0; i < rgbRaster.length; ++i) {
            diff[i] = Math.abs(comparisonRaster[i] - rgbRaster[i]);
          }
          expect(Math.max.apply(null, diff)).to.be.at.most(1);
          done();
        }, done);
      }, done);
    });
  });

  it("should work with YCbCr files", function(done) {
    retrieve("ycbcr.tif", done, function(tiff) {
      comparisonPromise.then(function(comparisonRaster) {
        expect(tiff).to.be.ok;
        var image = tiff.getImage();
        image.readRGB(options, function(rgbRaster) {
          expect(rgbRaster).to.have.lengthOf(comparisonRaster.length);
          var diff = new Float32Array(rgbRaster);
          for (var i = 0; i < rgbRaster.length; ++i) {
            diff[i] = Math.abs(comparisonRaster[i] - rgbRaster[i]);
          }
          expect(Math.max.apply(null, diff)).to.be.at.most(3);
          done();
        }, done);
      }, done);
    });
  });

  it("should work with paletted files", function(done) {
    retrieve("rgb_paletted.tiff", done, function(tiff) {
      comparisonPromise.then(function(comparisonRaster) {
        expect(tiff).to.be.ok;
        var image = tiff.getImage();
        image.readRGB(options, function(rgbRaster) {
          expect(rgbRaster).to.have.lengthOf(comparisonRaster.length);
          var diff = new Float32Array(rgbRaster);
          for (var i = 0; i < rgbRaster.length; ++i) {
            diff[i] = Math.abs(comparisonRaster[i] - rgbRaster[i]);
          }
          expect(Math.max.apply(null, diff)).to.be.at.most(15);
          done();
        }, done);
      }, done);
    });
  });
});

function toArray(typedArray) {
    let newArray = [];
    for (let i = 0; i < typedArray.length; i++) {
        newArray.push(typedArray[i]);
    }
    return newArray;
}

describe("UintNTests", function() {
  it("should work on UInt2 tiffs", function(done) {
    console.log("retrieving");

    /* Load the 2-Bit Unsigned Integer Raster */
    retrieve("uint2.tiff", done, function(newTiff) {

      /*
        Load the RGB 8-Bit Raster that the 2-Bit Raster was
        created from with gdal_translate's scaling capability
      */
      retrieve("rgb_paletted.tiff", null, function(oldTiff) {

        expect(newTiff).to.be.ok;
        expect(oldTiff).to.be.ok;

        var newImage = newTiff.getImage();
        var oldImage = oldTiff.getImage();
        expect(newImage).to.be.ok;
        expect(oldImage).to.be.ok;

        let actualWidth = newImage.getWidth();
        let actualHeight = newImage.getHeight();
        expect(actualWidth).to.equal(oldImage.getWidth());
        expect(actualHeight).to.equal(oldImage.getHeight());
        expect(newImage.fileDirectory.BitsPerSample[0]).to.equal(2);

        var allData = newImage.readRasters();
        expect(allData).to.have.length(1); // one band

        var actualValues = allData[0];

        /* The number of cells should match
           the number of rows times the number
           of columns in the raster
        */
        expect(actualValues).to.have.length(actualWidth * actualHeight);

        expect(actualValues).to.be.an.instanceof(Uint8Array);

        let actualValuesAsArray = toArray(actualValues);
        let expectedValuesAsArray = toArray(oldImage.readRasters()[0]).map(function(value) {
            return Math.round(value / 255 * 3);
        });

        let actualCounts = _.countBy(actualValuesAsArray);
        let expectedCounts = _.countBy(expectedValuesAsArray);

        console.log("actualCounts:", actualCounts);
        console.log("expectedCounts:", expectedCounts);

        for (let key in actualCounts) {
            expect( Math.abs(actualCounts[key] - expectedCounts[key]) / expectedCounts[key] ).to.be.below(0.12);
        }

        done();
      });
   });
  });
});
