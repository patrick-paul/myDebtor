let display = document.getElementById("display");
let firstOperand = "";
let secondOperand = "";
let currentOperation = null;
let shouldResetDisplay = false;

// Messages in different languages
const messages = {
  ENG: 'Nothing To Show Here =(<br>Click "+ Add New Record" To Get Started!',
  SWH: 'Hakuna Cha Kuonyesha Hapa =(<br>Bofya "+ Ongeza Rekodi Mpya" Ili Kuanza!',
  GER: 'Nichts zu Zeigen =(<br>Klicken Sie auf "+ Neuen Eintrag hinzufügen", um zu beginnen!',
  RUS: 'Здесь нечего показывать =(<br>Нажмите "+ Добавить новую запись", чтобы начать!',
  JPY: 'ここには何も表示されません =(<br>"+ 新しいレコードを追加" をクリックして開始してください!',
  FRA: 'Rien à Montrer Ici =(<br>Cliquez sur "+ Ajouter un Nouvel Enregistrement" pour Commencer!',
  HIN: 'यहाँ दिखाने के लिए कुछ नहीं है =(<br>शुरू करने के लिए "+ नया रिकॉर्ड जोड़ें" पर क्लिक करें!',
  ARA: 'لا شيء لعرضه هنا =(<br>للبدء، انقر فوق "+ إضافة سجل جديد"!',
  ZHO: "这里没有什么可显示的 =(<br>点击“+ 添加新记录”开始！",
};

const defaultCurrencyForLanguage = {
  ENG: "USD",
  SWH: "TZS",
  GER: "EUR",
  RUS: "RUB",
  JPY: "JPY",
  FRA: "EUR",
  HIN: "INR",
  ARA: "SAR",
  ZHO: "CNY",
};

const trialOverMessages = {
  ENG: `<div class="closerTrial">
      <h1>
        Your Trial Time Has Ended! <br>
        Purchase The Software To Proceed.
      </h1>
    </div>`,
  SWH: `<div class="closerTrial">
      <h1>
        Muda wako wa jaribio umekwisha! <br>
        Nunua Programu Kuendelea.
      </h1>
    </div>`,
  GER: `<div class="closerTrial">
      <h1>
        Ihre Testzeit ist abgelaufen! <br>
        Kaufen Sie die Software, um fortzufahren.
      </h1>
    </div>`,
  RUS: `<div class="closerTrial">
      <h1>
        Ваш пробный период истек! <br>
        Купите программное обеспечение, чтобы продолжить.
      </h1>
    </div>`,
  JPY: `<div class="closerTrial">
      <h1>
        お試し期間が終了しました！ <br>
        続行するにはソフトウェアを購入してください。
      </h1>
    </div>`,
  FRA: `<div class="closerTrial">
      <h1>
        Votre période d'essai est terminée ! <br>
        Achetez le logiciel pour continuer.
      </h1>
    </div>`,
  HIN: `<div class="closerTrial">
      <h1>
        आपका परीक्षण समय समाप्त हो गया है! <br>
        आगे बढ़ने के लिए सॉफ़्टवेयर खरीदें।
      </h1>
    </div>`,
  ARA: `<div class="closerTrial">
      <h1>
        انتهت فترة التجربة الخاصة بك! <br>
        اشترِ البرنامج للمتابعة.
      </h1>
    </div>`,
  ZHO: `<div class="closerTrial">
      <h1>
        您的试用时间已结束！ <br>
        购买软件以继续操作。
      </h1>
    </div>`,
};

