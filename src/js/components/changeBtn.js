import axios from 'axios';
import QuickView from './tv';
import BulletPoints from './bulletPoints';


export default class ChangeBtn {
 changeSku() {
  //create click event that gets the sku
  let sku = ''
  const panelLinks = document.querySelectorAll('.product-card-v2__name-link');
  const quickViewBtns = document.querySelectorAll('.quickview__btn');
  const quickViewFunction = (modelcode, rating) => {
    return this.quickView(modelcode, rating)
  }

  panelLinks.forEach((panelLink, i) => {
    const modelCode = panelLink.getAttribute('data-modelcode');
    quickViewBtns.forEach((quickViewBtn, x) => {
      const quickViewModeCode = quickViewBtn.getAttribute('data-modelcode');
      // console.log(modelCode, quickViewModeCode, i, x)
      if (quickViewModeCode !== modelCode && i === x ) {
        quickViewBtn.setAttribute('data-modelcode', modelCode);
        let elementOne = panelLink.parentElement.parentElement.parentElement.parentElement.parentElement;
          let elementTwo = panelLink.parentElement;
          let topElement = (elementOne === null) ? elementTwo : elementOne;
          topElement.prepend(quickViewBtn);
      }
      quickViewBtn.onclick = (e) => {
      //get the current target panel
        const panel = e.target.nextElementSibling.lastChild.children[1];
        //get the string rating of the current panel and convert it to a number
        const rating = Number(panel.querySelector('.rating__point').children[1].textContent);
        e.preventDefault();
        sku = quickViewModeCode;
        quickViewFunction(sku, rating)
      }
    })
  })
  const boxFinders = document.querySelectorAll('.js-pf-product-card');
  quickViewBtns.forEach((quickViewBtn, y) => {
    const observer = new MutationObserver(function() {
    boxFinders.forEach((boxFinder, x) => {
      //if the parent element does not include the quick view button
      const card = boxFinder.querySelector('.product-card-v2__name-link');
      if (card !== null ) {
        if (!boxFinder.firstElementChild.textContent.includes('Quick View')) {
          //do this
          // console.log(boxFinder.firstElementChild, x);
          const modelCode = card.getAttribute('data-modelcode');
          let panelBtn = document.createElement('a');
          panelBtn.classList.add('quickview__btn');
          panelBtn.setAttribute('data-modelcode', modelCode);
          panelBtn.setAttribute('href', 'javascript:void(0)');
          panelBtn.innerText = 'Quick View';
          boxFinder.prepend(panelBtn);
          panelBtn.onclick = (e) => {
            e.preventDefault();
             //get the current target panel
            const panel = e.target.nextElementSibling.lastChild.children[1];
            //get the string rating of the current panel and convert it to a number
            const rating = Number(panel.querySelector('.rating__point').children[1].textContent);
            quickViewFunction(modelCode, rating)
          }
        }
      }

    });
  })
  observer.observe(quickViewBtn.parentElement, {subtree: true, childList: true});
  // const quickViewModeCode = quickViewBtn.getAttribute('data-modelcode');

  });


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
    const name       = tvProducts.data.name;
    const modelCode  = tvProducts.data.code;
    const variants   = tvProducts.data.variantOptions;
    const rating     = (tvProducts.data.productRating === undefined) ? currentPanelRating : tvProducts.data.productRating;
    const features   = tvProducts.data.productFeatureComponents;
    const price      = tvProducts.data.price.value;
    const promoPrice   = (tvProducts.data.promotionPrice) ? tvProducts.data.promotionPrice.value : price;
    const image      = tvProducts.data.picture.url || tvProducts.data.variantOptions[0].galleryImagesV2[0].images[0].value.url
    const exUrl      = tvProducts.data.externalUrl;
    const baseCode   = tvProducts.data.baseProductCode;
    const proRating  = (tvProducts.data.productRating === undefined) ? currentPanelRating : tvProducts.data.productRating;
    const benefits   = tvOffers.data.benefits;

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
          const currentSku = (err.response.data.errors[0].message.length <= 45 ) ?err.response.data.errors[0].message.slice(19, 33) : 'RB38A7B6BB1/EU'
          const rating = boxFinder.querySelector('.rating__point').children[1].textContent;
          const features = boxFinder.querySelectorAll('.product-card-v2__feature-item');
          const seeMoreLink = boxFinder.querySelector(".product-card-v2__cta").firstChild;
          const image = boxFinder.querySelector('.image__main');
          const nameText = boxFinder.querySelector('.product-card-v2__name-text');
          if (sku === currentSku){
            // console.log(name, currentSku, rating, features, seeMoreLink, image)
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
                      console.log(res)
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

  const container = document.createElement('div');
        container.classList.add('container');
        container.innerHTML =
  `<div class="image__container">
    <span><img src="https://images.samsung.com/is/image/samsung/p6pim/uk/family/346103/award/uk-awards-washer-ww90t684dlh-501500337" alt="5 year warranty badge"/></span>
      <div class="main__product__image">
        <img src="${hiResImage}" alt="${modelCode}"/>
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
          <a class="product-card-v2__feature-cta js-calculate-popup-open" data-type="install" data-modelcode="${modelCode}" href="javascript:;" title="Calculate Finance " link_info="/uk/web/emi-popup/?sku=${modelCode}&amp;price=${promoPrice}&amp;page=pf" an-tr="pd03_product finder:option-product finder-calculator-link" an-ca="option click" an-ac="pf product card" an-la="calculator">or £${monthlyPrice.toFixed(2)}/mo at 0% APR <sup>*</sup></a>
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

notAvaliablePopUp(name, currentSku, rating, features, seeMoreLink, image, nameText) {
  // console.log(name, currentSku, rating, features, seeMoreLink, image, nameText)
  // console.log(seeMoreLink)
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
      if (index > 11 && index < 15) {
        // console.log(feature.title)
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

    const container = document.createElement('div');
        container.classList.add('container');
        container.innerHTML =
    `<div class="image__container">
          <div class="main__product__image">
            <img src="${hiResImage}" alt="${currentSku}"/>
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
          <p class="promotion-card-v2__sub-headline-text">${nameText.textContent}</p>
          <small>${currentSku}</small>
          <div class="reviews">
              <div class="stars">
                  ${stars(parseInt(rating))}<p><strong>(${rating})</strong></p>
              </div>
            </div>
          <ul class="dot-list" role="list">
            ${featureList()}
          </ul>
          <div class="product-card-v2__price-full">

            <div class="product-card-v2__feature-text pop_up">

            </div>
          </div>
          <div class="size__container">
            <div class="size__text">

            </div>
            <div class="button__sizes">

            </div>
          </div>
          <div class="offer__container">
            <h3 class="pd-select-option__headline">Unavaliable at the moment</h3>
            <div class="offer__blocks">

            </div>
          </div>
          <div class="cta__container" style="justify-content: flex-start">
            <a class="cta cta--outlined cta--black unavaliable" href="${seeMoreLink.getAttribute('href')}" data-modelcode="${currentSku}" data-modelname="${nameText.textContent}" aria-label="Learn more :${name}" an-tr="pd03_product finder:option-product finder-product-link" an-ca="product click" an-ac="pf product card" an-la="learn more click">See more Info</a>
          </div>
          </div>
        </div>
      `
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