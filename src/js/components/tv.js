import axios from 'axios';
import ChangeBtn from './changeBtn';
import BulletPoints from './bulletPoints';


export default class Tv {

 getSku() {
  //create click event that gets the sku
  let sku = ''
  const panelLinks = document.querySelectorAll('.product-card-v2__name-link');

  function tagging(el, attrs) {
    for(let key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  }

  panelLinks.forEach((panelLink) => {

    const modelCode = panelLink.getAttribute('data-modelcode');
    let elementOne = panelLink.parentElement.parentElement.parentElement.parentElement.parentElement;
    let elementTwo = panelLink.parentElement;
    let topElement = (elementOne === null) ? elementTwo : elementOne;
    let panelBtn = document.createElement('a');

    const modal = document.createElement('div');
          modal.classList.add('modal');
          modal.setAttribute('id', 'myModal');

          modal.innerHTML = `
          <div class="modal-content">
            <span class="close"></span>
          </div>
          `
    panelBtn.classList.add('quickview__btn');
    tagging(panelBtn,
      {
        "data-omni-type"  : "microsite",
        "data-omni"       : `uk:29:pf:quickview:laundry:${panelLink.innerText}`,
        "ga-ca"           : "product click",
        "an-ac"           : "pf product card",
        "an-la"           : `quickview click`
      });

    panelBtn.setAttribute('data-modelcode', modelCode);
    panelBtn.setAttribute('href', 'javascript:void(0)');
    panelBtn.innerText = 'Quick View';
    topElement.insertAdjacentElement('beforebegin',modal);
    topElement.prepend(panelBtn);

    panelBtn.onclick = (e) => {
      //get the current target panel
      const panel = e.target.nextElementSibling.lastChild.children[1];
      //get the string rating of the current panel and convert it to a number
      const rating = Number(panel.querySelector('.rating__point').children[1].textContent);

      sku = modelCode;
      this.quickView(sku, rating);

    }



  })
 }


 async quickView(sku, rating) {

  const currentPanelRating = rating;
  let productSku = sku;
  let offers = `https://p1-smn2-api-cdn.shop.samsung.com/tokocommercewebservices/v2/uk/products/${productSku}/offers?fields=FULL`
  let products = `https://p1-smn2-api.shop.samsung.com/tokocommercewebservices/v2/uk/products/${productSku}/**?fields=FULL`

  const reqOne = axios.get(products)
  const reqTwo = axios.get(offers);

  try {
   const res = await axios.all([reqOne, reqTwo]).then(axios.spread((...res) => {
    const tvProducts = res[0];
    const tvOffers = res[1];
    // console.log(tvProducts, tvOffers);
    const name         = tvProducts.data.name;
    const modelCode    = tvProducts.data.code;
    const variants     = tvProducts.data.variantOptions;
    const rating       = (tvProducts.data.productRating === undefined) ? currentPanelRating : tvProducts.data.productRating;
    const features     = tvProducts.data.productFeatureComponents;
    const price        = tvProducts.data.price.value;
    const promoPrice   = (tvProducts.data.promotionPrice) ? tvProducts.data.promotionPrice.value : price;
    const image        = tvProducts.data.picture.url || tvProducts.data.variantOptions[0].galleryImagesV2[0].images[0].value.url
    const exUrl        = tvProducts.data.externalUrl;
    const baseCode     = tvProducts.data.baseProductCode;
    const proRating    = (tvProducts.data.productRating === undefined) ? currentPanelRating : tvProducts.data.productRating;
    const benefits     = tvOffers.data.benefits;

  this.popUp(
    name,
    modelCode,
    variants,
    rating,
    features,
    price,
    promoPrice,
    image,
    benefits,
    exUrl,
    baseCode,
    proRating);

    // this.catch(modelCode)
    // console.log(tvProducts, tvOffers);
    })
    )
    .catch(err => {
      // console.log(err.response)
      const boxFinders = document.querySelectorAll('.js-pf-product-card');
      boxFinders.forEach((boxFinder) => {
        const name = boxFinder.querySelector('.product-card-v2__name-link');
        if (name !== null){
          const sku  = name.getAttribute('data-modelcode');
          const currentSku = (err.response.data.errors[0].message.length <= 45 ) ? err.response.data.errors[0].message.slice(19, 33) : 'RB38A7B6BB1/EU'
          const rating = boxFinder.querySelector('.rating__point').children[1].textContent;
          const features = boxFinder.querySelectorAll('.product-card-v2__feature-item');
          const seeMoreLink = boxFinder.querySelector(".product-card-v2__cta").firstChild;
          const image = boxFinder.querySelector('.image__main');
          const nameText = boxFinder.querySelector('.product-card-v2__name-text');
          // console.log(features);
          if (sku === currentSku){
            this.notAvaliablePopUp(name, currentSku, rating, features, seeMoreLink, image, nameText)
          }
        }
      })
    })
  }
  catch(error) {
   console.log(error)
  }
 }

popUp(name, modelCode, variants, rating, features, price, promoPrice, image, benefits, exUrl, baseCode, proRating) {


  const modal = document.querySelector('.modal');
  const modalContent = document.querySelector('.modal-content');
  const monthlyPrice = promoPrice/36;
  const save =  price - promoPrice;
  const hiResImage = image.replace('$THUB_SHOP_S$', '$PD_SHOP_JPG$');


  const btnSizes = () => {
    const container = document.querySelector('.button__sizes');
    variants.forEach((optionalProducts) => {
      const variantSize = optionalProducts.size;
      const sku = optionalProducts.code;

      const btn = document.createElement('a');
            btn.classList.add('varient__button');
            btn.setAttribute('data-modelcode', sku);
      btn.innerText = variantSize + '"';

      return container.append(btn);
    });
  }

  const offerBlock = () => {
    const container = document.querySelector('.offer__blocks');

    benefits.forEach((offers, i) => {

      if (i <= 1 ) {
        const description = offers.title;
        const div = document.createElement('div');
        div.classList.add('descripton');

        div.innerHTML = description;

        return container.append(div);
      }
    });
  }

  const addToBasket = () => {
    const buyNowBtns = document.querySelectorAll('.js-buy-now');
    const container = document.querySelector('.cta__container');

    buyNowBtns.forEach((buyNowbtn) => {
      const buyNowModelCode = buyNowbtn.getAttribute('data-modelcode');
      const qty = buyNowbtn.getAttribute('data-modelqty');



      if (buyNowModelCode === modelCode) {
        const buyNow = buyNowbtn.outerHTML;
        const div = document.createElement('div');
        div.classList.add('add__to__basket');
        div.innerHTML = buyNow;

        div.onclick = () => {
          $.ajax({
                    type: 'POST',
                    url: 'https://p1-smn2-api-cdn.shop.samsung.com/tokocommercewebservices/v2/uk/addToCart/multi?fields=BASIC',
                    data: JSON.stringify([{
                      productCode: buyNowModelCode,
                      qty: 1,
                      services: []
                    }]),
                    contentType: 'application/json',
                    xhrFields: {
                        withCredentials: true
                    },
                    success: (res) => {
                      // console.log(res)
                      window.location.replace('https://shop.samsung.com/uk/cart')
                    }
                });
        }

      return container.append(div);
      }



    });
  }

  const checkPopup = () => {
    const arr = document.querySelector('.modal-content').children;
    Array.from(arr, (el, i) => {
      if (i >= 1) {
        document.querySelector('.container').remove();
      }
    })
  }

  const featureList = () => {
    let ul = document.createElement('ul');
    ul.classList.add('dot-list');
    ul.setAttribute('role', 'list');

      features.map((feature, i) => {
      let index = i
      let li = document.createElement('li');
      li.classList.add('dot-list__item');
      li.setAttribute('role', 'listitem');
      li.innerHTML =
        `<svg class="icon" focusable="false" viewBox="0 0 96 96">
          <path d="M48 32c8.837 0 16 7.163 16 16s-7.163 16-16 16-16-7.163-16-16 7.163-16 16-16z"></path>
        </svg>
        <span class="usp-text">${feature.title}</span>`;
      if (index > 1 && index < 6) {

        ul.appendChild(li);
      } else if (feature.uid.includes('RB29FWRNDBC/EU') && index > 2) {
        ul.appendChild(li);
      }
    }).join('');

    return ul.innerHTML;
  }

  const stars =  (numOfStars) => {
  const rounded = Math.round(numOfStars);
  let star_nodes = '';
  for (let i = 1; i <= 5; i++) {
    if (rounded >= i ) {
    star_nodes += "<span class='filled-star'></span>"
    } else {
    star_nodes += "<span class='empty-star'></span>";
    }
  }
  return star_nodes;
  }
  //checks to see there was or is another pop in modal, if there is then it removes it
  checkPopup();
  const nonWarrentySkus = ["WW10T504DAN/S1", "WW10T504DAW/S1", "WW12T504DAW/S1", "WW12T504DAN/S1"]
  const warrantyBadge = "https://images.samsung.com/is/image/samsung/p6pim/uk/family/346103/award/uk-awards-washer-ww90t684dlh-501500337";
  const container = document.createElement('div');

        container.classList.add('container');
        container.innerHTML =
  `<div class="image__container">
    <span>
    ${// if the sku is in the nonWarrentySkus array then it will not show the non warrenty image
    nonWarrentySkus.includes(modelCode) ? '' : `<img src="${warrantyBadge}" alt="5 year warranty badge"/>`}
    </span>
      <div class="main__product__image">
        <img src="${hiResImage}" alt="${name}"/>
      </div>
    <div class="icons">
    <div class="delivery">
      <img src="https://images.samsung.com/is/image/samsung/assets/uk/smartphonepcd/icon_delivery.png"/>
        <p>Free delivery</p>
    </div>
      <div class="return">
        <img src="https://images.samsung.com/is/image/samsung/assets/uk/smartphonepcd/Icon_returns.png"/>
      <p>Free 21 days to return</p>
      </div>
      <div class="installation">
        <img src="https://images.samsung.com/is/image/samsung/assets/uk/smartphonepcd/Drill.png"/>
      <p>Installation available</p>
      </div>
    </div>
  </div>
  <div class="product__info__content">
      <p class="promotion-card-v2__sub-headline-text">${name}</p>
      <small>${modelCode}</small>
      <div class="reviews">
          <div class="stars">
              ${stars(rating)}<p><strong>(${proRating})</strong></p>
          </div>
        </div>
      <ul class="dot-list" role="list">
        ${featureList()}
      </ul>
      <div class="product-card-v2__price-full">
        £${promoPrice}.00
        ${(price === promoPrice)? `<del class="prevPrice"></del>` : `<del class="prevPrice">£${price}.00</del>`}
        ${(price === promoPrice)? `<span></span>` : `<span>Save £${save}</span>`}
        <div class="product-card-v2__feature-text pop_up">
          <a class="product-card-v2__feature-cta js-calculate-popup-open" data-type="install" data-modelcode="${modelCode}" href="javascript:;" title="Calculate Finance " link_info="/uk/web/emi-popup/?sku=${modelCode}&amp;price=${promoPrice}&amp;page=pf" an-tr="pd03_product finder:option-product finder-calculator-link" an-ca="option click" an-ac="pf product card" an-la="calculator">or £${monthlyPrice.toFixed(2)}/mo at 0% APR<sup>*</sup></a>
        </div>
      </div>
      <div class="size__container">
        <div class="size__text">
          <h3 class="pd-select-option__headline">Screen size avaliable</h3>
          <span><a href="https://www.samsung.com/uk/tvs/tv-buying-guide/">Not sure what size to get?</a></span>
        </div>
        <div class="button__sizes">

        </div>
      </div>
      <div class="offer__container">
        <h3 class="pd-select-option__headline">Offer</h3>
        <div class="offer__blocks">

        </div>
      </div>
      <div class="cta__container">
        <a class="cta cta--outlined cta--black" href="${(modelCode === 'RR39A74A3CE/EU') ? "https://www.samsung.com/uk/refrigerators/bespoke-refrigerators/rr7000m-387l-beige-wood-rr39a74a3ce-eu/#benefits" : exUrl}" data-modelcode="${modelCode}" data-modelname="${baseCode}" aria-label="Learn more :${name}" an-tr="pd03_product finder:option-product finder-product-link" an-ca="product click" an-ac="pf product card" an-la="learn more click">See more Info</a>
      </div>

    </div>
  `
  modalContent.append(container);
  btnSizes();
  offerBlock();
  addToBasket();

  modal.style.display = 'block';
  const span = document.getElementsByClassName('close')[0];
      span.onclick = () => {
        modal.style.display = 'none';
      }
      window.onclick = (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    }

    const bulletpoints = new BulletPoints();
    bulletpoints.changeBulletPoints();


  }

move() {
  const horiView = document.querySelector('.product-card-v2__basket');
  const quickviewBtns = document.querySelectorAll('.quickview__btn');;

  quickviewBtns.forEach((quickviewBtn) => {
    if (horiView) {
      quickviewBtn.style.display = 'block';
      quickviewBtn.style.marginTop = '20%';
      quickviewBtn.style.marginLeft = '11.6';
    }
  })
}

checkingSku() {
  const panelBoxs = document.querySelectorAll('.pf-finder-v2__box');

  panelBoxs.forEach((panelBox) => {
      const elementToOb = panelBox;
      const observer = new MutationObserver(function() {
							// console.log('chaning sku not main')
        const change = new ChangeBtn();
              change.changeSku();
      })
      observer.observe(elementToOb, {subtree: true, childList: true})
      })
}

notAvaliablePopUp(name, currentSku, rating, features, seeMoreLink, image, nameText) {

  const modal = document.querySelector('.modal');
  const modalContent = document.querySelector('.modal-content');
  const imageSrc = image.getAttribute("src");
  const hiResImage = imageSrc.replace('$160_160_PNG$', '$PD_SHOP_JPG$');

  const checkPopup = () => {
    const arr = document.querySelector('.modal-content').children;
    Array.from(arr, (el, i) => {
      if (i >= 1) {
        document.querySelector('.container').remove();
      }
    })
  }

  const tagging = (el, attrs) => {
      for (let key in attrs) {
        el.setAttribute(key, attrs[key])
      }
    }

  const buildElement = (eleName, className ) => {
      const element = document.createElement(eleName);
      element.classList.add(className);
      return element;
    }

  const featureList = () => {
    let ul = document.createElement('ul');
    ul.classList.add('dot-list');
    ul.setAttribute('role', 'list');

      features.forEach((feature, i) => {
      let index = i
      let li = document.createElement('li');
      li.classList.add('dot-list__item');
      li.setAttribute('role', 'listitem');
      li.innerHTML =
        `<svg class="icon" focusable="false" viewBox="0 0 96 96">
          <path d="M48 32c8.837 0 16 7.163 16 16s-7.163 16-16 16-16-7.163-16-16 7.163-16 16-16z"></path>
        </svg>
        <span class="usp-text">${feature.innerText.trim()}</span>`;
      ul.appendChild(li);
    })

    return ul.innerHTML;
  }

  const stars =  (numOfStars) => {
  const rounded = Math.round(numOfStars);
  let star_nodes = '';
  for (let i = 1; i <= 5; i++) {
    if (rounded >= i ) {
    star_nodes += "<span class='filled-star'></span>"
    } else {
    star_nodes += "<span class='empty-star'></span>";
    }
  }
  return star_nodes;
  }

//checks to see there was or is another pop in modal, if there is then it removes it
  checkPopup();

    const container = document.createElement('div');
    container.classList.add('container');

    const imageContainer = buildElement('div', 'image__container')
    const mainProductImage = buildElement('div', 'main__product__image');

    imageContainer.append(mainProductImage);

    const imageTag = document.createElement('img');
    tagging(imageTag, {"src": `${hiResImage}`,"alt": `${currentSku}`})
    mainProductImage.append(imageTag)

    const icons = buildElement('div', 'icons');
    mainProductImage.append(icons);

    const iconInfo = {
     delivery: ["https://images.samsung.com/is/image/samsung/assets/uk/smartphonepcd/icon_delivery.png", "Free delivery"],
     return:   ["https://images.samsung.com/is/image/samsung/assets/uk/smartphonepcd/Icon_returns.png", "Free 21 days to return"],
     installation: ["https://images.samsung.com/is/image/samsung/assets/uk/smartphonepcd/Drill.png", "Installation available"]
    }

    for (const key in iconInfo) {
     if (Object.hasOwnProperty.call(iconInfo, key)) {
      const iconElementContent = iconInfo[key];
      const div = buildElement('div', key);
      const img = document.createElement('img');
      tagging(img, {
       "src": iconElementContent[0],
       "alt": iconElementContent[1]
      });
      img.style.width = "auto";
      const p = document.createElement('p');
      p.innerText = iconElementContent[1];
      div.append(img, p);
      icons.append(div);
     }
    }

    container.append(imageContainer);

    // product info content
    const productInfoContentContainer = buildElement('div', 'product__info__content');
    const p = buildElement('p', 'promotion-card-v2__sub-headline-text');
    p.innerText = `${nameText.textContent}`
    const small = document.createElement('small');
    small.textContent = `${currentSku}`
    productInfoContentContainer.append(p, small);

    const reviews = buildElement('div', 'reivews');
    productInfoContentContainer.append(reviews);

    const starsDiv = buildElement('div', 'stars');
    starsDiv.innerHTML = `${stars(parseInt(rating))}<p><strong>(${rating})</strong></p>`;
    reviews.append(starsDiv);

    const ul = buildElement('ul', 'dot-list');
    tagging(ul, {'role': 'list'});
    ul.innerHTML = `${featureList()}`;
    productInfoContentContainer.append(ul);

    const fullPriceDiv = buildElement('div', 'product-card-v2__price-full');
    const featureTextDiv = buildElement('div', 'product-card-v2__feature-text');
    featureTextDiv.classList.add('pop_up');
    fullPriceDiv.append(featureTextDiv);
    productInfoContentContainer.append(fullPriceDiv);

    const sizesContainer = buildElement('div', 'size__container');
    const sizeText = buildElement('div', 'size__text');
    const btnSize = buildElement('div', 'button__sizes');
    sizesContainer.append(sizeText, btnSize);
    productInfoContentContainer.append(sizesContainer);

    const offerContainer = buildElement('div', 'offer__container');
    offerContainer.innerHTML = `
    <h3 class="pd-select-option__headline">Unavaliable at the moment</h3>
    <div class="offer__blocks"></div>
    `
    productInfoContentContainer.append(offerContainer);

    const ctaContainer = buildElement('div', 'cta__container');
    ctaContainer.style.cssText = `justify-content: flex-start;`;
    const a = buildElement('a', 'cta');
    a.classList.add('cta--outlined', 'cta--black', 'unavaliable');
    tagging(a, {
    "href": `${seeMoreLink.getAttribute('href')}`,
    "data-modelcode": `${currentSku}`,
    "data-modelname": `${nameText.textContent}`,
    "aria-label": `Learn more :${name}`,
    "an-tr": "pd03_product finder:option-product finder-product-link",
    "an-ca": "product click",
    "an-ac": "pf product card",
    "an-la": "learn more"
    });
    a.innerText = "See more Info"
    ctaContainer.append(a);
    productInfoContentContainer.append(ctaContainer);

    container.append(productInfoContentContainer);

    modalContent.append(container);

    modal.style.display = 'block';
    const span = document.getElementsByClassName('close')[0];
    span.onclick = () => {
      modal.style.display = 'none';
    }
    window.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  }
  const bulletpoints = new BulletPoints();
    bulletpoints.changeBulletPoints();


}

}