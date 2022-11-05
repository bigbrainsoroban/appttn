const userCardTemplate = document.querySelector("[data-user-template]");
const userCardContainer = document.querySelector("[data-user-cards-container]");
const searchInput = document.querySelector("[data-search]");
const filterSelected = document.querySelector("[data-filter]");
const checkSearch = document.getElementById("check-search");
const ghi_info = document.querySelector("[ghi-info]");
const clickCard = document.getElementsByClassName("fa-rotate-left");
const btnQr = document.getElementById("btnQr");
const reader = document.getElementById("reader");

// const token =
//   "IntcInVAWQiOmZhbHNlLCJ1c2VyX3ZlcmlmaV9tZXMiOiAzZXJcIjpcIkEgSGllcFwiLCBcInB3XCI6XCIyNTEwNjRcIiwgXCJleHBpcnlfZGF0ZVwiOlwiVGh1IE9jdCAyMCAyMDIyIDE5OjI5OjE2IEdNVCswNzAwIChHaT8gPz9uZyBEPz9uZylcIn0i";
// login first
const user = encodeURIComponent("A Hiep");
const pw = encodeURIComponent("251064");
const apiLogin =
  "https://script.google.com/macros/s/AKfycbycmTkUbfwdQVUAQwIvO7gFg1p-cZSs_0F2I3bEIJRyuTd13ZnYridmjpgisRs7kMld/exec?action=login&user=" +
  user +
  "&pw=" +
  pw;
// login lay token user luu vao localStorage
fetch(apiLogin)
  .then((res) => res.json()) //ra json Js bằng với Json Paste - Axios thì ko cần
  .then((data) => {
    //luu localStorage
    localStorage.setItem("userinfo", JSON.stringify(data));
  })
  .catch((error) => {
    console.log(error);
  });
const userinfo = JSON.parse(localStorage.getItem("userinfo"));
const token = userinfo.Token;
// const clickOnCard = document.querySelectorAll("card");
// back icon
// console.log(menuicon);
const backicon = document.getElementById("backicon");
const modalghi = document.getElementById("modalghi");
const menuside = document.getElementById("menu_side");
const menuicon = document.getElementById("menuicon");
const addIcon = document.getElementById("addIcon");
function backIcon() {
  modalghi.checked = false;
  ghi_info.classList.toggle("hide", false);
  // reader mở
  reader.classList.toggle("hide", false);
  resetmodal();
  search("all");
}
function menuSide() {
  menuside.checked = true;
}
function hidemenu() {
  menuicon.classList.toggle("hide");
}
function resetmodal() {
  // xóa phiếu cũ trên modal
  document.querySelector("[phieu]").textContent = "";
  // xóa ghi cũ tren modal
  document.querySelector("[ghi-cards-container]").textContent = "";
  // tắt form data
  document.querySelector("[formData]").textContent = "";
  // tắt backicon
  backicon.classList.toggle("hide");
  // mở lại addIcon
  addIcon.classList.toggle("hide", false);
  // ẩn info
  // ghi_info.classList.toggle("hide");
  // trả lại biến chặn hàm render ghi
  return (cancel = false);
}
//Array users response được xử lý đưa vào biến nhớ tạm users thay cho lưu trên local Storage
let users = [];
let ghidata = [];
let ghict = [];
let ghict_cards = [];

// biến dừng 1 hàm để hàm khác chạy
var cancel = false;
// menu hiện khi backicon tắt
// backicon.addEventListener("click", function () {
//   menuicon.classList.toggle("hide", false);
// });
checkSearch.addEventListener("change", function () {
  if (this.checked) {
    // tắt backicon
    backicon.classList.toggle("hide");
    menuicon.classList.toggle("hide");
  } else {
    backicon.classList.toggle("hide", false);
    menuicon.classList.toggle("hide", false);
  }
});
// set backicon hide
backicon.classList.toggle("hide");
// reset cancel mỗi lần đóng cửa số modal ghi - bấm vùng đen vẫn được-trừ trên phone
modalghi.addEventListener("change", function () {
  console.log(this.checked);
  if (!this.checked) {
    //modal ko check là bị tắt
    resetmodal();
  } else {
    //modal mở thì mở icon back
    backicon.classList.toggle("hide", false);
    // tắt addIcon
    addIcon.classList.toggle("hide");
    // chặn  ghict dữ liệu
    return (cancel = false);
  }
});

filterSelected.addEventListener("change", (e) => {
  // khóa của Filter Select là change
  const value = e.target.value.toLowerCase();
  // console.log(users);
  users.forEach((user) => {
    const isVisible = user.ap.toLowerCase().includes(value) | (value === "all");
    user.element.classList.toggle("hide", !isVisible);
  });
});

searchInput.addEventListener("input", (e) => {
  // console.log(e);
  //filer
  var valueFilter = filterSelected.value;
  // nhập
  const value = e.target.value.toLowerCase();
  //lọc ra trước
  userFilter = filteruser(valueFilter);
  // console.log(userFilter);
  userFilter.forEach((user) => {
    const isVisible =
      user.name.toLowerCase().includes(value) ||
      user.id.toLowerCase().includes(value);
    user.element.classList.toggle("hide", !isVisible);
  });
});
// hàm search
function search(val) {
  //filer
  var valueFilter = filterSelected.value;
  const value = val.toLowerCase();
  //lọc ra trước
  userFilter = filteruser(valueFilter);
  if (val !== "all") {
    userFilter.forEach((user) => {
      const isVisible =
        user.name.toLowerCase().includes(value) ||
        user.id.toLowerCase().includes(value);
      user.element.classList.toggle("hide", !isVisible);
    });
  } else {
    userFilter.forEach((user) => {
      user.element.classList.toggle("hide", false);
    });
  }
}
// light
//Test browser support
// const SUPPORTS_MEDIA_DEVICES = "mediaDevices" in navigator;

