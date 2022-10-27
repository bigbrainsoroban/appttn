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
  // tắt backicon
  backicon.classList.toggle("hide");
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
// nút quét QR https://github.com/mebjas/html5-qrcode
btnQr.addEventListener("click", (e) => {
  // ẩn info
  ghi_info.classList.toggle("hide");
  cancel = true;
  // reader mở
  reader.classList.toggle("hide", false);
  document.querySelector(
    "[ghi-cards-container]"
  ).innerHTML = `<div style="width: 500px" id="reader"></div>`;
  // ).innerHTML = "CHào bạn";
});
// scan QR
function onScanSuccess(decodedText, decodedResult) {
  // Handle on success condition with the decoded text or result.
  console.log(`Scan result: ${decodedText}`, decodedResult);
  val = decodedResult.decodedText.slice(-6, decodedResult.decodedText.length);
  if (decodedResult.decodedText.length >= 6) {
    modalghi.checked = false;
  }
  search(val);
  
}
function onScanFailure(error) {
  // handle scan failure, usually better to ignore and keep scanning.
  // for example:
  console.warn(`Code scan error = ${error}`);
}

let html5QrcodeScanner = new Html5QrcodeScanner(
  "reader",
  { fps: 10, qrbox: { width: 250, height: 250 } },
  /* verbose= */ false
);
html5QrcodeScanner.render(onScanSuccess, onScanFailure);

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
      <div id="No">
      <div style="width: 100%; display: table; margin-bottom: -10px;">
       <div id="ThNo"style="width: 28%; height: 100%; display: table-cell; " ></div>
       <div id="TienNo"style="width: 72%; height: 100%; display: table-cell;" ></div>
      </div>
      </div>
      <!-- Phần chi tiết nợ -->
      <p style="margin-bottom: 7px;">Tổng tiền thu bao gồm dư nợ :</p>
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
