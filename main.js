document.addEventListener("mousemove", (event) => {
  document.getElementById("crosshair-right").style.left =
    event.pageX + 20 + "px";
  document.getElementById("crosshair-right").style.top =
    event.pageY - window.scrollY + "px";

  document.getElementById("crosshair-left").style.left =
    event.pageX - 2020 + "px";
  document.getElementById("crosshair-left").style.top =
    event.pageY - window.scrollY + "px";

  document.getElementById("crosshair-top").style.left = event.pageX + "px";
  document.getElementById("crosshair-top").style.top =
    event.pageY - window.scrollY - 2020 + "px";

  document.getElementById("crosshair-bottom").style.left = event.pageX + "px";
  document.getElementById("crosshair-bottom").style.top =
    event.pageY - window.scrollY + 20 + "px";

  document.getElementById("coordinates").style.left = event.pageX + 25 + "px";
  document.getElementById("coordinates").style.top = event.pageY + 25 + "px";
  document.getElementById(
    "coordinates"
  ).textContent = `X: ${event.pageX}, Y: ${event.pageY}`;
});

if (document.querySelector("#typed")) {
  var typed = new Typed("#typed", {
    stringsElement: "#typed-strings",
    typeSpeed: 100,
    backSpeed: 20,
    loop: true,
    loopCount: Infinity,
  });
}
