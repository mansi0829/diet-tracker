var table = document.getElementById("foodtable");
var calories = 0,
  fat = 0,
  carbohydrates = 0,
  protein = 0;

for (var i = 1; i < table.rows.length - 1; i++) {
  calories += parseFloat(table.rows[i].cells[1].innerHTML);

  fat += parseFloat(table.rows[i].cells[2].innerHTML);
  fat = Math.round(fat);

  carbohydrates += parseFloat(table.rows[i].cells[3].innerHTML);
  carbohydrates = Math.round(carbohydrates);

  protein += parseFloat(table.rows[i].cells[4].innerHTML);
  protein = Math.round(protein);
}

document.getElementById("totalCalories").innerHTML = "<b>" + calories + "</b>";
document.getElementById("totalFat").innerHTML = "<b>" + fat + "</b>";
document.getElementById("totalCarbohydrates").innerHTML =
  "<b>" + carbohydrates + "</b>";
document.getElementById("totalProtein").innerHTML = "<b>" + protein + "</b>";

var total = fat + carbohydrates + protein;

var fatPercentage = Math.round((fat / total) * 100);
var carbohydratesPercentage = Math.round((carbohydrates / total) * 100);
var proteinPercentage = Math.round((protein / total) * 100);

fatPercentage = fatPercentage ? fatPercentage : 0;
carbohydratesPercentage = carbohydratesPercentage ? carbohydratesPercentage : 0;
proteinPercentage = proteinPercentage ? proteinPercentage : 0;

// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily =
  'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
Chart.defaults.global.defaultFontColor = "#858796";

// Doughnut Chart - Macronutrients breakdown
var ctx = document.getElementById("myPieChart");
var myPieChart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: [
      "Fat " + fatPercentage + "%",
      "Carbs " + carbohydratesPercentage + "%",
      "Protein " + proteinPercentage + "%",
    ],
    datasets: [
      {
        data: [fatPercentage, carbohydratesPercentage, proteinPercentage],
        backgroundColor: ["#e5a641", "#55b560", "#419ad6"],
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    animation: {
      animateScale: true,
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
      title: {
        display: true,
        text: "Macronutrients Breakdown",
        font: {
          size: 20,
        },
      },
      datalabels: {
        display: true,
        color: "#fff",
        font: {
          weight: "bold",
          size: 16,
        },
        textAlign: "center",
      },
    },
  },
});

function setCalorieGoal(event) {
  event.preventDefault();
  const input = document.getElementById("calorieGoalInput");
  dailyCalorieGoal = input.value;
  localStorage.setItem("dailyCalorieGoal", dailyCalorieGoal);
  updateUI();
}

function updateUI() {
  updateProgress();
  updateRecommendation();
}

function updateProgress() {
    dailyCalorieGoal = localStorage.getItem("dailyCalorieGoal");
  var caloriePercentage = (calories / dailyCalorieGoal) * 100;
  $(".progress-bar").animate(
    {
      width: caloriePercentage + "%",
    },
    500
  );
  var interval = setInterval(function () {
    $(".progress-bar").html(caloriePercentage + "%");
  }, 500);
}

function updateRecommendation() {
    dailyCalorieGoal = localStorage.getItem("dailyCalorieGoal");
  let totalCaloriesConsumed = 0;
  const calorieElements = document.querySelectorAll("#foodtable tbody tr");
  calorieElements.forEach((calorieElement) => {
    totalCaloriesConsumed += parseInt(calorieElement.cells[1].innerText);
  });

  const remainingCalories = dailyCalorieGoal - totalCaloriesConsumed;
  let recommendedFoods = [];

  for (let i = 1; i < table.rows.length - 1; i++) {
    const food = {
      food_name: table.rows[i].cells[0].innerText,
      calories: parseInt(table.rows[i].cells[1].innerText),
    };
    if (food.calories <= remainingCalories) {
      recommendedFoods.push(food);
    }
  }

  const recommendationElement = document.querySelector("#recommendation");
  if (recommendedFoods.length === 0) {
    recommendationElement.innerHTML =
      "No recommended foods. You have met your daily calorie goal.";
  } else {
    let html = "<ul>";
    html="<b> Remaining Calories for the day: "+remainingCalories+"</b><br>";
    recommendedFoods.forEach((food) => {
      html += "<li>" + food.food_name + "</li>";
    });
    html += "</ul>";
    recommendationElement.innerHTML = html;
  }
}

// Call updateUI() once at the beginning to display initial progress bar and recommendation
updateUI();
