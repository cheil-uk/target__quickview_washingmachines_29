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

const imageContainer = buildElement('div', 'image__container')
    const mainProductImage = buildElement('div', 'main__product__image');

    imageContainer.append(mainProductImage);

    const imageTag = document.createElement('img');
    tagging(imageTag, {"src": `${hiResImage}`,"alt": `${currentSku}`})
    mainProductImage.append(imageTag)

    const icons = buildElement('div', 'icons');
    mainProductImage.append(icons);

    const delivery = buildElement('div', 'delivery');
    delivery.innerHTML = `
    <img src="https://images.samsung.com/is/image/samsung/assets/uk/smartphonepcd/icon_delivery.png" alt="delivery"/>
    <p>Free delivery</p>`

    const returnDiv = buildElement('div', 'return');
    returnDiv.innerHTML = `
    <img src="https://images.samsung.com/is/image/samsung/assets/uk/smartphonepcd/Icon_returns.png"/>
    <p>Free 28 days to return</p>`

    const installation = buildElement('div', 'installation');
    installation.innerHTML = `
    <img src="https://images.samsung.com/is/image/samsung/assets/uk/smartphonepcd/Drill.png"/>
    <p>Installation available</p>`
    icons.append(delivery,returnDiv,installation);

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

    const iconInfo = {
     delivery: ["https://images.samsung.com/is/image/samsung/assets/uk/smartphonepcd/icon_delivery.png", "Free delivery"],
     return: ["https://images.samsung.com/is/image/samsung/assets/uk/smartphonepcd/Icon_returns.png", "Free 21 days to return"],
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




