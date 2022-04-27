export default class BulletPoints {
 changeBulletPoints() {
  const WW90T534DAN = [
   '9Kg',
   '600 x 850 x 550 mm',
   'ecobubble™',
   'Auto Dose',
   'Smart Control +',]
   const WW90T684DLH = [
    '9 Kg',
    '600 x 850 x 550 mm',
    'ecobubble™',
    'AddWash™',
    'Auto Dose']
   const WW12T504DAN = [
   '12 Kg',
   '600 x 850 x 650 mm',
   'ecobubble™',
   'Smart Control +',
   'Hygiene Steam'
   ]
   const WW80TA046AE = [
   '8 Kg',
   '600 x 850 x 550 mm',
   'ecobubble™',
   'Hygiene Steam',
   '15min Quick Wash'
   ]
   const WW90T986DSX = [
   '9 Kg',
   '600 x 850 x 600 mm',
   'ecobubble™',
   'QuickDrive™',
   'Addwash™'
   ]
   const WW80T554DAN = [
   '8 Kg',
   '600 x 850 x 550 mm',
   'ecobubble™',
   'AddWash™',
   'Smart Control +'
   ]
   const WW90T4540AE = [
   '9 Kg',
   '600 x 850 x 550 mm',
   'ecobubble™',
   'Addwash™',
   'Hygiene Steam'
   ]
   const WW70TA046AX = [
   '7 Kg',
   '600 x 850 x 550 mm',
   'ecobubble™',
   'Hygiene Steam',
   '15min QuickWash'
   ]
   const WW90TA046AE = [
   '9 Kg',
   '600 x 850 x 550 mm',
   'ecobubble™',
   'Hygiene Steam',
   '15min QuickWash'
   ]
   const WW90T854DBX = [
   '9 Kg',
   '600 x 850 x 600 mm',
   'ecobubble™',
   'QuickDrive™',
   'AddWash™',
   ]
   const WW80TA046TH = [
   '8 Kg',
   '600 x 850 x 550 mm',
   'ecobubble™',
   'Hygiene Steam',
   '15min Quick Wash',
   ]
   const WW70TA046TE = [
   '7 Kg',
   '600 x 850 x 550 mm',
   'ecobubble™',
   'Hygiene Steam',
   '15min QuickWash',
   ]
   const WW80T534DAN = [
   '8 Kg',
   '600 x 850 x 550 mm',
   'ecobubble™',
   'Auto Dose',
   'Smart Control +',
   ]
   const WW10T504DAN = [
   'From £14.14/month. Calculate Finance',
   '600 x 850 x 550 mm',
   'ecobubble™',
   'Hygiene Steam',
   'Smart Control +',
   ]
  const skuObj = {
   WW90T684DLN: WW90T684DLH,
   WW90T684DLH: WW90T684DLH,

   WW80TA046AE: WW80TA046AE,
   WW80TA046AX: WW80TA046AE,

   WW90T534DAN: WW90T534DAN,
   WW90T534DAW: WW90T534DAN,

   WW10T684DLH: WW90T684DLH,
   WW10T684DLN: WW90T684DLH,

   WW12T504DAN: WW12T504DAN,
   WW12T504DAW: WW12T504DAN,

   WW90TA046AE: WW90TA046AE,

   WW90TA046AX: WW90TA046AE,
   WW90TA046AH: WW90TA046AE,

   WW90T4540AE: WW90T4540AE,
   WW90T4540AX: WW90T4540AE,

   WW80T554DAN: WW80T554DAN,
   WW80T554DAW: WW80T554DAN,

   WW70TA046TE: WW70TA046TE,

   WW80TA046TH: WW80TA046TH,

   WW80T534DAN: WW80T534DAN,
   WW80T534DAW: WW80T534DAN,

   WW90T854DBX: WW90T854DBX,
   WW90T854DBH: WW90T854DBX,

   WW10T504DAN: WW10T504DAN,
   WW10T504DAW: WW10T504DAN,

  }


  const currentPopUpSku = document.querySelector("#myModal > div > div > div.product__info__content > small").textContent.slice(0,11); //this is just for DA products, because it has a slash at the end of the sku
  const bulletPoints = document.querySelectorAll('.usp-text');
  for (const sku in skuObj) {
   if (Object.hasOwnProperty.call(skuObj, sku)) {
    const currentSpecs = skuObj[sku];

    if (currentPopUpSku === sku ) {

     bulletPoints.forEach((bulletPoint, x) => {
      // console.log(bulletPoint);
      currentSpecs.forEach((specs, y) => {
       (x === y) ? bulletPoint.innerText = specs : bulletPoint.innerText;
      });
     });
    }

   }
  }
 }
}