// if (SUPPORTS_MEDIA_DEVICES) {
//   //Get the environment camera (usually the second one)
//   navigator.mediaDevices.enumerateDevices().then((devices) => {
//     const cameras = devices.filter((device) => device.kind === "videoinput");

//     if (cameras.length === 0) {
//       throw "No camera found on this device.";
//     }
//     const camera = cameras[cameras.length - 1];

//     // Create stream and get video track
//     navigator.mediaDevices
//       .getUserMedia({
//         video: {
//           deviceId: camera.deviceId,
//           facingMode: ["user", "environment"],
//           height: { ideal: 1080 },
//           width: { ideal: 1920 },
//         },
//       })
//       .then((stream) => {
//         const track = stream.getVideoTracks()[0];

//         //Create image capture object and get camera capabilities
//         const imageCapture = new ImageCapture(track);
//         const photoCapabilities = imageCapture
//           .getPhotoCapabilities()
//           .then(() => {
//             //todo: check if camera has a torch

//             //let there be light!
//             const btn = document.querySelector(".switch");
//             btn.addEventListener("click", function () {
//               track.applyConstraints({
//                 advanced: [{ torch: true }],
//               });
//             });
//           });
//       });
//   });

//   //The light will be on as long the track exists
// }

// nút quét QR https://github.com/mebjas/html5-qrcode
// https://github.com/nimiq/qr-scanner
btnQr.addEventListener("click", (e) => {
  // ẩn info
  ghi_info.classList.toggle("hide");
  cancel = true;
  // reader mở
  reader.classList.toggle("hide", false);
  // document.querySelector(
  //   "[ghi-cards-container]"
  // ).innerHTML = `<div class="parent"><button class="switch">💡</button></div>`;
  // ).innerHTML = "CHào bạn";
});
// scan QR
// có của sổ, chọn ảnh - ko tự tắt camera khi quét xong
// function onScanSuccess(decodedText, decodedResult) {
//   // Handle on success condition with the decoded text or result.
//   console.log(`Scan result: ${decodedText}`, decodedResult);
//   val = decodedResult.decodedText.slice(-6, decodedResult.decodedText.length);
//   if (decodedResult.decodedText.length >= 6) {
//     modalghi.checked = false;
//   }
//   search(val);
// }
// function onScanFailure(error) {
//   // handle scan failure, usually better to ignore and keep scanning.
//   // for example:
//   console.warn(`Code scan error = ${error}`);
// }

// let html5QrcodeScanner = new Html5QrcodeScanner(
//   "reader",
//   { fps: 10, qrbox: { width: 250, height: 250 } },
//   /* verbose= */ false
// );
// html5QrcodeScanner.render(onScanSuccess, onScanFailure);
// mở camera sau- tự tắt camera
function scanQR() {
  const html5QrCode = new Html5Qrcode("reader");
  const qrCodeSuccessCallback = (decodedText, decodedResult) => {
    /* handle success */
    console.log(`Scan result: ${decodedText}`, decodedResult);
    val = decodedResult.decodedText.slice(-6, decodedResult.decodedText.length);
    if (decodedResult.decodedText.length >= 4) {
      html5QrCode
        .stop()
        .then((ignore) => {
          // QR Code scanning is stopped.
          modalghi.checked = false;
          search(val);
        })
        .catch((err) => {
          // Stop failed, handle it.
        });
    }
  };
  const config = { fps: 10, qrbox: { width: 250, height: 250 } };

  // If you want to prefer back camera
  html5QrCode.start(
    { facingMode: "environment" },
    config,
    qrCodeSuccessCallback
  );
}
// scan QR

// lick on card
// https://stackoverflow.com/questions/44185632/get-index-of-class-element-with-inline-onclick-pure-js-no-jquery
function getGhiOne() {
  var els = Array.prototype.slice.call(
    document.getElementsByClassName("card"),
    0
  );
  var index = els.indexOf(event.currentTarget);
  // console.log(index);
  var IDKH = users[index].id;
  var Name = users[index].name;
  var Ap = users[index].ap;
  // return IDKH;
  // console.log(IDKH);
  // ghi lại idkh len model để dùng cho các button bên ngoài
  document.querySelector("[whatid]").textContent = IDKH;
  // ghi_info hiện
  ghi_info.textContent = `🍀${IDKH} - 🧒🏽${Name} - 🏡${Ap}`;
  // hiện modal ghi - phải check điều kiện chạy hàm cancel để hàm khác ghi lên model-cho chạy chậm hơn 5ms
  setTimeout(() => {
    getGhiID(IDKH);
  }, 100);
  // mở backicon lên
  backicon.classList.toggle("hide", false);
  modalghi.checked = true;
  // tắt addIcon
  addIcon.classList.toggle("hide");
  // ghi_info.classList.toggle("hide", false);
  // reader tắt
  reader.classList.toggle("hide");
}
function getGhiID(IDKH) {
  //https://stackoverflow.com/questions/35817565/how-to-filter-array-when-object-key-value-is-in-array  - da xu ly blank ben api ko la se lay luon blank
  //sort a.RN-b.RN nho den lon, b.RN - a.RN lon toi nho, theo ABC a.name.localeCompare(b.name) -https://stackoverflow.com/questions/35576041/sort-json-by-value

  if (!cancel) {
    results = ghidata.filter((i) => IDKH.includes(i.IDKH));
    results.sort(function (a, b) {
      return b.RN - a.RN; //firstnew
    });
    console.log(results);
    ghict_cards = results.map((result) => {
      //map ra từng dòng và đẩy vào ar results
      return renderghiId(result);
    });
  }
}

