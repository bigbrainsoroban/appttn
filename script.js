const userCardTemplate = document.querySelector("[data-user-template]");
const userCardContainer = document.querySelector("[data-user-cards-container]");
const searchInput = document.querySelector("[data-search]");
const filterSelected = document.querySelector("[data-filter]");
const clickCard = document.getElementsByClassName("fa-rotate-left");
//Array users response được xử lý đưa vào biến nhớ tạm users thay cho lưu trên local Storage
let users = [];
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

// APIs
const apiGetAllData =
  "https://script.google.com/macros/s/AKfycbxiklKj4cX1IqhUEv31of-0tJbYp4RicCmQOlv3o8I5XnHxa_BCI01jrBtZ0Bx5UqVf/exec";

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
    "🏠Tổng khối: " + user.Toltal.toLocaleString("en") + " m³" + "\n";
  body.textContent +=
    "💦Trung bình: " + user.Average.toLocaleString("en") + " m³/tháng" + "\n";
  body.textContent +=
    "🕖 Kỳ trước: " + user.LastNum.toLocaleString("en") + "\n";
  body.textContent += "💸 Dư nợ: " + user.Owe.toLocaleString("en") + "\n";
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
  // sorted.map((user) => {
  //   //map ra từng dòng
  //   return renderDataAll(user);
  // });
}
//Helper
function test() {
  const x = document.getElementsByClassName("header-id-left")[1].innerHTML; //[1] lay index 1 trong array class giống nhau
  console.log(x);
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
var IDKH = "HD0001";
const urlGetDataGhi =
  "https://script.google.com/macros/s/AKfycbzZ0SbWjHrawJANGrCrk1zGs5dfaBLSidXAOd80hZ1CCHN1Ezz_oak7r5xtWAqxFIX_/exec";
function backCard() {
  fetch(urlGetDataGhi)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      // var IDKH = "HD0001";
      // Filter
      results = data.filter((i) => IDKH.includes(i.IDKH)); //https://stackoverflow.com/questions/35817565/how-to-filter-array-when-object-key-value-is-in-array  - da xu ly blank ben api ko la se lay luon blank

      //sort a.RN-b.RN nho den lon, b.RN - a.RN lon toi nho, theo ABC a.name.localeCompare(b.name) -https://stackoverflow.com/questions/35576041/sort-json-by-value
      results.sort(function (a, b) {
        return b.RN - a.RN; //firstnew
      });
      console.log(results);
    });
}
