const userCardTemplate = document.querySelector("[data-user-template]");
const userCardContainer = document.querySelector("[data-user-cards-container]");
const searchInput = document.querySelector("[data-search]");
const searchSelect = document.querySelector("[data-filter]");
const clickCard = document.querySelector("[header-id-left]");

let users = [];
searchSelect.addEventListener("change", (e) => {
  // khóa của Select là change
  const value = e.target.value.toLowerCase();
  console.log(value);
  users.forEach((user) => {
    const isVisible = user.ap.toLowerCase().includes(value);
    user.element.classList.toggle("hide", !isVisible);
  });
});

searchInput.addEventListener("input", (e) => {
  var Ap = document.getElementById("hamlet").value;
  console.log(Ap);
  const value = e.target.value.toLowerCase();
  console.log(value);
  users.forEach((user) => {
    const isVisible =
      user.name.toLowerCase().includes(value) ||
      user.id.toLowerCase().includes(value);
    user.element.classList.toggle("hide", !isVisible);
  });
});

fetch(
  "https://script.google.com/macros/s/AKfycbxiklKj4cX1IqhUEv31of-0tJbYp4RicCmQOlv3o8I5XnHxa_BCI01jrBtZ0Bx5UqVf/exec"
)
  .then((res) => res.json())
  .then((data) => {
    users = data.map((user) => {
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
        "💦Trung bình: " +
        user.Average.toLocaleString("en") +
        " m³/tháng" +
        "\n";
      body.textContent +=
        "🕖 Kỳ trước: " + user.LastNum.toLocaleString("en") + "\n";
      body.textContent += "💸 Dư nợ: " + user.Owe.toLocaleString("en") + "\n";

      userCardContainer.append(card);
      return { name: user.Name, id: user.IDKH, ap: user.Hamlet, element: card }; //chứa giá trị tìm kiếm trong CardContainer
    });
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
    console.log(uniqueArray4(result.Hamlet));
    values = uniqueArray4(result.Hamlet);
    countryDropDown(uniqueArray4(values));
  });
function test() {
  const x = document.getElementsByClassName("header-id-left")[1].innerHTML; //[1] lay index 1 trong array class giống nhau
  console.log(x);
}
const typeOf = (value) => Object.prototype.toString.call(value).slice(8, -1); //tạo hàm check date
//HAMLET DROPDOWNS
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
//UNIQUE https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
function uniqueArray4(a) {
  ar = [...new Set(a)];
  // remove blank el !="", el != null, undefined https://stackoverflow.com/questions/281264/remove-empty-elements-from-an-array-in-javascript  - da xu ly blank ben api
  var filtered = ar.filter(function (el) {
    return el != "";
  });
  return filtered;
}
//GET GHI CS JSON
function backCard() {
  alert(this.innerHTML);
  var IDKH = "HD0001";

  fetch(
    "https://script.google.com/macros/s/AKfycbzZ0SbWjHrawJANGrCrk1zGs5dfaBLSidXAOd80hZ1CCHN1Ezz_oak7r5xtWAqxFIX_/exec"
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      // var IDKH = "HD0001";

      results = data.filter((i) => IDKH.includes(i.IDKH)); //https://stackoverflow.com/questions/35817565/how-to-filter-array-when-object-key-value-is-in-array  - da xu ly blank ben api ko la se lay luon blank
      console.log(results);
    });
}