// function renderghiId(results) {
//   // const ghi = document.querySelector("[data-ghi]");
//   // ghi.textContent = result.IDCS;
//   let element = `<tr>
//   <th>ID</th>
//   <th>CSM</th></tr>`;
//   results.map((value) => {
//     element += `<tr><td>${value.IDCS}</td><td>${value.CSM}</td></tr>`;
//   });
//   document.querySelector("[data-ghi]").innerHTML = element;
// }
function renderghiId(result) {
  const ghi_cards_container = document.querySelector("[ghi-cards-container]");
  const ghi_card_template = document.querySelector("[ghi-card-template]");
  const cardG = ghi_card_template.content.cloneNode(true).children[0];
  const ghi_header_left = cardG.querySelector("[ghi-header_left]");
  const ghi_header_right = cardG.querySelector("[ghi-header_right]");
  const ghi_body = cardG.querySelector("[ghi-body]");

  ghi_header_left.textContent = new Date(result.DW).toLocaleDateString("en-GB");
  ghi_header_right.textContent = result.MoRecei.toLocaleString("en");
  function checknote() {
    if (result.Note !== "") {
      var maintenance = `Bảo trì: 🛠️ ${result.Note} 📢 ${result.TTXL}`;
    } else {
      var maintenance = "";
    }
    return maintenance;
  }
  if ((result.Owe < 0) & (result.T4 !== "Đã TT")) {
    ghi_header_left.setAttribute("style", " color: rgb(209, 22, 22);");
  }
  ghi_body.setAttribute("style", "white-space: pre;"); //có cái này mới xuống hàng trong .textContent
  ghi_body.textContent +=
    "⏲️" +
    result.CSM.toLocaleString("en") +
    "🕰️" +
    result.CSC.toLocaleString("en") +
    "💦" +
    result.Num.toLocaleString("en") +
    "💲" +
    result.Money.toLocaleString("en") +
    "💸" +
    result.Owe.toLocaleString("en") +
    "\n";
  ghi_body.textContent +=
    "🐣" +
    result.T4 +
    "⏳" +
    new Date(result.DT).toLocaleString("en-GB").slice(0, -3) +
    "👮🏽‍♂️" +
    result.Staff +
    "\n";
  ghi_body.textContent += checknote();

  ghi_cards_container.append(cardG);

  return {
    IDCS: result.IDCS,
    owe: result.Owe,
    tt: result.T4,
    element: cardG,
  }; //chứa giá trị tìm kiếm trong CardContainer
}
// APIs

// get data All sheet query
const apiGetAllData =
  "https://script.google.com/macros/s/AKfycbwYk087R2oQDH2VB20gNS6GLANflXYtdk1ufxfh-UNuOZ2il3ypUC8yZRXFMFCe8BIr2Q/exec?action=getdataAll&token=" +
  token;
// get data theo ap sheet query
const apigetDataAp =
  "https://script.google.com/macros/s/AKfycbwYk087R2oQDH2VB20gNS6GLANflXYtdk1ufxfh-UNuOZ2il3ypUC8yZRXFMFCe8BIr2Q/exec?action=getDataAp&token=" +
  token +
  "&ap=";
// get ghi all sheet main
const apigetGhiAll =
  "https://script.google.com/macros/s/AKfycbycmTkUbfwdQVUAQwIvO7gFg1p-cZSs_0F2I3bEIJRyuTd13ZnYridmjpgisRs7kMld/exec?action=getghiAll&token=" +
  token;
// get ghi theo ap sheet main
const apigetGhiAp =
  "https://script.google.com/macros/s/AKfycbycmTkUbfwdQVUAQwIvO7gFg1p-cZSs_0F2I3bEIJRyuTd13ZnYridmjpgisRs7kMld/exec?action=getghiAp&token=" +
  token +
  "ap=";
// get data TH theo ID sheet main
const apigetdataID =
  "https://script.google.com/macros/s/AKfycbycmTkUbfwdQVUAQwIvO7gFg1p-cZSs_0F2I3bEIJRyuTd13ZnYridmjpgisRs7kMld/exec?action=getdataID&token=" +
  token +
  "id=";

// lấy dữ liệu về - xử lý bất đồng bộ
fetch(apiGetAllData)
  .then((res) => res.json()) //ra json Js bằng với Json Paste - Axios thì ko cần
  .then((data) => {
    //xử lý data trả về dạng json
    users = data.map((user) => {
      //map ra từng dòng và đẩy vào ar users
      return renderDataAll(user);
    });
    renderListAp(data);
  })
  .catch((error) => {
    console.log(error);
  });
// lấy data ghi -  - lưu vào nhớ tạm  ghidata[]
fetch(apigetGhiAll)
  .then((res) => res.json()) //ra json Js bằng với Json Paste - Axios thì ko cần
  .then((data) => {
    //xử lý data trả về dạng json - lưu vào nhớ tạm []
    ghidata = data;
  })
  .catch((error) => {
    console.log(error);
  });
// lấy data đồng bộ - https://stackoverflow.com/questions/66635290/how-to-wait-for-multiple-fetches-to-complete-in-javascript

// const fetchData = async () => {
//   try {
//     const [respTodoOne, respTodoTwo] = await Promise.all([
//       fetch(apiGetAllData),
//       fetch(apigetGhiAll),
//     ]);
//     const todoOne = await respTodoOne.json();
//     const todoTwo = await respTodoTwo.json();
//     console.log(todoOne, "todoOne");
//     console.log(todoTwo, "todoTwo");
//   } catch (err) {
//     throw err;
//   }
// };
// fetchData();

// FUNCTION