document.addEventListener("DOMContentLoaded", () => {
  const addNewRecordBtn = document.getElementById("addNewRecord");
  const addRecordModal = document.getElementById("addRecordModal");
  const closeModalBtn = document.querySelector(".close");
  const addRecordForm = document.getElementById("addRecordForm");
  const debtsTableBody = document.getElementById("debtsTableBody");

  // Load data from localStorage
  const savedDebtsData = localStorage.getItem("debtsData");
  const debtsData = savedDebtsData ? JSON.parse(savedDebtsData) : [];

  // Save data to localStorage
  function saveToLocalStorage() {
    localStorage.setItem("debtsData", JSON.stringify(debtsData));
  }

  // Display data in the table
  function displayData() {
    debtsTableBody.innerHTML = "";
    if (debtsData.length == 0) {
      document.getElementById("dataTable").style.display = "none";
      const bellowHeader = document.createElement("div");
      bellowHeader.classList.add("flexItem", "fullWidth");
      bellowHeader.id = "noDataDiv";
      const savedLanguage = localStorage.getItem("language") || "ENG";
      bellowHeader.innerHTML = messages[savedLanguage] || messages["ENG"];
      document.getElementById("header").appendChild(bellowHeader);
    } else {
      document.getElementById("dataTable").style.display = "block";
      if (document.getElementById("noDataDiv")) {
        document.getElementById("noDataDiv").remove();
      }
      debtsData.forEach((debt, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td><span class="user-icon">${
          debt.type == "Individual" ? "👤" : "🏢"
        }</span></td>
        <td>${debt.fullName}</td>
        <td>${debt.type}</td>
        <td>${debt.initialDebt.toLocaleString()}</td>
        <td>${debt.payedAmount.toLocaleString()}</td>
        <td>${debt.owingAmount.toLocaleString()}</td>
        <td>${debt.currency}</td>
        <td>${debt.recordDate}</td>
        <td>${debt.paybackDate}</td>
        <td><progress value="${debt.paybackProgress}" max="100"></progress></td>
        <td>
            <span class="delete-record">
              <button data-index="${index}" class="deletebutton">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 69 14"
                class="svgIcon bin-top"
              >
                <g clip-path="url(#clip0_35_24)">
                  <path
                    fill="black"
                    d="M20.8232 2.62734L19.9948 4.21304C19.8224 4.54309 19.4808 4.75 19.1085 4.75H4.92857C2.20246 4.75 0 6.87266 0 9.5C0 12.1273 2.20246 14.25 4.92857 14.25H64.0714C66.7975 14.25 69 12.1273 69 9.5C69 6.87266 66.7975 4.75 64.0714 4.75H49.8915C49.5192 4.75 49.1776 4.54309 49.0052 4.21305L48.1768 2.62734C47.3451 1.00938 45.6355 0 43.7719 0H25.2281C23.3645 0 21.6549 1.00938 20.8232 2.62734ZM64.0023 20.0648C64.0397 19.4882 63.5822 19 63.0044 19H5.99556C5.4178 19 4.96025 19.4882 4.99766 20.0648L8.19375 69.3203C8.44018 73.0758 11.6746 76 15.5712 76H53.4288C57.3254 76 60.5598 73.0758 60.8062 69.3203L64.0023 20.0648Z"
                  ></path>
                </g>
                <defs>
                  <clipPath id="clip0_35_24">
                    <rect fill="white" height="14" width="69"></rect>
                  </clipPath>
                </defs>
              </svg>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 69 57"
                class="svgIcon bin-bottom"
              >
                <g clip-path="url(#clip0_35_22)">
                  <path
                    fill="black"
                    d="M20.8232 -16.3727L19.9948 -14.787C19.8224 -14.4569 19.4808 -14.25 19.1085 -14.25H4.92857C2.20246 -14.25 0 -12.1273 0 -9.5C0 -6.8727 2.20246 -4.75 4.92857 -4.75H64.0714C66.7975 -4.75 69 -6.8727 69 -9.5C69 -12.1273 66.7975 -14.25 64.0714 -14.25H49.8915C49.5192 -14.25 49.1776 -14.4569 49.0052 -14.787L48.1768 -16.3727C47.3451 -17.9906 45.6355 -19 43.7719 -19H25.2281C23.3645 -19 21.6549 -17.9906 20.8232 -16.3727ZM64.0023 1.0648C64.0397 0.4882 63.5822 0 63.0044 0H5.99556C5.4178 0 4.96025 0.4882 4.99766 1.0648L8.19375 50.3203C8.44018 54.0758 11.6746 57 15.5712 57H53.4288C57.3254 57 60.5598 54.0758 60.8062 50.3203L64.0023 1.0648Z"
                  ></path>
                </g>
                <defs>
                  <clipPath id="clip0_35_22">
                    <rect fill="white" height="57" width="69"></rect>
                  </clipPath>
                </defs>
              </svg>
            </button>
            </span>
        </td>
      `;
        debtsTableBody.appendChild(row);
      });
      addDeleteEventListeners(); // Attach delete event listeners
    }
  }

  // Add event listeners to delete buttons
  function addDeleteEventListeners() {
    document.querySelectorAll(".delete-record button").forEach((button) => {
      button.addEventListener("click", deleteRecord);
    });
  }

  // Delete a record from the table and localStorage
  function deleteRecord(event) {
    const index = event.target.getAttribute("data-index");
    debtsData.splice(index, 1);
    saveToLocalStorage();
    displayData();
  }

  // Show the modal
  addNewRecordBtn.onclick = function () {
    document.getElementById("superContainer").style.zIndex = "1";
    addRecordModal.style.display = "block";
  };

  // Close the modal
  closeModalBtn.onclick = function () {
    addRecordModal.style.display = "none";
  };

  document.getElementById("closeSettings").onclick = function () {
    hideSettings();
  };

  // Close the modal if clicking outside of it
  window.onclick = function (event) {
    if (event.target == addRecordModal) {
      addRecordModal.style.display = "none";
    } else if (event.target == document.getElementById("superContainer")) {
      hideDebtors();
    } else if (event.target == document.getElementById("superCalculator")) {
      hideCalculator();
    } else if (event.target == document.getElementById("superSettings")) {
      hideSettings();
    }
  };

  // Handle form submission
  addRecordForm.onsubmit = function (event) {
    event.preventDefault();
    const formData = new FormData(addRecordForm);
    const newRecord = {
      fullName: formData.get("fullName"),
      type: formData.get("type"),
      initialDebt: parseFloat(formData.get("initialDebt")),
      payedAmount: 0,
      owingAmount: parseFloat(formData.get("initialDebt")),
      currency: formData.get("currency"),
      recordDate: formData.get("recordDate"),
      paybackDate: formData.get("paybackDate"),
      paybackProgress: 0,
    };
    debtsData.push(newRecord);
    saveToLocalStorage(); // Save data to localStorage
    displayData();
    addRecordModal.style.display = "none";
    addRecordForm.reset();
  };

  // Initial display of data
  displayData();
});

function appendNumber(number) {
  if (shouldResetDisplay) resetDisplay();

  if (display.innerText === "0" && display.innerText.length == 1) {
    display.innerHTML = "";
    display.innerText += number;
  } else {
    display.innerText += number;
  }

  if (currentOperation === null) {
    firstOperand += number;
  } else {
    secondOperand += number;
  }
}

function chooseOperation(operation) {
  if (firstOperand === "") return;
  if (currentOperation !== null) compute();
  currentOperation = operation;
  display.innerText += ` ${operation} `;
  shouldResetDisplay = true;
}

function compute() {
  if (currentOperation === null || shouldResetDisplay) return;
  secondOperand = secondOperand || firstOperand;
  display.innerText = evaluate();
  firstOperand = display.innerText;
  currentOperation = null;
  secondOperand = "";
  shouldResetDisplay = true;
}

function evaluate() {
  let result;
  let a = parseFloat(firstOperand);
  let b = parseFloat(secondOperand);
  if (isNaN(a) || isNaN(b)) return "";
  switch (currentOperation) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
    case "*":
      result = a * b;
      break;
    case "/":
      result = a / b;
      break;
    case "%":
      result = (a * b) / 100;
      break;
    default:
      return;
  }
  return result.toString();
}

function clearDisplay() {
  display.innerText = "0";
  firstOperand = "";
  secondOperand = "";
  currentOperation = null;
}

function resetDisplay() {
  display.innerText = "";
  shouldResetDisplay = false;
}

function deleteLast() {
  if (display.innerText.length == 1) {
    display.innerHTML = "0";
  }

  if (display.innerText !== "0") {
    display.innerText = display.innerText.slice(0, -1);
    if (currentOperation === null) {
      firstOperand = firstOperand.slice(0, -1);
    } else {
      secondOperand = secondOperand.slice(0, -1);
    }
  }
}

const theSettingForm = document.getElementById("theSettingForm");

// Function to save form data to local storage and navigate to the selected language page
theSettingForm.onsubmit = function (event) {
  event.preventDefault();
  const formData = new FormData(theSettingForm);
  const organizationName = formData.get("organizationName");
  const language = formData.get("language");

  // Save the organization name and language to local storage
  localStorage.setItem("organizationName", organizationName);
  localStorage.setItem("language", language);

  // Navigate to the corresponding language page
  switch (language) {
    case "ENG":
      window.location.href = "./index.html";
      break;
    case "SWH":
      window.location.href = "./index_swh.html";
      break;
    case "GER":
      window.location.href = "./index_ger.html";
      break;
    case "RUS":
      window.location.href = "./index_rus.html";
      break;
    case "JPY":
      window.location.href = "./index_jpy.html";
      break;
    case "FRA":
      window.location.href = "./index_fra.html";
      break;
    case "HIN":
      window.location.href = "./index_hin.html";
      break;
    case "ARA":
      window.location.href = "./index_ara.html";
      break;
    case "ZHO":
      window.location.href = "./index_zho.html";
      break;
    default:
      // Optionally, you can add a default case to handle unknown languages
      console.log("Language not supported");
      break;
  }
};

// Function to set the form data and messages from local storage
function setFormDataAndMessageFromLocalStorage() {
  const savedOrganizationName = localStorage.getItem("organizationName");
  const languageDetails = {
    ENG: { name: "English", flag: "🇺🇸" },
    SWH: { name: "Swahili", flag: "🇹🇿" },
    GER: { name: "German", flag: "🇩🇪" },
    RUS: { name: "Russian", flag: "🇷🇺" },
    JPY: { name: "Japanese", flag: "🇯🇵" },
    FRA: { name: "French", flag: "🇫🇷" },
    HIN: { name: "Hindi", flag: "🇮🇳" },
    ARA: { name: "Arabic", flag: "🇸🇦" },
    ZHO: { name: "Chinese", flag: "🇨🇳" },
  };

  // Retrieve the saved language from local storage or default to English
  const savedLanguage = localStorage.getItem("language") || "ENG";

  // Get the full language name and flag
  const { name, flag } =
    languageDetails[savedLanguage] || languageDetails["ENG"]; // Default to English

  document.getElementById("lang").innerHTML = `${name} ${flag}`;
  document.getElementById("organisation").innerHTML = savedOrganizationName
    ? savedOrganizationName
    : "Organisation";

  if (savedOrganizationName) {
    document.getElementById("organizationName").value = savedOrganizationName;
  }

  if (savedLanguage) {
    document.getElementById("language").value = savedLanguage;

    // Retrieve the default currency for the selected language
    const defaultCurrency = defaultCurrencyForLanguage[savedLanguage];

    // Set the currency selector to the default currency
    if (defaultCurrency) {
      document.getElementById("currency").value = defaultCurrency;
    }
  }

  // Set the message below the header based on the selected language
  const bellowHeader = document.getElementById("bellowHeader");
  if (bellowHeader) {
    bellowHeader.innerHTML = messages[savedLanguage] || messages["ENG"];
  }
}

// Call the function on page load
window.onload = setFormDataAndMessageFromLocalStorage;

// Flip clock codes

// Function to be called when the countdown ends
function onTimerEnd() {
  // Retrieve the saved language from local storage or default to English
  const savedLanguage = localStorage.getItem("language") || "ENG";
  document.getElementById("body").innerHTML = trialOverMessages[savedLanguage]
}

var Flipper = (function () {
  function Flipper(node, currentTime, nextTime) {
    this.isFlipping = false;
    this.duration = 600;
    this.flipNode = node;
    this.frontNode = node.querySelector(".front");
    this.backNode = node.querySelector(".back");
    this.setFrontTime(currentTime);
    this.setBackTime(nextTime);
  }

  Flipper.prototype.setFrontTime = function (time) {
    this.frontNode.dataset.number = time;
  };

  Flipper.prototype.setBackTime = function (time) {
    this.backNode.dataset.number = time;
  };

  Flipper.prototype.flipDown = function (currentTime, nextTime) {
    var _this = this;

    if (this.isFlipping) {
      return false;
    }
    this.isFlipping = true;
    this.setFrontTime(currentTime);
    this.setBackTime(nextTime);
    this.flipNode.classList.add("running");
    setTimeout(function () {
      _this.flipNode.classList.remove("running");
      _this.isFlipping = false;
      _this.setFrontTime(nextTime);
    }, this.duration);
  };
  return Flipper;
})();

var getTimeFromSeconds = function (totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return {
    minutes: (minutes < 10 ? "0" : "") + minutes,
    seconds: (seconds < 10 ? "0" : "") + seconds,
  };
};

var flips = document.querySelectorAll(".flip");
var timer = 300; // 5 minutes in seconds

var updateFlippers = function () {
  var currentTime = getTimeFromSeconds(timer);
  var nextTime = getTimeFromSeconds(timer - 1);

  // Update minutes and seconds separately
  if (currentTime.minutes !== nextTime.minutes) {
    Flippers[0].flipDown(currentTime.minutes[0], nextTime.minutes[0]);
    Flippers[1].flipDown(currentTime.minutes[1], nextTime.minutes[1]);
  }
  Flippers[2].flipDown(currentTime.seconds[0], nextTime.seconds[0]);
  Flippers[3].flipDown(currentTime.seconds[1], nextTime.seconds[1]);

  if (timer > 0) {
    timer--;
  } else {
    clearInterval(countdown);
    onTimerEnd();
  }
};

var Flippers = Array.from(flips).map(function (flip, i) {
  return new Flipper(flip, "0", "0");
});

var countdown = setInterval(updateFlippers, 1000);

function hideCalculator() {
  document.getElementById("superCalculator").style.display = "none";
}

function showCalculator() {
  document.getElementById("superCalculator").style.display = "block";
}

function showDebtors() {
  document.getElementById("superContainer").style.display = "block";
}

function hideDebtors() {
  document.getElementById("superContainer").style.display = "none";
}

function showSettings() {
  document.getElementById("superSettings").style.display = "block";
}

function hideSettings() {
  document.getElementById("superSettings").style.display = "none";
}
