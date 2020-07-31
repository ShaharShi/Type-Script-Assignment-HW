const trContainer = document.getElementById('trContainer');
const productsArr = [];
const optionsContainers = ['perKiloOptions', 'moreExOptions1', 'moreExOptions2']

class FoodProduct {

    public static day_in_milisconds: number = 86400000;

    constructor(
        private name: string,
        private price: number,
        private weight: number,
        private isKosher: boolean,
        private manufacturerName: string,
        private exDate: Date
    ) { }

    printProduct(): void {
        drawProductInTable(this);
    }
    printProductNameAndPrice(): void {
        drawOnlyNameAndPrice(this);
    }
    getPriceForUnit(): Number {
        return this.price / this.weight;
    }
    checkExDate(): void {
        if(isNaN(this.exDate.valueOf())) return
        const result = this.exDate.getTime() < new Date().getTime() + FoodProduct.day_in_milisconds
        result ? alert('The Product Expire') : alert('Product is\'nt Expire');
    }

    getName(): String { return this.name.length > 0 ? this.name : '---'};
    getPrice(): String { return isNaN(this.price) ? '---' : `${this.price} ILS` };
    getWeight(): String { return isNaN(this.weight) ? '---' : `${this.weight} Kg`};
    getIsKosher(): String { return this.isKosher == true ? 'Yes' : 'No' };
    getManufacturerName(): String { return this.manufacturerName.length > 0 ? this.manufacturerName : '---'};
    getExDate(): String { return this.exDate.toLocaleDateString()};

    static returnWhosMoreExpensive(productOne: FoodProduct, productTwo: FoodProduct): String {
        const result = productOne.price > productTwo.price ?  productOne.name : productTwo.name;
        return result;
    }
}

(function() {
    const allProperties = document.getElementById('allProperties');
    const onlyNamePriceBtn = document.getElementById('onlyNamePriceBtn');
    const tableComment = document.getElementById('tableComment');
    const checkMoreExpensiveBtn = document.getElementById('checkMoreExpensive');
    const checkPricePerKiloBtn = document.getElementById('checkPricePerKilo')
    
    allProperties.addEventListener('click',(e) => {
        e.preventDefault();
        makeProduct('printProduct', tableComment);
    })
    onlyNamePriceBtn.addEventListener('click',(e) => {
        e.preventDefault();
        makeProduct('printProductNameAndPrice', tableComment);
    })
    checkMoreExpensiveBtn.addEventListener('click', () => { checkWhosMoreExpensive() })
    checkPricePerKiloBtn.addEventListener('click', () => { checkPriceForUnit() })
})()

function makeProduct(whatToDraw, tableComment) {
    const pName: HTMLInputElement = document.querySelector('#pName')
    const pPrice: HTMLInputElement = document.querySelector('#pPrice')
    const pWeight: HTMLInputElement = document.querySelector('#pWeight')
    const pIsKosher: HTMLInputElement = document.querySelector('#pIsKosher')
    const pManufacturerName: HTMLInputElement = document.querySelector('#pManufacturerName')
    const pExeDate: HTMLInputElement = document.querySelector('#pExeDate')

    if (pName.value === '' || pName.value.length === 0) { alert('Insert Product Name !'); return }
    const nameExist = productsArr.find( productObj => productObj.name === pName )
    if (nameExist) { alert('The Product name already exist !'); return }

    const product = new FoodProduct(pName.value, pPrice.valueAsNumber, pWeight.valueAsNumber, pIsKosher.checked, pManufacturerName.value, new Date(pExeDate.value));
    
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

function drawOption(product, currentContainerName) {
    const currentContainer = document.getElementById(currentContainerName);

    const option = document.createElement('option');
    option.innerText = product.getName();

    currentContainer.append(option);
}

function checkPriceForUnit() {
    const container = document.getElementById('perKiloContainer');
    const selectValue: any = document.querySelector('#perKiloOptions');
    const optionValue = selectValue.options[selectValue.selectedIndex].text;

    const currentObj = findObjectInArrayByName(optionValue)
    const result = currentObj.getPriceForUnit();

    container.innerText = result ? `${result.toFixed(2)} ILS` : "Unknown Price Or Weight";
}

function checkWhosMoreExpensive() {

    const container = document.getElementById('moreExContainer');
    const select1: any = document.getElementById('moreExOptions1');
    const select2: any = document.getElementById('moreExOptions2');
    const optionValue1 = select1.options[select1.selectedIndex].text;
    const optionValue2 = select2.options[select2.selectedIndex].text;

    const objOne = findObjectInArrayByName(optionValue1)
    const objTwo = findObjectInArrayByName(optionValue2)

    if (isNaN(objOne.price) || isNaN(objTwo.price)) return;

    const result = FoodProduct.returnWhosMoreExpensive(objOne, objTwo)
    container.innerText = `${result} is more Expensive`;
}

function findObjectInArrayByName(productName: string) {
    const theRequestedObject = productsArr.find((productObj) => { return productObj.name === productName; })

    return theRequestedObject;
}