function filteruser(valueFilter) {
  //https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
  // let difference = users.filter((x) => !userFilter.includes(x));
  // console.log(difference);
  if (valueFilter !== "all") {
    var userFilter = users.filter((user) => {
      return user.ap.toLowerCase().includes(valueFilter.toLowerCase()); //return filter
    });
  } else {
    var userFilter = users;
  }
  return userFilter;
}
//Render
function renderDataAll(user) {
  //Check date
  function monthRecent() {
    if (user.RecentMon === "") {
      month = "-";
    } else {
      month = new Date(user.RecentMon).toLocaleDateString("en-GB"); //requires the date is emty is String cannot converted to date
    }
    return month;
  }
  // https://stackoverflow.com/questions/21311299/nodevalue-vs-innerhtml-and-textcontent-how-to-choose
  const card = userCardTemplate.content.cloneNode(true).children[0];
  // console.log(card);
  const header_id = card.querySelector("[data-header_id]");
  const header_id_left = card.querySelector("[data-header_id-left]");
  const header_id_right = card.querySelector("[data-header_id-right]");
  const header_date_left = card.querySelector("[data-header_date-left]");
  const header_date_right = card.querySelector("[data-header_date-right]");
  const header_info_left = card.querySelector("[data-header_info-left]");
  const header_info_right = card.querySelector("[data-header_info-right]");
  // const header = card.querySelector("[data-header]");
  const body = card.querySelector("[data-body]");
  header_id_left.textContent = user.IDKH;
  header_id_right.textContent = user.Name;
  header_date_left.textContent = monthRecent();
  header_date_right.textContent = user.Hamlet;
  header_info_left.textContent = user.Pack + " - " + user.Add;
  header_info_right.textContent = user.Phone + "📞";
  // Change color when negative
  if (user.Owe < 0) {
    header_id.setAttribute("style", " color: rgb(209, 22, 22);");
  }
  body.setAttribute("style", "white-space: pre;"); //có cái này mới xuống hàng trong .textContent
  body.textContent +=
    "🏠Tổng: " +
    user.Toltal.toLocaleString("en") +
    " m³" +
    "💦Trung bình: " +
    user.Average.toLocaleString("en") +
    " m³/th" +
    "\n";
  // body.textContent +=
  //   "💦Trung bình: " + user.Average.toLocaleString("en") + " m³/th" + "\n";
  body.textContent +=
    "🕖 Kỳ trước: " +
    user.LastNum.toLocaleString("en") +
    "💸 Dư nợ: " +
    user.Owe.toLocaleString("en") +
    "\n";
  // body.textContent += "💸 Dư nợ: " + user.Owe.toLocaleString("en") + "\n";
  userCardContainer.append(card);
  return {
    name: user.Name,
    id: user.IDKH,
    ap: user.Hamlet,
    phone: user.Phone,
    pack: user.Pack,
    add: user.Add,
    owe: user.Owe,
    total: user.Toltal * 1,
    month: user.RecentMon,
    element: card,
  }; //chứa giá trị tìm kiếm trong CardContainer
}

function renderListAp(data) {
  //HAMLET DROPDOWNS
  // for (var i = 0; i < data.length; i++) {
  //   var long = data[i].Hamlet;
  //   // console.log(long);
  // }
  // Lấy value theo key trong từng Object thành {key1[val1,val2], key2[val1,val2]...} https://stackoverflow.com/questions/66528745/loop-through-multiple-objects-and-get-similar-key-values-in-new-object
  const result = data.reduce(
    (acc, o) => (
      Object.keys(o).forEach((k) => (acc[k] ??= []).push(o[k])), acc
    ),
    {}
  );
  // console.log(result.Hamlet);
  // console.log(uniqueArray4(result.Hamlet));
  values = uniqueArray4(result.Hamlet);
  countryDropDown(uniqueArray4(values));
}

//RENDER HAMLET DROPDOWNS
function countryDropDown(values) {
  //Ref: https://stackoverflow.com/a/53771955/2391195
  var list = document.getElementById("hamlet");
  for (var i = 0; i < values.length; i++) {
    var option = document.createElement("option");
    option.value = values[i];
    option.text = values[i];
    list.appendChild(option);
  }
}

function ascending() {
  //filer
  var valueFilter = filterSelected.value;
  //lọc ra trước
  userFilter = filteruser(valueFilter);
  let valueSort = document.getElementById("sort").value;
  sorted = userFilter.sort((a, b) => {
    if (valueSort === "owe-most") {
      return a.owe - b.owe;
    } else if (valueSort === "used-most") {
      return b.total - a.total;
    } else if (valueSort === "older") {
      return new Date(a.month) - new Date(b.month);
    } else {
      return a.id.substring(2, 6) - b.id.substring(2, 6);
    }
  });
  console.log(sorted);
  sorted.forEach((user) => {
    const isVisible = user.name.includes(user.name); //dk luôn đúng
    user.element.classList.toggle("hide", !isVisible);
    console.log(isVisible);
  });
}
// clear search by uncheck
function clearnSearch() {
  if (checkSearch.checked) {
    //checked la close
    document.getElementById("search").value = "";
    // tự động hiện lại danh sách
    var valueFilter = filterSelected.value;
    userFilter = filteruser(valueFilter);
    userFilter.forEach((user) => {
      const isVisible = user.name.includes(user.name); //dk luôn đúng
      user.element.classList.toggle("hide", !isVisible);
    });
  }
}
//Helper
function test() {
  // const x = document.getElementsByClassName("header-id-left")[1].innerHTML; //[1] lay index 1 trong array class giống nhau
  // console.log(x);
  console.log(ghict_cards);
}
const typeOf = (value) => Object.prototype.toString.call(value).slice(8, -1); //tạo hàm check date
//lấy - Lọc dữ liệu từ data - render ra drop list Ap
//UNIQUE https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
function uniqueArray4(a) {
  ar = [...new Set(a)];
  // remove blank el !="", el != null, undefined https://stackoverflow.com/questions/281264/remove-empty-elements-from-an-array-in-javascript  - da xu ly blank ben api
  var filtered = ar.filter(function (el) {
    return el != "";
  });
  return filtered;
}
//GET GHI CS JSON - ham fetch khong long ham thi no se chay luon

