
<!DOCTYPE html>
<html lang="en">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
<meta charset="utf=8">
<link rel="stylesheet" href="me.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<link href="https://fonts.googleapis.com/css2?family=Caveat&family=Ruslan+Display&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">

<!-- jQuery library -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>

<!-- Latest compiled JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
<title>
</title>
</head>

<body style="overflow-x: hidden;">


<header>
      
  <nav class="nav">
    <div class="container">
        <div class="logo">
            <a href="#"><span><strong style="font-size: 30px;color: #ca5800;">B</strong></span>lazer</a>
        </div>
        <div id="mainListDiv" class="main_list">
            <ul class="navlinks">
                <li><a href="About.html">About</a></li>
                <li><a href="Find.html">Search</a></li>
                <li><a href="me.html">map</a></li>
                <li><a href="me.html">Contact</a></li>
            </ul>
        </div>
        <span class="navTrigger">
            <i></i>
            <i></i>
            <i></i>
        </span>
    </div>
    
</nav>
</header>
<?php
$email=$_POST["email"];
$comment=$_POST["comment"];

if(!$email){
  die("you must enter an email address");
}
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "user_comments";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo`<h5 class="Welkiemess">Connection failed:  . $conn->connect_error</h5>`;
}
$sql="INSERT INTO `right-commenting` (email,commo)
VALUES(?,?)";

$stmt=mysqli_stmt_init($conn);
if(!mysqli_stmt_prepare($stmt,$sql)){
  die(mysqli_error($conn));
}
mysqli_stmt_bind_param($stmt,"ss", $email,$comment);
mysqli_stmt_execute($stmt);
echo'<h3 class="Welkiemess" style=" color: #f1f8fc;
text-align: center;
font-size: 40px;">Your Comment has been saved</h3>'
?>
<footer>
  <div class="lighter">
    <div class="col1"><h3>Don't Wait Any Longer. Contact Us!</h3></div>
    <div class="col"><h1></h1>(123) 456-7890 24/7 Dedicated Customer Support</div>
    <div class="col"><button>Contact us</button></div>

  </div>
  <div class="dark">
    <div class="colB"><h1>About us</h1><br><br>
    <p style="color: rgb(130, 130, 132);">We are about the finding and the right decisions when it comes to travel</p>
    <br><br><div class="smedia">
      <a href="#" class="fa fa-facebook"></a>
      <a href="#" class="fa fa-twitter"></a>
      <a href="#" class="fa fa-linkedin"></a>
      <a href="#" class="fa fa-instagram"></a>

    </div>
  </div>
    <div class="colB"><h1>Discover</h1>
      <div class="links1">
            <li><a href="About.html">Home</a></li>
            <li><a href="Search.html">Search</a></li>
            <li><a href="me.html">Author</a></li>
    </div>
    </div>

  </div>
  <hr style="color:white; width: 100%; ">

  <small style="bottom: 10%; margin-left: 20px;">Copyright@2023- Marthar Nderitu</small>



</footer>


<script>
  $('.navTrigger').click(function () {
    $(this).toggleClass('active');
    console.log("Clicked menu");
    $("#mainListDiv").toggleClass("show_list");
    $("#mainListDiv").fadeIn();

});

$(window).scroll(function() {
            if ($(document).scrollTop() > 50) {
                $('.nav').addClass('affix');
                console.log("OK");
            } else {
                $('.nav').removeClass('affix');
            }
        });
  </script>

</body>
</html>