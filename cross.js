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

function updateDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString("it-IT");
  const time = now.toLocaleTimeString("it-IT", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 1,
  });

  document.getElementById(
    "datetime"
  ).textContent = `Data: ${date}\nOra: ${time}`;
}

setInterval(updateDateTime, 100);

var typed = new Typed("#typed", {
  stringsElement: "#typed-strings",
  typeSpeed: 100,
  backSpeed: 20,
  loop: true,
  loopCount: Infinity,
});
