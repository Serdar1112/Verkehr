var sliderCorona = document.getElementById("countRange");
var outputCorona = document.getElementById("fallzahlen");
var sliderCar = document.getElementById("carRange");
var outputCar = document.getElementById("verkehr");
var outputTextCar = "";
var outputTextCorona = "";


outputCar.innerHTML = outputTextCar;
outputCorona.innerHTML = outputTextCorona;

//Verkehr Slider
sliderCar.oninput = function() {
  outputCar.innerHTML = outputTextCar;
  if(sliderCar.value <= 4){
    outputTextCar = "Sehr wenig Verkehr";
  }
  else if(sliderCar.value > 4 && this.value < 9)
  {
    outputTextCar = "Wenig Verkehr";
  }
  else if(sliderCar.value >= 9 && this.value < 13)
  {
    outputTextCar = "Viel Verkehr";
  }
  else if(sliderCar.value >= 13 && this.value <= 15)
  {
    outputTextCar = "Sehr viel Verkehr";
  }  
}
//Fallzahlen Slider
sliderCorona.oninput = function() {
outputCorona.innerHTML = outputTextCorona;

if(sliderCorona.value <= 4){
  outputTextCorona = "Sehr wenig Corona";
}
else if(sliderCorona.value > 4 && this.value < 9)
{
  outputTextCorona = "Wenig Corona";
}
else if(sliderCorona.value >= 9 && this.value < 13)
{
  outputTextCorona = "Viel Corona";
}
else if(sliderCorona.value >= 13 && this.value <= 15)
{
  outputTextCorona = "Sehr viel Corona";
}
}