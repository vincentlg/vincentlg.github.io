function myFunction() {
  var dots = document.getElementById("dots");
  var moreText = document.getElementById("more");
  var btnText = document.getElementById("myBtn");

  if (dots.style.display === "none") {
    dots.style.display = "inline";
    btnText.innerHTML = "Read more";
    moreText.style.display = "none";
  } else {
    dots.style.display = "none";
    btnText.innerHTML = "Read less";
    moreText.style.display = "inline";
  }
}

function vcReadMore() {
  var extra = document.getElementById("extra");
  var moreText = document.getElementById("plus");
  var vcbtnText = document.getElementById("vcBtn");

  if (extra.style.display === "none") {
    extra.style.display = "inline";
    vcbtnText.innerHTML = "Read more";
    plus.style.display = "none";
  } else {
    extra.style.display = "none";
    vcbtnText.innerHTML = "Read less";
    plus.style.display = "inline";
  }
}
