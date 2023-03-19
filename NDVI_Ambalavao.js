var  s2022 = ee.ImageCollection('COPERNICUS/S2')
          .filterDate('2022-01-01','2022-03-31')
          .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10));
Map.addLayer(table2);
// Masquage de  Nuage en utilisant le bandes de cirrus
function cloudMask(im) {
        var mask = ee.Image(0).where(im.select('QA60').gte(1024), 1).not();
        return im.updateMask(mask);
}
// supprimer les nuages ??pour toutes les images 
    var images1 = s2022.map(cloudMask);
  
    //impression (images1, "sans nuage")
    var images = ee.ImageCollection(images1.median());
    var ii=images.mosaic()

    var vc=function(image){
            return ee.ImageCollection(image.clip(table2))
    }
    var ss=vc(ii)
    print (ii)
     // Sélectionnez les bandes rouge, verte et bleue.
    var result =ss.select('B8', 'B4', 'B3', 'B2');
    //MOSAÏQUE
    var ms2=result.mosaic()
    print (ms2,"mosiac");
    
var s2a_median = s2022.median().clip(table2);
var ndvi_2022 = s2a_median.normalizedDifference(['B8', 'B4']).rename('NDVI');
var palette = ['FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718',
               '74A901', '66A000', '529400', '3E8601', '207401', '056201',
               '004C00', '023B01', '012E01', '011D01', '011301'];
Map.addLayer(ndvi_2022, {min: 0, max: 1, palette: palette}, 'NDVI Ambalavao  2022')
Map.centerObject(table2);

// NDVI par année
var s2021 = ee.ImageCollection('COPERNICUS/S2')
          .filterDate('2021-01-01','2021-03-31')
          .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10));
var images2 =s2021.map(cloudMask);
var s2021_median =s2021.median().clip(table2);

var ndvi_2021 =s2021_median.normalizedDifference(['B8', 'B4']).rename('NDVI_2021');
Map.addLayer(ndvi_2021, {min: 0, max: 1, palette: palette}, 'NDVI Ambalavao  2021');


var area_hector=ee.Number(area.get('NDVI')).divide(1e4);
print(area_hector);

//NDVI_2021
Export.image.toDrive({ 
  image: ndvi_2021,
  description: 'NDVI_S2_AMBALAVAO_2021',
  fileNamePrefix: 'NDVI_S2_',
  folder: 'GEE_NDVI',
  scale: 10, 
  maxPixels: 1e13, 
  region: table2 
});

//NDVI_2022
Export.image.toDrive({ 
  image: ndvi_2022,
  description: 'NDVI_S2_AMBALAVAO_2022',
  fileNamePrefix: 'NDVI_S2_',
  folder: 'GEE_NDVI',
  scale: 10, 
  maxPixels: 1e13, 
  region: table2 
});

////////////////////////////////////////////////////////////////////////////////////////////////
    // //Download image Satellite 
    //  Export.image.toDrive({
    //      image: ms2,
    //      description: 'Ambalavao_Satellite_2020',
    //  region: table2.geometry().bounds(),
    //      scale: 30,
    // });
 // Map.addLayer(ms2, {gain: '0.1, 0.1, 0.1', scale:10},"mosiacS2");
 /*     var train = [Eau,Foret, Riziere, solnu, culture_irrigee, savane, Roche];
    var TrainingSamples = ee.FeatureCollection(train).flatten();
    print(TrainingSamples)
    var training = ms2.sampleRegions({
        collection: TrainingSamples,
        properties: ['class'],
        scale: 10,
    });
     // *'#d6cb6b','#949f8d'/ , savane,Roche var clusterer =ee.Classifier.randomForest().train(training, 'class');
        var clusterer =ee.Classifier.smileRandomForest(50).train(training, 'class');  
             //smileRandomForest(6,1,1,0.3,1232,1)
    // Algorithme de SVM
      // var clusterer = ee.Classifier.libsvm().train(training, 'class');
      // Algorithme CART
     // var clusterer = ee.Classifier.smileCart().train(training,'class');
    //Algorithme de NaiveBayes
    //var clusterer = ee.Classifier.smileNaiveBayes().train(training, 'class');
  
    var c=['#1b1cf7','#1a840a','#9dff10','#bc4848','#fffd0e','#d6cb6b','#ccc8b0']
    //Cluster the input using the trained clusterer.
    var resultun = ms2.classify(clusterer);
    print (resultun)
     // Display the clusters with random colors. (min & max nbre class)
    Map.addLayer(resultun, {min:1,max:7,palette:c}, 'clusters');
    var confMatrix = clusterer.confusionMatrix();
    print(confMatrix);
    
    //var OA = confMatrix.accuracy();
    var CA = confMatrix.consumersAccuracy();
    var Kappa = confMatrix.kappa();
    var Order = confMatrix.order();
    var PA = confMatrix.producersAccuracy();
   
  //print(confMatrix,'Confusion Matrix');
  //print(OA,'Overall Accuracy');
        //la précision globale de la classification
    print(CA,'Consumers Accuracy');
    print(Kappa,'Kappa');
    print(Order,'Order');
        //Précision des producteurs
    print(PA,'Producers Accuracy');

  // Obtenez une matrice de confusion représentant la précision de la resubstitution.
    var trainAccuracy = clusterer.confusionMatrix();
    print('Error matrix: ', trainAccuracy);
    print('Training overall accuracy: ', trainAccuracy.accuracy());
  
  // Exporter la collection de fonctionnalités.
    var exportAccuracy = ee.Feature(null, {matrix: trainAccuracy.array()})
  // Exporter la collection de fonctionnalités.
    Export.table.toDrive({
        collection: ee.FeatureCollection(exportAccuracy),
        description: 'exportAccuracy',
        fileFormat: 'CSV'
     });
  //Download Classified image
    Export.image.toDrive({
        image: resultun,
        description: 'Ambalavao_Classify_2020',
        region: table2.geometry().bounds(),
        scale: 30,
    });

  //Calcul de surface
    var areaChart = ui.Chart.image.byClass({
        image: ee.Image.pixelArea().addBands(resultun),
        classBand: 'classification', 
      region: table2,
        scale: 100,
        reducer: ee.Reducer.sum()
    });
  print(areaChart) 
  */
    