// alert(this.innerHTML);
// in only model
// https://stackoverflow.com/questions/10493215/page-print-in-javascript
function printBill(IDCS) {
  resetmodal();
  // tắt addIcon
  addIcon.classList.toggle("hide");
  addIcon.classList.toggle("hide");
  cancel = true;
  // ghi_info.setAttribute("style", "display: none;");
  setTimeout(() => {
    // vì IDKH ghi từ div Card vào class whatid cần thời gian
    var IDKH = document.querySelector("[whatid]").textContent;
    console.log(IDKH);
    // lấy info name ap từ users card
    var userFilter = users.filter((user) => {
      return user.id.includes(IDKH); //return filter
    });
    var name = userFilter[0].name;
    var ap = userFilter[0].ap;
    //info phieu thu dataghi
    results = ghidata.filter((i) => IDKH.includes(i.IDKH));
    results.sort(function (a, b) {
      return b.RN - a.RN; //firstnew
    });
    console.log(results);
    // chi tiet no https://stackoverflow.com/questions/53967165/how-to-render-array-of-object-in-html-element-using-javascript-using-map-functio

    oweDetail = results.filter((i) => i.Owe < 0 && i.T4 !== "Đã TT");
    console.log(oweDetail);
    if (oweDetail.length > 0) {
      OweDetail =
        "<p>Tháng cũ còn nợ</p>" +
        oweDetail
          .map(
            (i) =>
              `<p>${new Date(i.DW)
                .toLocaleDateString("en-GB")
                .substring(3)} : ${i.Owe.toLocaleString("en")}</p>`
          )
          .join("") +
        "<hr />"; //.join sẽ làm mất dấu , trong array [] ,map sẽ ra array [a,b,c]
      console.log(OweDetail);
    } else {
      OweDetail = "";
    }

    // chi tiet no
    // Chỗ này ko trả là [0] liền vì lệnh print dùng chung cho các tháng khác
    var IDCS = results[0].IDCS; //last month
    // var IDCS = "7ee05d56";
    // console.log(results.indexOf(IDCS, results.indexOf(IDCS) - 1));
    var rowghi = results.filter((row) => {
      return row.IDCS.includes(IDCS); //return filter
    });

    var ph = rowghi[0];
    var DW = new Date(ph.DW).toLocaleDateString("en-GB");
    var Ky = new Date(ph.DW).toLocaleDateString("en-GB").substring(3);
    var MonBef = new Date(results[1].DW).toLocaleDateString("en-GB");
    var d1 = new Date(results[1].DW);
    var d2 = new Date(ph.DW);
    var songay =
      getDateDifference(d1, d2).years +
      "n-" +
      getDateDifference(d1, d2).months +
      "th-" +
      getDateDifference(d1, d2).days +
      " ngày";
    var CSM = ph.CSM.toLocaleString("en");
    var CSC = ph.CSC.toLocaleString("en");
    var Num = (ph.CSM - ph.CSC).toLocaleString("en");
    var Money = ph.Money.toLocaleString("en");
    var Thue = (0.05 * ph.Money).toLocaleString("en");
    var Phi = (0.1 * ph.Money).toLocaleString("en");
    var docTien = new DocTienBangChu();

    var datecr = new Date().toLocaleString("en-GB").slice(0, -3);
    var Staff = ph.Staff;
    var Note = ph.Note;
    var Owe = 0;
    for (var i = 0, l = results.length; i < l; i++) {
      Owe += parseInt(results[i].Owe);
    }
    if (Owe < 0) {
      var owe = Math.abs(Owe).toLocaleString("en");
      var sotien = docTien.doc(Math.abs(Owe));
      var vnd = "VNĐ";
    } else {
      var owe = "Không thu";
      var sotien = "";
      var vnd = "";
    }

    let element = `<div id="bill" class = "bill">
  <div class="container">
    <div class="k57">
      <h1>DNTN CẤP NƯỚC HỮU HÒA<br>
        <i style="font-weight: normal; font-size: 12px">Hữu Đạo-Châu Thành-Tiền Giang</i><br>
        Hotline: 0903541722<br>
        ---------***---------
      </h1>
      <h2>PHIẾU NƯỚC</h2>
      <p align="center">Kỳ: ${Ky}</p>
      <div style="margin: -8px auto;">
      <img src='https://chart.googleapis.com/chart?cht=qr&chs=104x104&chld=M%7C0&chl=https://capnuochuuhoa.saku.vn/?search=${IDKH}' style="margin: -8px auto; display: flex;">
      </div>
      <p align="center" style="font-size: 11px; margin-top: 11px;">Quét QR bằng Zalo tra cứu-chuyển tiền</p>
      <p>Mã KH : ${IDKH}</p>
      <b>Tên KH : ${name}</b>
      <p>Ấp : ${ap}</p>
      <hr />
      <p>Đến: <i>${DW}</i> Từ: <i>${MonBef}</i></p>
      <p style="margin-bottom: -5px;">Số mới : <b>${CSM}</b>
         Số cũ : <b>${CSC}</b></p>
      <p>Tiêu thụ: <b>${Num}</b> m<sup>3</sup><i  style="font-size: 11px;">${songay}</i></p>
      <p style="font-size: 11px; margin: -2px auto;">Thuế 5%: <i>${Thue}</i>  Phí MT 10%: <i>${Phi}</i> </p>
      <p>Tổng tiền : <b>${Money}</b> (VNĐ)</p>
      <hr />
      <!-- Phần chi tiết nợ -->
      <div style=" margin-top: -3px; margin-bottom: -10px;">
       <div >${OweDetail}</div>
      </div>
      <!-- Phần chi tiết nợ -->
      <p style="margin-top: 17px; margin-bottom: 7px;">Tổng tiền thu bao gồm dư nợ :</p>
              <p class="rcorner" align="center" style="font-size: 14px; margin-bottom: 3px;" ><b>${owe}</b><i> ${vnd}</i></p>
              <p style="margin: auto;"><i style="line-height: 1.2;">${sotien}</i></p>
      <hr />
      <p>Ngày tạo: ${datecr}</p>
      <p><i>NV: ${Staff}</i> ☏ <i>${userinfo.user_phone}</i></p>
      <p>Ghi chú: ${Note}</p>
      <hr />
      <p align="center"><i>**Chân thành cảm ơn quý khách**</i></p>
      <hr />
      <button class="fa fa-print"  onclick="printpage()"></button>
      <link rel="stylesheet" type="text/css" href="stylesbill.css">
    </div>
  </div>
</div>`;
    document.querySelector("[phieu]").innerHTML = element;
  }, 50);
  // mở backicon lên
  backicon.classList.toggle("hide", false);
  // tắt info
  ghi_info.classList.toggle("hide");
  // reader tắt
  reader.classList.toggle("hide");
  // trùng lệnh chạy 2 lần
  reader.classList.toggle("hide");
  return cancel; //div stop render ghiCS
}
function printpage() {
  // window.print();
  PrintContent();
  modalghi.checked = false;
  // set backicon hide
  backicon.classList.toggle("hide");
  // reader tắt
  reader.classList.toggle("hide");
}
// tạo windown mới chỉ chứa nội dung in có head body
function PrintContent() {
  var DocumentContainer = document.getElementById("phieu");
  var WindowObject = window.open(
    "",
    "PrintWindow",
    "width=1200,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes"
  );
  WindowObject.document.write("<html><head><title>Printwindow</title>");
  // WindowObject.document.write('<link rel="stylesheet" href="stylesbill.css">'); //css ở đây Modal ko nhận - chỉ nhận trên Printwindown - css trên thân là tốt nhất
  WindowObject.document.write(
    '</head><body onload=" window.print()" onfocus="setTimeout(function () {window.close()},1000)">'
  );
  WindowObject.document.writeln(DocumentContainer.innerHTML);
  WindowObject.document.write("</body></html>");
  WindowObject.document.close();
  // set ở đây sẽ ko in được được phone
  // setTimeout(function () {
  //   WindowObject.focus();
  //   WindowObject.print();
  //   WindowObject.close();
  // }, 1000);
}
function formData_addNew() {
  // ẩn ghi info
  ghi_info.classList.toggle("hide");
  cancel = true;
  // tắt addIcon
  addIcon.classList.toggle("hide"); // tắt addIcon
  addIcon.classList.toggle("hide");
  console.log("formData");
  // setTimeout(() => {
  let element = `<div class="container_form">
  <form action="/action_page.php">
    <div class="row_form">
      <div class="col-35">
        <label for="idkh">IDKH</label>
      </div>
      <div class="col-65">
        <input type="text" id="idkh" name="idkh" placeholder="IDKH">
      </div>
    </div>
    <div class="row_form">
      <div class="col-35">
        <label for="name">Tên</label>
      </div>
      <div class="col-65">
        <input type="text" id="name" name="name" placeholder="Tên khách hàng..">
      </div>
    </div>
    <div class="row_form">
    <div class="col-35">
      <label for="ap">Ấp</label>
    </div>
    <div class="col-65">
      <select id="hamlet" name="hamlet">
        <option value="Hữu Hòa">Hữu Hòa</option>
        <option value="Hữu Bình">Hữu Bình</option>
        <option value="Hữu Thuận">Hữu Thuận</option>
        <option value="Hữu Lợi">Hữu Lợi</option>
        <option value="Cây Bàng">Cây Bàng</option>
      </select>
    </div>
  </div>
  <div class="row_form">
  <div class="col-35">
    <label for="pack">Gói nước</label>
  </div>
  <div class="col-65">
    <select id="pack" name="pack">
      <option value="SH">SH</option>
      <option value="SX">SX</option>
      <option value="KD">KD</option>
      <option value="HCSN">HCSN</option>
    </select>
  </div>
</div>
    <div class="row_form">
    <div class="col-35">
      <label for="address">Địa chỉ</label>
    </div>
    <div class="col-65">
      <input type="text" id="address" name="address" placeholder="Địa chỉ..">
    </div>
  </div>
  <div class="row_form">
  <div class="col-35">
    <label for="phone">Số điện thoại</label>
  </div>
  <div class="col-65">
    <input type="text" id="phone" name="phone" pattern="(09|03|07|08|05)+([0-9]{8})" placeholder="Số điện thoại..">
  </div>
</div>

    <div class="row_form">
      <input type="submit" value="Lưu">
    </div>
  </form>
</div>`;
  document.querySelector("[formData]").innerHTML = element;
  // }, 5);
}
function formData_edit() {
  // resetmodal();
  cancel = true;
  // tắt addIcon
  addIcon.classList.toggle("hide"); // tắt addIcon
  addIcon.classList.toggle("hide");
  console.log("formData");
  // lấy data to edit
  // vì IDKH ghi từ div Card vào class whatid cần thời gian
  setTimeout(() => {
    var IDKH = document.querySelector("[whatid]").textContent;
    console.log(IDKH);
    // lấy info name ap từ users card
    var userFilter = users.filter((user) => {
      return user.id.includes(IDKH); //return filter
    });
    console.log(userFilter);
    var name = userFilter[0].name;
    var ap = userFilter[0].ap;
    var pack = userFilter[0].pack;
    var phone = userFilter[0].phone;
    var add = userFilter[0].add;
    let element = `<div class="container_form">
  <form action="/action_page.php">
    <div class="row_form">
      <div class="col-35">
        <label for="idkh">IDKH</label>
      </div>
      <div class="col-65">
        <input type="text" id="idkh" name="idkh" placeholder="IDKH">
      </div>
    </div>
    <div class="row_form">
      <div class="col-35">
        <label for="name">Tên</label>
      </div>
      <div class="col-65">
        <input type="text" id="name" name="name" placeholder="Tên khách hàng..">
      </div>
    </div>
    <div class="row_form">
    <div class="col-35">
      <label for="ap">Ấp</label>
    </div>
    <div class="col-65">
      <select id="hamletF" name="hamletF">
        <option value="Hữu Hòa">Hữu Hòa</option>
        <option value="Hữu Bình">Hữu Bình</option>
        <option value="Hữu Thuận">Hữu Thuận</option>
        <option value="Hữu Lợi">Hữu Lợi</option>
        <option value="Cây Bàng">Cây Bàng</option>
      </select>
    </div>
  </div>
  <div class="row_form">
  <div class="col-35">
    <label for="pack">Gói nước</label>
  </div>
  <div class="col-65">
    <select id="packF" name="packF">
      <option value="SH">SH</option>
      <option value="SX">SX</option>
      <option value="KD">KD</option>
      <option value="HCSN">HCSN</option>
    </select>
  </div>
</div>
    <div class="row_form">
    <div class="col-35">
      <label for="address">Địa chỉ</label>
    </div>
    <div class="col-65">
      <input type="text" id="address" name="address" placeholder="Địa chỉ..">
    </div>
  </div>
  <div class="row_form">
  <div class="col-35">
    <label for="phone">Số điện thoại</label>
  </div>
  <div class="col-65">
    <input type="text" id="phone" name="phone" pattern="(09|03|07|08|05)+([0-9]{8})"  placeholder="Số điện thoại..">
  </div>
</div>

    <div class="row_form">
      <input type="submit" value="Lưu">
    </div>
  </form>
</div>`;
    document.querySelector("[formData]").innerHTML = element;
    // set date edit
    document.querySelector('input[name="idkh"]').value = IDKH;
    document.querySelector('input[name="name"]').value = name;
    // document.getElementById("hamletF").value = "Cây Bàng";
    document.querySelector('select[name="hamletF"]').value = ap;
    document.querySelector('select[name="packF"]').value = pack;
    document.querySelector('input[name="address"]').value = add;
    document.querySelector('input[name="phone"]').value = phone;
  }, 50);
}
function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
// NumberFormat object https://stackoverflow.com/questions/71028035/add-thousand-separator-with-javascript-when-add-input-dynamically

