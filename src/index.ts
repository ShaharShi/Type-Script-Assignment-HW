const trContainer = document.getElementById('trContainer');
const productsArr = [];
const optionsContainers = ['perKiloOptions', 'moreExOptions1', 'moreExOptions2']

class FoodProduct {

    constructor(
        private name: string,
        private price: number,
        private weight: number,
        private isKosher: boolean,
        private manufacturerName: string,
        private exDate: string) { }

    printProduct() {
        drawProductInTable(this);
    }
    printProductNameAndPrice() {
        drawOnlyNameAndPrice(this);
    }
    getPriceForUnit() {
        const result = this.price / this.weight;
        drawPriceForUnit(result);
    }
    checkExDate() {
        const res = checkExpirationDate(this.exDate);
        res ? alert(res): alert('Date not specified');
    }

    getName() { return this.name.length > 0 ? this.name : '---'};
    getPrice() { return isNaN(this.price) ? '---' : `${this.price} ILS` };
    getWeight() { return isNaN(this.weight) ? '---' : `${this.weight} Kg`};
    getIsKosher() { return this.isKosher == true ? 'Yes' : 'No' };
    getManufacturerName() { return this.manufacturerName.length > 0 ? this.manufacturerName : '---'};
    getExDate() { return this.exDate.length > 0 ? this.exDate : '---'};
}

(function() {
    const checkMoreExpensiveBtn = document.getElementById('checkMoreExpensive');
    const allProperties = document.getElementById('allProperties');
    const onlyNamePriceBtn = document.getElementById('onlyNamePriceBtn');
    const tableComment = document.getElementById('tableComment');
    
    allProperties.addEventListener('click',(e) => {
        e.preventDefault();
        makeProduct('printProduct', tableComment);
    })
    onlyNamePriceBtn.addEventListener('click',(e) => {
        e.preventDefault();
        makeProduct('printProductNameAndPrice', tableComment);
    })
    checkMoreExpensiveBtn.addEventListener('click', () => { checkWhosMoreExpensive() })
})()

function makeProduct(whatToDraw, tableComment) {
    const pName = document.getElementById('pName').value;
    const pPrice = document.getElementById('pPrice').valueAsNumber;
    const pWeight = document.getElementById('pWeight').valueAsNumber;
    const pIsKosher = document.getElementById('pIsKosher').checked;
    const pManufacturerName = document.getElementById('pManufacturerName').value;
    const pExeDate = document.getElementById('pExeDate').value;

    if (pName === '' || pName.length === 0) { alert('Insert Product Name !'); return }
    const nameExist = productsArr.find( productObj => productObj.name === pName )
    if (nameExist) { alert('The Product name already exist !'); return }
    
    const product = new FoodProduct(pName, pPrice, pWeight, pIsKosher, pManufacturerName, pExeDate);
    
    productsArr.push(product);
    console.log(productsArr);
    product[whatToDraw]();
    
    optionsContainers.map((container) => {
        drawOption(product, container)
    })
    tableComment.remove();
}

function drawProductInTable(product) {
    const tr = document.createElement('tr');
    const tdName = getTD(product.getName());
    const tdPrice = getTD(product.getPrice());
    const tdWeight = getTD(product.getWeight());
    const tdIsKosher = getTD(product.getIsKosher());
    const tdManufacturerName = getTD(product.getManufacturerName());
    const tdExDate = getTD(product.getExDate());
    const exDateBtn = _getExBtn();
    
    exDateBtn.addEventListener('click',() => { product.checkExDate()});

    tdExDate.append(exDateBtn);
    tr.append(tdName, tdPrice, tdWeight, tdIsKosher, tdManufacturerName, tdExDate);
    trContainer.append(tr);
    
    function _getExBtn() {
        const btn = document.createElement('button');
        btn.innerText = 'Check Expiration date';
        btn.setAttribute('class', 'btn btn-danger btn-sm ex-btn');

        return btn;
    }
}

function drawOnlyNameAndPrice(product) {
    const tr = document.createElement('tr');
    const tdName = getTD(product.getName());
    const tdPrice = getTD(product.getPrice());

    tr.append(tdName, tdPrice);
    trContainer.append(tr);
}

function getTD(value) {
    const td = document.createElement('td');
    td.innerText = value;
    return td;
}

function checkExpirationDate(productDate) {
    if (!productDate) return;

    let result;
    const date = new Date();
    const year = date.getFullYear();
    const mon = date.getMonth() + 1;
    const day = date.getDate();

    const productDateArr = productDate.split('-');
    const productYear = productDateArr[0];
    const productMon = productDateArr[1].startsWith('0') ? productDateArr[1].replace('0', '') : productDateArr[1];
    const productDay = productDateArr[2].startsWith('0') ? productDateArr[2].replace('0', '') : productDateArr[2];

    switch(true) {
        case Number(productYear) < year : { result = 'Product Expire' } break;
        case Number(productYear) > year : { result = 'The Product Has Not Expired' } break;
        case Number(productMon) < mon : { result = 'Product Expire' } break;
        case Number(productMon) > mon : { result = 'The Product Has Not Expired' } break;
        case Number(productDay) < day : { result = 'Product Expire' } break;
        case Number(productDay) >= day : { result = 'The Product Has Not Expired' } break;
        default: break;
    }
    return result;
};

function drawOption(product, currentContainerName) {
    const currentContainer = document.getElementById(currentContainerName);
    const checkPricePerKiloBtn = document.getElementById('checkPricePerKilo')
    checkPricePerKiloBtn.addEventListener('click', () => { product.getPriceForUnit() })

    const option = document.createElement('option');
    option.innerText = product.getName();

    currentContainer.append(option);
}

function drawPriceForUnit(result) {
    if(!result) return;

    const container = document.getElementById('perKiloContainer');
    container.innerText = `${result} ILS`;
}

function checkWhosMoreExpensive() {
    let result;
    const container = document.getElementById('moreExContainer');
    const select1 = document.getElementById('moreExOptions1');
    const select2 = document.getElementById('moreExOptions2');
    const optionValue1 = select1.options[select1.selectedIndex].text;
    const optionValue2 = select2.options[select2.selectedIndex].text;
    
    const objOne = productsArr.find((productObj) => { return productObj.name === optionValue1; })
    const objTwo = productsArr.find((productObj) => { return productObj.name === optionValue2; })
    if (isNaN(objOne.price) || isNaN(objTwo.price)) return;

    switch(true) {
        case objOne.price == objTwo.price : {result = `${objOne.name} And ${objTwo.name} Are Equal in Price !`} break;
        case objOne.price > objTwo.price : {result = `${objOne.name} is more Expensive then ${objTwo.name}`} break;
        case objOne.price < objTwo.price : {result = `${objTwo.name} is more Expensive then ${objOne.name}`} break;
        default: break;
    }
    container.innerText = result;
}