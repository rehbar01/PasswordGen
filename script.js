// fetching all the required elements
const inputSlider = document.querySelector("[pass-slider]");
const lenghtDisplay = document.querySelector("[passLength_num]");
const passwordDisplay = document.querySelector("[dataPasswordisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[copy-message]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#number");
const symbolsCheck = document.querySelector("#symbol");
const indicator = document.querySelector("[pass-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~!@#$%^&*()_+=]\{}[?|';
// initialise with default values
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");
// password length
function handleSlider(){                       // to update password length on UI
     lenghtDisplay.innerText = passwordLength;
     inputSlider.value = passwordLength;
     
     const min = inputSlider.min;
     const max = inputSlider.max;
     inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min)) +"%100%";
}
// changes the colour of strength indicator
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`
}
// generate a randum integer between min and max
function getRndinteger(min,max){
    return Math.floor(Math.random()*(max-min)) + min;
}
function generateRandomNumber(){
    return getRndinteger(0,9);
}
function generateLowerCase(){
    return String.fromCharCode(getRndinteger(97,123));
}
function generateUpperCase(){
    return String.fromCharCode(getRndinteger(65,90));
}
function generateSymbol(){
    const randomNum = getRndinteger(0,symbols.length);
    return symbols.charAt(randomNum);
}
// function to calculate the strength of password
function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(symbolsCheck.checked) hasSym = true;
    if(numbersCheck.checked) hasNum = true;
    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >=8){
        setIndicator("#0f0");
    }
    else if( (hasLower || hasUpper) &&(hasNum || hasLower) && passwordLength >= 6){
      setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}
// copy password to clipboard
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }
    // to make copy span visible
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}
function shufflePassword(array){
    // Fisher Yates Method
    for(let i = array.length-1; i >= 0; i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el)=>{str += el});
    return str;
}
function handleCheckboxchange(){     // function to count the no. of checkbox are checked
    checkCount = 0;                  // if any of the checkbox is checked
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
        checkCount++;
    });
    // special condition 
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}
allCheckBox.forEach((checkbox)=>{    
    checkbox.addEventListener('change',handleCheckboxchange);  // eventlistner when there is any change in any checkbox
});

inputSlider.addEventListener('input',(event)=>{
    passwordLength = event.target.value; 
    handleSlider();                      
});     

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)  // means there should a password present to copy,only then it be copied
    copyContent();
});
generateBtn.addEventListener('click',()=>{
    // none of the checkbox are selected
    if(checkCount <= 0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    //journey to find the new password 

    //remove old password
    password = "";

    let funcArr = [];
    if(uppercaseCheck.checked)
    funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
    funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
    funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
    funcArr.push(generateSymbol);

    // compulsory addition
    for(let i = 0; i < funcArr.length; i++){
        password += funcArr[i]();
    }
    // remaining addition
    for(let i = 0; i < passwordLength - funcArr.length; i++){
        let randIndex = getRndinteger(0,funcArr.length-1);
        password += funcArr[randIndex]();
    }
    // shuffle password
    password = shufflePassword(Array.from(password));
    // show password in UI
    passwordDisplay.value = password;
    // calculate strength
    calcStrength();

});