function formGhi_new() {
  // resetmodal();
  cancel = true;
  // tắt addIcon
  addIcon.classList.toggle("hide"); // tắt addIcon
  addIcon.classList.toggle("hide");
  console.log("formData");
  // lấy data to edit
  // vì IDKH ghi từ div Card vào class whatid cần thời gian
  setTimeout(() => {
    var IDKH = document.querySelector("[whatid]").textContent;
    console.log(IDKH);
    // lấy info name ap từ users card
    var userFilter = users.filter((user) => {
      return user.id.includes(IDKH); //return filter
    });
    console.log(userFilter);
    //info phieu thu dataghi
    results = ghidata.filter((i) => IDKH.includes(i.IDKH));
    results.sort(function (a, b) {
      return b.RN - a.RN; //firstnew
    });
    console.log(results);

    var ap = userFilter[0].ap;
    var pack = userFilter[0].pack;

    // price  https://stackoverflow.com/questions/69091869/how-to-filter-an-array-in-array-of-objects-in-javascript
    // Find price
    var userinfo = JSON.parse(localStorage.getItem("userinfo"));
    var price = userinfo.price;
    for (let i = 0; i < price.length; i++) {
      // console.log(price[i]);
      if (price[i][0] === pack) {
        var row = i;
      }
    }
    // console.log(price[row][2]);
    // Find price
    // Averge Num
    var m3 = 0;
    for (let i = 0; i < results.length; i++) {
      // console.log(results[i].Num);
      m3 += results[i].Num;
    }
    // console.log(m3);
    var avergeM3 = parseInt(m3 / results.length);
    // console.log(avergeM3);
    var CSC = results[0].CSM;
    var CSM = results[0].CSM + avergeM3;
    var NumG = CSM - CSC;
    var priceWater = price[row][2];
    var MoneyG = NumG * priceWater;
    var today = new Date().toDateString("en-CA");

    // yyyy-mm-dd mới input được
    var date = formatDate(today);
    let element = `<div class="container_form">
  <form action="/action_page.php">
    <div class="row_form">
      <div class="col-35">
        <label for="idcs">IDCS</label>
      </div>
      <div class="col-65">
        <input type="text" id="idcs" name="idcs" placeholder="IDCS">
      </div>
    </div>
    <div class="row_form">
      <div class="col-35">
        <label for="name">Ngày ghi</label>
      </div>
      <div class="col-65">
        <input type="date" id="dateG" name="dateG" placeholder="15/11/1988">
      </div>
    </div>
    <div class="row_form">
      <div class="col-35">
        <label for="name">CSM</label>
      </div>
      <div class="col-65">
        <input type="text" id="CSM" name="number" placeholder="CSM" value="${CSM.toLocaleString(
          "en"
        )}" step="1">
      </div>
    </div>
    <div class="row_form">
      <div class="col-35">
        <label for="name">CSC</label>
      </div>
      <div class="col-65" lang="en-US">
        <input type="text" id="CSC" name="number" placeholder="CSC" value="${CSC.toLocaleString(
          "en"
        )}" step="1">
      </div>
    </div>
    <div class="row_form">
    <div class="col-35">
      <label for="name">Số khối</label>
    </div>
    <div class="col-65">
      <input type="text" id="NumG" name="number" pattern="[0-9,]*" placeholder="Số khối">
    </div>
  </div>
  <div class="row_form">
    <div class="col-35">
      <label for="name">Thành tiền</label>
    </div>
    <div class="col-65">
    <p id= "priceWater"  style="display: none;" >${priceWater}</p>
      <input type="text" id="MoneyG" name="number" placeholder="Số tiền">
    </div>
  </div>

  <div class="row_form">
  <div class="col-35">
    <label for="pack">Ghi chú</label>
  </div>
  <div class="col-65">
    <select id="NoteG" name="NoteG">
    <option value=""></option>
      <option value="SH">SH</option>
      <option value="SX">SX</option>
      <option value="KD">KD</option>
      <option value="HCSN">HCSN</option>
    </select>
  </div>
</div>
<div class="row_form" id="TTXLG">
<div class="col-35">
  <label for="pack">TT Xử lý</label>
</div>
<div class="col-65" >
  <p id="ttxl" name="ttxl">
  <label class = "check"><input type="checkbox" class="radio" name="check" onclick="onlyOne(this)" value="Đã XL"><span>Đã XL</span></label>
  <label class = "check"><input type="checkbox" class="radio" name="check" onclick="onlyOne(this)" value="Chưa XL"><span>Chưa XL</span></label>
  </p>
</div>
</div>

    <div class="row_form">
      <input type="submit" value="Lưu">
    </div>
  </form>
</div>`;
    // số khối không âm, có dấu , [0-9,]* - chuỗi từ 0-9 và , * tìm lập lại ok https://xuanthulab.net/bieu-thuc-chinh-quy-regexp.html
    // select by buttons https://stackoverflow.com/questions/52707749/how-can-i-display-select-options-as-buttons
    // https://stackoverflow.com/questions/9709209/html-select-only-one-checkbox-in-a-group

    document.querySelector("[formData]").innerHTML = element;
    // set date edit
    document.querySelector('input[id="idcs"]').value = IDKH;
    document.querySelector('input[id="dateG"]').value = date;
    // console.log(document.querySelector('input[name="dateG"]'));

    // document.getElementById("hamletF").value = "Cây Bàng";
    // document.querySelector('input[name="CSM"]').value = CSM;
    // document.querySelector('input[name="CSC"]').value = CSC;
    document.querySelector('input[id="NumG"]').value =
      NumG.toLocaleString("en");
    document.querySelector('input[id="MoneyG"]').value =
      MoneyG.toLocaleString("en");
    document.querySelector('select[id="NoteG"]').value = "";
    TTXLG.classList.toggle("hide");
  }, 50);
  // onchane comma
  setTimeout(() => {
    // https://stackoverflow.com/questions/32966869/how-to-target-all-inputs-on-the-page
    // comma input number https://stackoverflow.com/questions/71028035/add-thousand-separator-with-javascript-when-add-input-dynamically  https://codepen.io/tsunet111/pen/GbpwZa
    // https://codepen.io/559wade/pen/LRzEjj
    var priceWater = document.getElementById("priceWater");
    var allNumberInputs = document.querySelectorAll('input[name="number"]');
    console.log(allNumberInputs);
    // Listen for input event on numInput.
    for (var i = 0; i < allNumberInputs.length; i++) {
      allNumberInputs[i].addEventListener(`input`, function (event) {
        // Current string value of the input
        const value = this.value;

        // Split the value string into an array on each decimal and
        // count the number of elements in the array
        const decimalCount = value.split(`.`).length - 1;

        // Don't do anything if a first decimal is entered
        if (event.key === `.` && decimalCount === 1) return;

        // Remove any commas from the string and convert to a float
        // This will remove any non digit characters and second decimals
        const numericVal = parseFloat(value.replace(/,/g, ""));

        //NumberFormat options
        const options = {
          style: `decimal`,
          maximumFractionDigits: 20,
        };

        // Assign the formatted number to the input box

        if (this.value !== "") {
          this.value = new Intl.NumberFormat(`en-US`, options).format(
            numericVal
          );
        }
        // onchane số khối thành tiền
        var NumG = document.querySelector('input[id="NumG"]');
        var MoneyG = document.querySelector('input[id="MoneyG"]');

        var CSM = document.querySelector('input[id="CSM"]');
        var CSC = document.querySelector('input[id="CSC"]');
        // console.log(NumG);
        // console.log(texttonumber(CSM.value));
        // console.log(texttonumber(CSC.value));
        // console.log(priceWater.innerText);
        var CSMv = texttonumber(CSM.value);
        var CSCv = texttonumber(CSC.value);
        var pricewater = priceWater.innerText;
        NumG.value = (CSMv - CSCv).toLocaleString("en");
        MoneyG.value = ((CSMv - CSCv) * pricewater).toLocaleString("en");
      });
    }
    // onchange Note
    var noteG = document.querySelector('select[id="NoteG"]');
    var TTXLG = document.getElementById("TTXLG");
    noteG.addEventListener(`change`, function (event) {
      console.log(noteG.value);
      if (noteG.value !== "") {
        TTXLG.classList.toggle("hide", false);
      } else {
        TTXLG.classList.toggle("hide");
      }
    });
  }, 500);
}
// only checkbox one
function onlyOne(checkbox) {
  var checkboxes = document.getElementsByName("check");
  checkboxes.forEach((item) => {
    if (item !== checkbox) item.checked = false;
  });
}
// text to number
// https://stackoverflow.com/questions/5788741/remove-commas-from-the-string-using-javascript
// https://stackoverflow.com/questions/36817120/javascript-remove-fullstop-comma-and-spaces-from-a-string
// remove , và space giữ .
function texttonumber(text) {
  // var text = "454562 3452,4456,456.54";
  var regex = /[,\s]/g; // /[.,\s]/g - nếu remove thêm dấu .
  var result = text.replace(regex, "");
  // console.log(result);
  return result;
}
//  Date diff
function getDateDifference(startDate, endDate) {
  if (startDate > endDate) {
    console.error("Start date must be before end date");
    return null;
  }
  var startYear = startDate.getFullYear();
  var startMonth = startDate.getMonth();
  var startDay = startDate.getDate();

  var endYear = endDate.getFullYear();
  var endMonth = endDate.getMonth();
  var endDay = endDate.getDate();

  // We calculate February based on end year as it might be a leep year which might influence the number of days.
  var february =
    (endYear % 4 == 0 && endYear % 100 != 0) || endYear % 400 == 0 ? 29 : 28;
  var daysOfMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  var startDateNotPassedInEndYear =
    endMonth < startMonth || (endMonth == startMonth && endDay < startDay);
  var years = endYear - startYear - (startDateNotPassedInEndYear ? 1 : 0);

  var months = (12 + endMonth - startMonth - (endDay < startDay ? 1 : 0)) % 12;

  // (12 + ...) % 12 makes sure index is always between 0 and 11
  var days =
    startDay <= endDay
      ? endDay - startDay
      : daysOfMonth[(12 + endMonth - 1) % 12] - startDay + endDay;

  return {
    years: years,
    months: months,
    days: days,
  };
}
//  Date diff
